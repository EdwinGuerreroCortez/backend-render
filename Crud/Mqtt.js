// Mqtt.js
const express = require('express');
const router = express.Router();
const { publishMessage } = require('./iotController');
const { getLastPotValue, getLastTopic1Value , getLastAguaValue, getLastPlatoAguaValue, getLastComidaValue,getLastPlatoComidaValue  } = require('./MqttClient');

router.post('/controlLed', (req, res) => {
    const { estado } = req.body;
    const topic = 'amiMascota/Led';
    publishMessage(topic, estado);
    res.json({ mensaje: `Comando para LED ${estado} enviado correctamente.` });
});

router.get('/potentiometer', (req, res) => {
    try {
      const valor = getLastPotValue();
      res.json({ valor });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Un error ocurrió al obtener el valor del potenciómetro.' });
    }
});
router.get('/topic1', (req, res) => {
    try {
      const valor = getLastTopic1Value();
      res.json({ valor }); // Envía el valor al frontend
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Un error ocurrió al obtener el valor de path/to/your/topic1.' });
    }
  });
  router.get('/agua', (req, res) => {
    try {
      const valorAgua = getLastAguaValue(); // Obtiene el valor del nivel del tanque de agua desde el cliente MQTT
      res.json({ valor: valorAgua }); // Envia el valor como respuesta JSON
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Un error ocurrió al obtener el valor del nivel del tanque de agua.' });
    }
});
router.get('/platoagua', (req, res) => {
  try {
    const valorPlatoAgua = getLastPlatoAguaValue(); // Obtiene el valor del nivel del tanque de agua desde el cliente MQTT
    res.json({ valor: valorPlatoAgua }); // Envia el valor como respuesta JSON
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Un error ocurrió al obtener el valor del nivel del tanque de agua.' });
  }
});
router.post('/controlBomba', (req, res) => {
  const { comando } = req.body;
  const topic = 'amiMascota/control_bomba'; // Tema MQTT para controlar la bomba de agua
  publishMessage(topic, comando);
  res.json({ mensaje: `Comando para la bomba de agua ${comando} enviado correctamente.` });
});
router.get('/comida', (req, res) => {
  try {
    const valorComida = getLastComidaValue(); // Obtiene el valor del nivel del tanque de agua desde el cliente MQTT
    res.json({ valor: valorComida }); // Envia el valor como respuesta JSON
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Un error ocurrió al obtener el valor del nivel del tanque de agua.' });
  }
});
router.get('/platocomida', (req, res) => {
  try {
    const valorPlatoComida = getLastPlatoComidaValue(); // Obtiene el valor del nivel del tanque de agua desde el cliente MQTT
    console.log(`Mensaje recibido en el tópico amiMascota/PlatoComida: ${valorPlatoComida}`); // Agregar esta línea para imprimir en la consola
    res.json({ valor: valorPlatoComida }); // Envia el valor como respuesta JSON
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Un error ocurrió al obtener el valor del nivel del tanque de agua.' });
  }
});

module.exports = router;
