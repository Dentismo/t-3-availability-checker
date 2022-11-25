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

    // Connection callback
    this.mqttClient.on('connect', () => {
      console.log(`mqtt client connected`);
    });

    const client = this.mqttClient;

    // mqtt subscriptions
    this.mqttClient.subscribe('mytopic', { qos: 0 });

    this.mqttClient.subscribe('request/availablity', { qos: 1 });

    // When a message arrives, console.log it
    this.mqttClient.on('message', async function (topic, message) {
      const response = await checkAvailability(message.toJSON());
      console.log('BRFORE CHECKING')
      if (response === '{message: Success - "Time-slot is available"}') {
        client.publish('response/availablity/good', response)
        console.log('SUCCESS')
      } else {
        client.publish('response/availablity/bad', response)
        console.log('FAILURE')
        //console.log(response.toString())
      }
      // const array = response.toString().split(" ")
      // console.log(response.toString())
      // switch (array[1]) {
      //   case "Failure":
      //     this.mqttClient.publish('response/availablity/bad', response)
      //     break;
      //   case "Success":
      //   this.mqttClient.publish('response/availablity/good', response)
      //     break;
      // }
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