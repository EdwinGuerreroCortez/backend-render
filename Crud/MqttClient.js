const mqtt = require('mqtt');
let lastPotValue = 0;
let lastTopic1Value = 0;
let lastAguaValue = 0; 
let lastPlatoAgua = 0; 
let lastComida = 0; 
let lastPlatoComida = 0; 

const client = mqtt.connect('mqtt://broker.emqx.io', {
  port: 1883,
  username: 'amiMascota',
  password: 'edwin123'
});

client.on('connect', () => {
  console.log('Conectado al broker MQTT.');

  // Subscribe to the desired topic
  const topics = ['amiMascota/potenciometro', 'amiMascota/agua', 'amiMascota/Platoagua','amiMascota/comida','amiMascota/PlatoComida']; // Add 'amiMascota/agua' to topics array
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
        case 'amiMascota/potenciometro':
          lastPotValue = numericValue;
          break;
        case 'amiMascota/agua':
          lastAguaValue = numericValue; // Actualizar el valor de lastAguaValue con el valor del tema 'amiMascota/agua'
          break;
        case 'amiMascota/Platoagua':
          lastPlatoAgua = numericValue;
          break;
        case 'amiMascota/comida':
          lastComida = numericValue;
          break;
        case 'amiMascota/PlatoComida':
          lastPlatoComida = numericValue;
          break;
        default:
          console.log('Mensaje recibido de un tópico no manejado:', topic);
      }
    } else {
      console.log('Mensaje no numérico recibido en el tópico:', topic);
    }
  });

const getLastPotValue = () => lastPotValue;
const getLastTopic1Value = () => lastTopic1Value;
const getLastAguaValue = () => lastAguaValue; // Nueva función para obtener el valor de lastAguaValue
const getLastPlatoAguaValue = () =>lastPlatoAgua;
const getLastComidaValue = () =>lastComida;
const getLastPlatoComidaValue = () =>lastPlatoComida;

module.exports = { client, getLastPotValue, getLastTopic1Value, getLastAguaValue,getLastPlatoAguaValue,getLastComidaValue,getLastPlatoComidaValue }; // Actualizado para incluir getLastAguaValue
