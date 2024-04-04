
    const { ObjectId } = require('mongodb');
    const express = require('express');
    const bcrypt = require('bcrypt'); // Asegúrate de incluir esta línea


    const usuarioRouter = express.Router();

    usuarioRouter.get('/', async (req, res, next) => {
        const collection = req.db.collection("usuarios");
        try {
            const usuarios = await collection.find({}).toArray();
            res.json(usuarios);
        } catch (error) {
            next(error); // pasa el error al manejador de errores de Express
        }
    });

    usuarioRouter.post('/', async (req, res, next) => {
        const usuarioData = req.body;
        const collection = req.db.collection("usuarios");
        try {
            const result = await collection.insertOne(usuarioData);
            result.acknowledged
                ? res.status(201).send("Usuario creado con éxito.")
                : res.status(400).send("No se pudo crear el usuario.");
        } catch (error) {
            next(error);
        }
    });

    usuarioRouter.delete('/:id', async (req, res, next) => {
        const { id } = req.params;
        if (!ObjectId.isValid(id)) {
            return res.status(400).send("Invalid ID format.");
        }
        const collection = req.db.collection("usuarios");
        try {
            const result = await collection.deleteOne({ "_id": new ObjectId(id) });
            result.deletedCount === 1
                ? res.status(204).end()
                : res.status(404).send("User not found.");
        } catch (error) {
            next(error);
        }
    });

    usuarioRouter.patch('/:id', async (req, res, next) => {
        const { id } = req.params;
        const updateData = req.body;
        if (!ObjectId.isValid(id)) {
            return res.status(400).send("Invalid ID format.");
        }
        const collection = req.db.collection("usuarios");
        try {
            const result = await collection.updateOne({ "_id": new ObjectId(id) }, { $set: updateData });
            result.modifiedCount === 1
                ? res.status(200).send("User updated successfully.")
                : res.status(404).send("User not found.");
        } catch (error) {
            next(error);
        }
    });

    usuarioRouter.put('/:id', async (req, res, next) => {
        const { id } = req.params;
        const updateData = req.body;
        if (!ObjectId.isValid(id)) {
            return res.status(400).send("Invalid ID format.");
        }
        const collection = req.db.collection("usuarios");
        try {
            const result = await collection.updateOne({ "_id": new ObjectId(id) }, { $set: updateData });
            result.modifiedCount === 1
                ? res.status(200).send("User updated successfully.")
                : res.status(404).send("User not found.");
        } catch (error) {
            next(error);
        }
    });
    usuarioRouter.post('/:id/cambiar-contrasena', async (req, res) => {
        const { id } = req.params;
        const { contraseñaActual, nuevaContraseña } = req.body;
    
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ mensaje: "Formato de ID inválido." });
        }
    
        const collection = req.db.collection("usuarios");
    
        try {
            const usuario = await collection.findOne({ "_id": new ObjectId(id) });
            if (!usuario) {
                return res.status(404).json({ mensaje: "Usuario no encontrado." });
            }
    
            // Verificar que la contraseña actual es correcta
            const contraseñaValida = await bcrypt.compare(contraseñaActual, usuario.password);
            if (!contraseñaValida) {
                return res.status(403).json({ mensaje: "La contraseña actual es incorrecta." });
            }
    
            // Encriptar la nueva contraseña
            const nuevaContraseñaHash = await bcrypt.hash(nuevaContraseña, 10);
    
            // Actualizar la contraseña en la base de datos
            const resultado = await collection.updateOne(
                { "_id": new ObjectId(id) },
                { $set: { password: nuevaContraseñaHash } }
            );
    
            if (resultado.modifiedCount === 1) {
                return res.status(200).json({ mensaje: "Contraseña actualizada con éxito." });
            } else {
                throw new Error('La contraseña no pudo ser actualizada.');
            }
        } catch (error) {
            console.error('Error al cambiar la contraseña:', error);
            return res.status(500).json({ mensaje: "Error interno del servidor." });
        }
    });
    
    usuarioRouter.post('/:id/asignar-dispositivo', async (req, res, next) => {
        const { id } = req.params;
        const { codigoDispositivo } = req.body;
    
        if (!ObjectId.isValid(id)) {
            return res.status(400).send("Invalid ID format.");
        }
    
        const collectionUsuarios = req.db.collection("usuarios");
        const collectionDispositivos = req.db.collection("dispensadoras");
    
        try {
            // Buscar el dispositivo por código
            const dispositivo = await collectionDispositivos.findOne({ codigo: codigoDispositivo });
            if (!dispositivo) {
                return res.status(404).json({ mensaje: "Dispositivo no encontrado." });
            }
    
            // Verificar si el dispositivo ya está asignado a otro usuario
            if (dispositivo.assignedTo) {
                return res.status(400).json({ mensaje: "El dispositivo ya está asignado a un usuario." });
            }
    
            // Agregar el dispositivo al array de dispositivos del usuario
            await collectionUsuarios.updateOne(
                { _id: new ObjectId(id) },
                { $addToSet: { iotDev: dispositivo._id } } // $addToSet evita duplicados
            );
    
            // Actualizar el dispositivo con el ID del usuario asignado
            await collectionDispositivos.updateOne(
                { _id: dispositivo._id },
                { $set: { assignedTo: new ObjectId(id) } }
            );
    
            res.status(200).json({ mensaje: "Dispositivo asignado correctamente." });
        } catch (error) {
            next(error);
        }
    });
    
    usuarioRouter.get('/:id/dispositivo-asignado', async (req, res, next) => {
        const { id } = req.params;
    
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ mensaje: "Formato de ID inválido." });
        }
    
        const collectionUsuarios = req.db.collection("usuarios");
    
        try {
            const usuario = await collectionUsuarios.findOne({ "_id": new ObjectId(id) }, { projection: { iotDev: 1 } });
    
            if (!usuario || !usuario.iotDev || usuario.iotDev.length === 0) {
                return res.status(404).json({ mensaje: "No hay dispositivos asignados a este usuario." });
            }
    
            // Suponiendo que necesitas cargar detalles de cada dispositivo asignado
            const collectionDispositivos = req.db.collection("dispensadoras");
            const dispositivos = await collectionDispositivos.find({ "_id": { $in: usuario.iotDev.map(id => new ObjectId(id)) } }).toArray();
    
            res.json(dispositivos);
        } catch (error) {
            next(error);
        }
    });
    usuarioRouter.post('/login', async (req, res) => {
        const { username, password } = req.body;
        const collection = req.db.collection("usuarios");
    
        try {
            // Intenta encontrar el usuario por nombre de usuario o correo electrónico
            const usuario = await collection.findOne({ $or: [{ username }, { correo: username }] });
    
            if (!usuario) {
                // Usuario no encontrado
                return res.status(404).json({ message: "Usuario no encontrado" });
            }
    
            // Verifica que la contraseña coincida
            const passwordMatch = await bcrypt.compare(password, usuario.password);
            if (!passwordMatch) {
                // Contraseña incorrecta
                return res.status(401).json({ message: "Credenciales inválidas" });
            }
    
            // Verifica que el usuario sea del tipo "cliente"
            if (!usuario.tipo.includes("cliente")) {
                // Usuario no es de tipo cliente
                return res.status(401).json({ message: "Usuario no autorizado" });
            }
    
            // Inicio de sesión exitoso: envía el ID del usuario como parte de la respuesta
            res.json({
                message: "Inicio de sesión exitoso",
                userId: usuario._id // Envía el ID del usuario
            });
    
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error interno del servidor" });
        }
    });
    usuarioRouter.get('/:id', async (req, res) => {
        const { id } = req.params;
    
        if (!ObjectId.isValid(id)) {
            return res.status(400).send("Formato de ID inválido.");
        }
    
        try {
            const usuario = await req.db.collection("usuarios").findOne({ "_id": new ObjectId(id) }, { projection: { password: 0 } });
            if (!usuario) {
                return res.status(404).send("Usuario no encontrado.");
            }
            
            res.json(usuario);
        } catch (error) {
            console.error('Error al obtener datos del usuario:', error);
            res.status(500).send("Error interno del servidor.");
        }
    });
    usuarioRouter.patch('/editarPefil/:id', async (req, res, next) => {
        const { id } = req.params;
        const updateData = req.body;
    // Eliminar explícitamente el campo _id de updateDaxta
    delete updateData._id;
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Invalid ID format." });
        }
    
        const collection = req.db.collection("usuarios");
    
        try {
            const result = await collection.updateOne({ "_id": new ObjectId(id) }, { $set: updateData });
            if (result.modifiedCount === 1) {
                res.status(200).json({ message: "User updated successfully." });
            } else {
                res.status(404).json({ error: "User not found." });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });
    
    module.exports = usuarioRouter;
