const res = require('express/lib/response');
const mqtt = require('mqtt');
const checkAvailability = require('../controller');
var Validator = require("jsonschema").Validator

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
      client.subscribe('request/availability', { qos: 1 });
    });


    // When a message arrives, console.log it
    this.mqttClient.on('message', async function (topic, message) {
      var bookingRequest = JSON.parse(message)
      if (validateBookingRequest(bookingRequest).length == 0) {
        const result = await checkAvailability(JSON.parse(message.toString()));
        if (result.accepted) {
          client.publish('request/createBooking', JSON.stringify(result))
        } else {
          client.publish('response/createBooking', JSON.stringify(result))
          console.log(result)
        }
      } else {
        client.publish('response/createBooking', 'Invalid booking request body')
      }
    });

    function validateBookingRequest(bookingRequest) {
      const errors = [];
      const stateEnum = ['approved', 'denied', 'pending']

      if (!("name" in bookingRequest.user)) {
        errors.push('name: missing')
      } else if (typeof bookingRequest.user.name !== 'string') {
        errors.push('name: must be type string')
      }

      if (!("email" in bookingRequest.user)) {
        errors.push('email: missing')
      } else if (/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(bookingRequest.email)) {
        errors.push('email: must be a valid email')
      }

      if (!("clinicId" in bookingRequest)) {
        errors.push('clinicId: missing')
      } else if (typeof bookingRequest.clinicId !== 'string') {
        errors.push('clinicId: must be type string')
      } else if(bookingRequest.clinicId.length < 1){
        errors.push('clinicId: invalid length')
      }

      if (!("issuance" in bookingRequest)) {
          errors.push('issuance: missing')
        } else if (typeof bookingRequest.issuance !== 'string') {
          errors.push('issuance: must be type string')
        } else if(bookingRequest.issuance.length < 1 || bookingRequest.issuance.length > 13){
          errors.push('issuance: invalid length')
        }

      if (!("date" in bookingRequest)) {
        errors.push('date: missing')
      } else if (typeof bookingRequest.date !== 'string') {
        errors.push('date: must be type string')
      }

      if (!("state" in bookingRequest)) {
        errors.push('state: missing')
      } else if (typeof bookingRequest.state !== 'string') {
        errors.push('state: must be type string')
      } else if (!(stateEnum.includes(bookingRequest.state))) {
        errors.push('state: must have a value of approved, pending or denied')
      }

      if (!("start" in bookingRequest)) {
        errors.push('start: missing')
      } else if (typeof bookingRequest.start !== 'string') {
        errors.push('start: must be type string')
      }

      if (!("end" in bookingRequest)) {
        errors.push('end: missing')
      } else if (typeof bookingRequest.end !== 'string') {
        errors.push('end: must be type string')
      }
      return errors
    }
  }
}


module.exports = MqttHandler;