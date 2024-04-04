// crud/crudUsuario.js
const { ObjectId } = require('mongodb');
const express = require('express');


const productosRouter = express.Router();

productosRouter.get('/', async (req, res, next) => {
    const collection = req.db.collection("productos");
    try {
        const productos = await collection.find({}).toArray();
        res.json(productos);
    } catch (error) {
        next(error); // pasa el error al manejador de errores de Express
    }
});
// GET /:id - Obtener detalles de un producto específico por su ID
productosRouter.get('/detalles/:id', async (req, res, next) => {
    const { id } = req.params; // Extrae el ID de los parámetros de la ruta
    if (!ObjectId.isValid(id)) {
        return res.status(400).send("Invalid ID format."); // Verifica si el ID es válido
    }
    const collection = req.db.collection("productos");
    try {
        const producto = await collection.findOne({ "_id": new ObjectId(id) }); // Busca el producto por su ID
        if (producto) {
            res.json(producto); // Devuelve los detalles del producto si se encuentra
        } else {
            res.status(404).send("Product not found."); // Envía un error si el producto no se encuentra
        }
    } catch (error) {
        next(error); // Pasa el error al manejador de errores de Express
    }
});

productosRouter.post('/', async (req, res, next) => {
    const productoData = req.body;
    const collection = req.db.collection("productos");
    try {
        const result = await collection.insertOne(productoData);
        result.acknowledged
            ? res.status(201).send("Usuario creado con éxito.")
            : res.status(400).send("No se pudo crear el usuario.");
    } catch (error) {
        next(error);
    }
});

productosRouter.delete('/:id', async (req, res, next) => {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
        return res.status(400).send("Invalid ID format.");
    }
    const collection = req.db.collection("productos");
    try {
        const result = await collection.deleteOne({ "_id": new ObjectId(id) });
        result.deletedCount === 1
            ? res.status(204).end()
            : res.status(404).send("User not found.");
    } catch (error) {
        next(error);
    }
});

productosRouter.patch('/:id', async (req, res, next) => {
    const { id } = req.params;
    const updateData = req.body;
    if (!ObjectId.isValid(id)) {
        return res.status(400).send("Invalid ID format.");
    }
    const collection = req.db.collection("productos");
    try {
        const result = await collection.updateOne({ "_id": new ObjectId(id) }, { $set: updateData });
        result.modifiedCount === 1
            ? res.status(200).send("User updated successfully.")
            : res.status(404).send("User not found.");
    } catch (error) {
        next(error);
    }
});
productosRouter.get('/categorias', async (req, res, next) => {
    const collection = req.db.collection("productos");
    try {
        const categorias = await collection.distinct("categoria");
        res.json(categorias);
    } catch (error) {
        next(error);
    }
});
productosRouter.get('/categorias/:categoria', async (req, res, next) => {
    const { categoria } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    const collection = req.db.collection("productos");

    try {
        const totalProductos = await collection.countDocuments({ categoria: categoria });
        const productosFiltrados = await collection.find({ categoria: categoria })
                                                    .skip(skip)
                                                    .limit(limit)
                                                    .toArray();
        res.json({
            totalProductos,
            productos: productosFiltrados,
            paginaActual: page,
            totalPaginas: Math.ceil(totalProductos / limit)
        });
    } catch (error) {
        next(error);
    }
});
productosRouter.get('/paginacion', async (req, res, next) => {
    const collection = req.db.collection("productos");
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    try {
        const totalProductos = await collection.countDocuments();
        const productos = await collection.find({})
            .skip(skip)
            .limit(limit)
            .toArray();
        const totalPages = Math.ceil(totalProductos / limit);

        // Devuelve los productos junto con información de paginación
        res.json({ totalPages, currentPage: page, limit, totalProductos, productos });
    } catch (error) {
        next(error);
    }
});
// Ruta para buscar productos por nombre
productosRouter.get('/buscar', async (req, res, next) => {
    const { query } = req.query; // Recibe el texto de búsqueda desde el parámetro de consulta 'query'
    const collection = req.db.collection("productos");
    console.log(`Recibida solicitud de búsqueda para: ${query}`);


    try {
        const productos = await collection.find({
            nombre: { $regex: new RegExp("^" + query, "i") }
        }).toArray();
        
        res.json(productos);
    } catch (error) {
        next(error);
    }
});
productosRouter.get('/categoriass', async (req, res, next) => {
    const collection = req.db.collection("productos");
    try {
        const categorias = await collection.distinct("categoria");
        res.json(categorias);
    } catch (error) {
        next(error);
    }
});

module.exports = productosRouter;
