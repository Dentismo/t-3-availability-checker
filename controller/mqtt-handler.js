const mqtt = require('mqtt');
const checkAvailability = require('../controller');

//const availabilityController = new AvailabilityController();

class MqttHandler {
  constructor() {
    this.mqttClient = null;
    this.host = 'http://localhost:1883';
    this.username = 'YOUR_USER'; // mqtt credentials if these are needed to connect
    this.password = 'YOUR_PASSWORD';
  }

  connect() {
    // Connect mqtt with credentials (in case of needed, otherwise we can omit 2nd param)
    this.mqttClient = mqtt.connect(this.host, { username: this.username, password: this.password });

    // Mqtt error calback
    this.mqttClient.on('error', (err) => {
      console.log(err);
      this.mqttClient.end();
    });

    const client = this.mqttClient;

    // Connection callback
    this.mqttClient.on('connect', () => {
      console.log(`mqtt client connected`);
      client.subscribe('request/availablity', { qos: 1 });
    });


    // When a message arrives, console.log it
    this.mqttClient.on('message', async function (topic, message) {
      const result = await checkAvailability(JSON.parse(message.toString()));
      if( result.accepted )
        client.publish('request/createBooking', JSON.stringify(result))
      else 
        client.publish('response/createBooking', JSON.stringify(result))
      
      console.log(result)
    });
  }
}


module.exports = MqttHandler;