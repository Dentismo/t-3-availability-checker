const mqtt = require('mqtt');
const AvailabilityController = require('../controller');

const availabilityController = new AvailabilityController();

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

    // Connection callback
    this.mqttClient.on('connect', () => {
    console.log(`mqtt client connected`);
    });

    const client = this.mqttClient;

    // mqtt subscriptions
    this.mqttClient.subscribe('mytopic', {qos: 0});

    this.mqttClient.subscribe('request/availablity', {qos: 1});

    // When a message arrives, console.log it
    this.mqttClient.on('message', function (topic, message) {
      // checkAvailability(message.toJSON)
      // console.log(message.toString());
      const response = availabilityController.checkAvailability(message.toJSON());
    });
  }
}  



// Sends a mqtt message to topic: mytopic
// sendMessage(message) {
//     this.mqttClient.publish('mytopic', message);
//   }

// confirmAvailablility(message) {
// this.mqttClient.publish('response/available/good', message)
//   }

// denyAvailablility(message) {
//   this.mqttClient.publish('response/available/bad', message)
//   }


module.exports = MqttHandler;