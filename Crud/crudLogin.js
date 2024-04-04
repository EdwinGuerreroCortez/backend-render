const express = require('express');
const usuarioLogin = express.Router();

//
usuarioLogin.get('/', async (req, res, next) => {
    const { username, password } = req.body;
    const collection = req.db.collection("usuarios");
    try {
        // Busca el usuario por nombre de usuario
        const user = await collection.findOne({ username });

        // Si no se encuentra el usuario, devuelve un mensaje de error
        if (!user) {
            return res.status(401).json({ message: "Nombre de usuario o contraseña incorrectos." });
        }

        // Compara la contraseña introducida con la contraseña almacenada en la base de datos
        if (password !== user.password) {
            return res.status(401).json({ message: "Nombre de usuario o contraseña incorrectos." });
        }

        // Si el nombre de usuario y la contraseña son correctos, devuelve el usuario
        res.json(user);
    } catch (error) {
        next(error);
    }
});

module.exports = usuarioLogin;
