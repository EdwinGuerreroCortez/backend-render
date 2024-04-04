// crud/Registro-usuarios

const express = require('express');
const { ObjectId } = require('mongodb');


const registroRouter= express.Router();


registroRouter.get('/', async (req, res, next) => {
    const collection = req.db.collection("pregunta");
    try {
        const pregunta = await collection.find({}).toArray();
        res.json(pregunta);
    } catch (error) {
        next(error); // pasa el error al manejador de errores de Express
    }
});

//POST DE REGISTRO
registroRouter.post('/', async (req, res, next) =>{
    const registroData= req.body;
    const collection = req.db.collection ("usuarios");
    try{
        //buscamos si el correo ya existe
        const result = await collection.insertOne(registroData);
        result.acknowledged
        ? res.status(201).send("Su registro se realizo con exito")
        : res.status(400).send("No se pudo realizar su registro");

    }catch (error){
        next(error);
    }
});

module.exports = registroRouter;