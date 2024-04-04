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
registroRouter.post('/usuario', async (req, res, next) => {
    const { username, password, tipo, correo, datos_cliente } = req.body;

    // Aquí asumo que `datos_cliente.pregunta` es un objeto que contiene `_id` y `respuesta`.
    // Extraemos el _id para usarlo como el valor de `pregunta` directamente.
    const preguntaId = datos_cliente.pregunta._id;
    const respuestaPregunta = datos_cliente.pregunta.respuesta;

    const collection = req.db.collection("usuarios");

    try {
        const usuarioExistente = await collection.findOne({ username: username });
        if (usuarioExistente) {
            return res.status(409).send("El nombre de usuario ya está en uso.");
        }

        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const nuevoUsuario = {
            username,
            password: hashedPassword,
            tipo,
            correo,
            datos_cliente: {
                ...datos_cliente,
                pregunta: preguntaId, // Asignamos el ID de la pregunta directamente
                direccion: { // Mantenemos la estructura de la dirección como está
                    ...datos_cliente.direccion,
                }
            },
            respuesta: respuestaPregunta, // Asignamos la respuesta fuera de `datos_cliente`
        };

        const resultado = await collection.insertOne(nuevoUsuario);

        if (resultado.acknowledged) {
            res.status(201).send("Usuario registrado con éxito.");
        } else {
            res.status(500).send("No se pudo registrar el usuario.");
        }
    } catch (error) {
        console.error("Error al registrar el usuario:", error);
        next(error);
    }
});

module.exports = registroRouter;