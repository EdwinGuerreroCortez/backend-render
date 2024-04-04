// backend/index.js
require('dotenv').config();
const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');

// Routers
const usuarioRouter = require('./Crud/crudUsuario');
const productosRouter = require('./Crud/crudProductos');
const quienesSomosRouter = require('./Crud/crudQuienesSomos');
const misionVisionRouter = require('./Crud/crudMisionVision');
const politicasPrivacidadRouter = require('./Crud/crudPoliticas');
const datosEmpresaRouter = require('./Crud/datosEmpresa');
const imagenesRouter = require('./Crud/crudImagenes');
const registroRouter = require('./Crud/crudRegistro');
const faqsRouter = require('./Crud/crudFaqs');
const faqsDispensadora = require('./Crud/crudDispensadora');
const iotRoutes = require('./Crud/Mqtt'); // Asegúrate de que la ruta sea correcta.

const app = express();
const port = process.env.PORT || 3001;
const mongoUri = process.env.MONGODB_URI;

app.use(cors());
app.use(express.json());

const client = new MongoClient(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

async function connectDB() {
    try {
        await client.connect();
        console.log("Connected to MongoDB");
        const db = client.db("bdResina");
        app.use((req, res, next) => {
            req.db = db;
            next();
        });
        // Usar todos los routers
        app.use('/api/usuarios', usuarioRouter);
        app.use('/api/productos', productosRouter);
        app.use('/api/quienesSomos', quienesSomosRouter);
        app.use('/api/misionVision', misionVisionRouter);
        app.use('/api/politicasPrivacidad', politicasPrivacidadRouter);
        app.use('/api/datosEmpresa', datosEmpresaRouter);
        app.use('/api/imagenes', imagenesRouter);
        app.use('/api/registro', registroRouter);
        app.use('/api/faqs', faqsRouter);7
        app.use('/api/dispositivo', faqsDispensadora);
        app.use('/api/iot', iotRoutes); // Integra el router de IoT
        
        app.listen(port, () => {
            console.log(`Server running at http://localhost:${port}`);
        });
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1);
    }
}

connectDB().catch(error => {
    console.error("Failed to connect to the database", error);
});
