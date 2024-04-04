const { ObjectId } = require('mongodb');
const express = require('express');

const datosEmpresaRouter = express.Router();

datosEmpresaRouter.get('/', async (req, res, next) => {
  const collection = req.db.collection("datosEmpresa");
  try {
    const datosEmpresa = await collection.find({}).toArray();
    res.json(datosEmpresa);
  } catch (error) {
    next(error); 
  }
});

module.exports = datosEmpresaRouter;
