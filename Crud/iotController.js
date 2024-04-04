// iotController.js
const { client } = require('./MqttClient');

const publishMessage = (topic, message) => {
  client.publish(topic, message, { qos: 1 }, (error) => {
    if (error) {
      console.error(`Error al publicar mensaje: ${error}`);
    }
  });
};

module.exports = { publishMessage };
