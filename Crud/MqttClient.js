const mqtt = require('mqtt');
let lastJsonValue1 = 0;
let lastJsonValue2 = 0;
let lastJsonValue3 = 0;
let lastJsonValue4 = 0;

const client = mqtt.connect('mqtt://broker.emqx.io', {
  port: 1883,
  username: 'Edwin',
  password: 'edwin123'
});

client.on('connect', () => {
  console.log('Conectado al broker MQTT.');

  // Subscribe to the desired topics
  const topics = ['topic1', 'topic2', 'topic3', 'topic4']; // Add topics array
  client.subscribe(topics, (err, granted) => {
    if (!err) {
      console.log('Subscribed to topics successfully:');
      granted.forEach(sub => console.log(`- ${sub.topic}`));
    } else {
      console.error('Error al suscribirse:', err);
    }
  });
});

client.on('message', (topic, message) => {
    const messageString = message.toString();
    const numericValue = parseFloat(messageString); // Convertir el mensaje a número

    if (!isNaN(numericValue)) {
      console.log(`Valor numérico recibido en el tópico ${topic}: ${numericValue}`);

      // Actualizar el valor correspondiente según el tópico
      switch (topic) {
        case 'topic1':
          lastJsonValue1 = numericValue;
          break;
        case 'topic2':
          lastJsonValue2 = numericValue;
          break;
        case 'topic3':
          lastJsonValue3 = numericValue;
          break;
        case 'topic4':
          lastJsonValue4 = numericValue;
          break;
        default:
          console.log('Mensaje recibido de un tópico no manejado:', topic);
      }
    } else {
      console.log('Mensaje no numérico recibido en el tópico:', topic);
    }
  });

const getLastJsonValue1 = () => lastJsonValue1;
const getLastJsonValue2 = () => lastJsonValue2;
const getLastJsonValue3 = () => lastJsonValue3;
const getLastJsonValue4 = () => lastJsonValue4;

module.exports = { client, getLastJsonValue1, getLastJsonValue2, getLastJsonValue3, getLastJsonValue4 };
