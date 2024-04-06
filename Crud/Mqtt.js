// Mqtt.js
const express = require('express');
const router = express.Router();
const { publishMessage } = require('./iotController');

const { getLastJsonValue1, getLastJsonValue2, getLastJsonValue3, getLastJsonValue4 } = require('./MqttClient');

router.get('/topic1', (req, res) => {
    try {
        const valor = getLastJsonValue1();
        res.json({ valor });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Un error ocurrió al obtener el valor del tópico 1.' });
    }
});

router.get('/topic2', (req, res) => {
    try {
        const valor = getLastJsonValue2();
        res.json({ valor });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Un error ocurrió al obtener el valor del tópico 2.' });
    }
});

router.get('/topic3', (req, res) => {
    try {
        const valor = getLastJsonValue3();
        res.json({ valor });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Un error ocurrió al obtener el valor del tópico 3.' });
    }
});

router.get('/topic4', (req, res) => {
    try {
        const valor = getLastJsonValue4();
        res.json({ valor });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Un error ocurrió al obtener el valor del tópico 4.' });
    }
});
router.post('/activarMotor', (req, res) => {
  const { mensaje } = req.body; // Extrae el mensaje del cuerpo de la solicitud
  if (!mensaje) {
      return res.status(400).json({ error: 'Falta el mensaje en la solicitud.' });
  }

  try {
      // Usa el mensaje proporcionado en la solicitud para enviar a través de MQTT
      publishMessage('motor/control', mensaje);
      res.json({ mensaje: `Comando '${mensaje}' enviado al motor.` });
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Un error ocurrió al intentar activar el motor.' });
  }
});
router.post('/activarRele', (req, res) => {
  const { mensaje } = req.body; // Extrae el mensaje del cuerpo de la solicitud
  if (!mensaje) {
      return res.status(400).json({ error: 'Falta el mensaje en la solicitud.' });
  }

  try {
      // Usa el mensaje proporcionado en la solicitud para enviar a través de MQTT
      publishMessage('rele/control', mensaje);
      res.json({ mensaje: `Comando '${mensaje}' enviado al motor.` });
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Un error ocurrió al intentar activar el motor.' });
  }
});

module.exports = router;
