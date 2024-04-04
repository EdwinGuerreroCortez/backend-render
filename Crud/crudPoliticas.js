const { ObjectId } = require('mongodb');
const express = require('express');

const politicasPrivacidadRouter = express.Router();

// Obtener la información de "Políticas de Privacidad"
politicasPrivacidadRouter.get('/', async (req, res, next) => {
    const collection = req.db.collection("politicasPrivacidad");
    try {
        const info = await collection.find({}).toArray();
        res.json(info);
    } catch (error) {
        next(error); // Pasa el error al manejador de errores de Express
    }
});

// Crear o actualizar la información de "Políticas de Privacidad"
politicasPrivacidadRouter.post('/', async (req, res, next) => {
    const infoData = req.body;
    const collection = req.db.collection("politicasPrivacidad");
    try {
        const result = await collection.insertOne(infoData);
        result.acknowledged
            ? res.status(201).send("Información creada con éxito.")
            : res.status(400).send("No se pudo crear la información.");
    } catch (error) {
        next(error);
    }
});

// Eliminar la información de "Políticas de Privacidad"
politicasPrivacidadRouter.delete('/:id', async (req, res, next) => {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
        return res.status(400).send("Formato de ID inválido.");
    }
    const collection = req.db.collection("politicasPrivacidad");
    try {
        const result = await collection.deleteOne({ "_id": new ObjectId(id) });
        result.deletedCount === 1
            ? res.status(204).end()
            : res.status(404).send("Información no encontrada.");
    } catch (error) {
        next(error);
    }
});

// Actualizar la información de "Políticas de Privacidad"
politicasPrivacidadRouter.patch('/:id', async (req, res, next) => {
    const { id } = req.params;
    const updateData = req.body;
    if (!ObjectId.isValid(id)) {
        return res.status(400).send("Formato de ID inválido.");
    }
    const collection = req.db.collection("politicasPrivacidad");
    try {
        const result = await collection.updateOne({ "_id": new ObjectId(id) }, { $set: updateData });
        result.modifiedCount === 1
            ? res.status(200).send("Información actualizada con éxito.")
            : res.status(404).send("Información no encontrada.");
    } catch (error) {
        next(error);
    }
});

module.exports = politicasPrivacidadRouter;
