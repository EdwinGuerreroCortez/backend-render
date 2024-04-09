const { ObjectId } = require('mongodb');
const express = require('express');

const faqsDispensadora = express.Router();

// Endpoint para actualizar un documento específico
faqsDispensadora.put('/:id', async (req, res, next) => {
    const collection = req.db.collection("dispensadoras");
    const dispensadorId = req.params.id;
    const updatedDispensador = req.body;

    // Validación básica de los datos recibidos
    if (!ObjectId.isValid(dispensadorId)) {
        return res.status(400).json({ message: "ID de dispensador no válido" });
    }

    try {
        const result = await collection.updateOne(
            { _id: new ObjectId(dispensadorId) },
            { $set: updatedDispensador }
        );

        if (result.matchedCount === 1) {
            return res.json({ message: "Documento actualizado correctamente" });
        } else {
            return res.status(404).json({ message: "Documento no encontrado" });
        }
    } catch (error) {
        console.error('Error al actualizar el documento:', error);
        return res.status(500).json({ message: "Error interno del servidor" });
    }
});
// Endpoint para crear una nueva dispensadora
faqsDispensadora.post('/', async (req, res, next) => {
    const collection = req.db.collection("dispensadoras");
    const newDispensador = req.body;

    try {
        // Insertar la nueva dispensadora en la base de datos
        const result = await collection.insertOne(newDispensador);

        // Verificar si la inserción fue exitosa
        if (result.insertedCount === 1) {
            return res.status(201).json({ message: "Dispensadora creada correctamente", id: result.insertedId });
        } else {
            return res.status(500).json({ message: "Error al crear la dispensadora" });
        }
    } catch (error) {
        console.error('Error al crear la dispensadora:', error);
        return res.status(500).json({ message: "Error interno del servidor" });
    }
});
faqsDispensadora.get('/no-asignados', async (req, res, next) => {
    const collection = req.db.collection("dispensadoras");
    try {
        const dispositivosNoAsignados = await collection.find({ assignedTo: null }).toArray();
        res.json(dispositivosNoAsignados);
    } catch (error) {
        next(error);
    }
});


module.exports = faqsDispensadora;
