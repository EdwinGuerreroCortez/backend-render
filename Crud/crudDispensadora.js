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


module.exports = faqsDispensadora;
