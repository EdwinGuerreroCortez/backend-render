const { ObjectId } = require('mongodb');
const express = require('express');

const faqsDispensadora = express.Router();

// Obtener la información de "FAQs"
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
