/* eslint-disable  func-names */
/* eslint-disable  no-console */

const Alexa = require('ask-sdk');
const rp = require('request-promise');
const moment = require('moment');


const GetNewJokeHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    
    return request.type === 'LaunchRequest'
      || (request.type === 'IntentRequest'
        && request.intent.name === 'GetNewJokeIntent');
  },
  handle(handlerInput) {
    const factArr = data2;
    const factIndex = Math.floor(Math.random() * factArr.length);
    const randomFact = factArr[factIndex];
    const request = handlerInput.requestEnvelope.request;
    //var friendName = handlerInput.requestEnvelope.request.intent.slots.name.value;
    var friendName = request.intent.slots.name.value;
    const speechOutput = GET_FACT_MESSAGE + friendName+ ' ' + randomFact;

    return handlerInput.responseBuilder
      .speak(speechOutput)
      .withSimpleCard(SKILL_NAME, randomFact)
      .getResponse();
  },
};

function setNewReminder(handlerInput) {
  const alert = {};
  const event = handlerInput.requestEnvelope;
  const timezone = 'Germany/Berlin';

  
  //const time = getTournamentTime();
  const time = request.intent.slots.time.value;
  // Lop off trailing Z from string
  let start = time.toISOString();
  if (start.substring(start.length - 1) === 'Z') {
    start = start.substring(0, start.length - 1);
  }

  // Set locale to English so recurrence.byDay is properly set
  moment.locale('en');
  alert.requestTime = start;
  alert.trigger = {
    type: 'SCHEDULED_ABSOLUTE',
    scheduledTime: start,
    timeZoneId: timezone,
    recurrence: {
      freq: 'WEEKLY',
      byDay: [moment(time).format('dd').toUpperCase()],
    },
  };
  alert.alertInfo = {
    spokenInfo: {
      content: [{
        locale: event.request.locale,
        text: 'The Slot Machine tournament is starting now.',
      }],
    },
  };
  alert.pushNotification = {
    status: 'ENABLED',
  };
  const params = {
    url: event.context.System.apiEndpoint + '/v1/alerts/reminders',
    method: 'POST',
    headers: {
      'Authorization': 'bearer ' + event.context.System.apiAccessToken,
    },
    json: alert,
  };

  // Post the reminder
  return rp(params).then((body) => {
    // Reminder was set OK
    return 'OK';
  })
  .catch((err) => {
    console.log('SetReminder error ' + err.error.code);
    console.log('SetReminder alert: ' + JSON.stringify(alert));
    return err.error.code;
  });
}

const GetNewFactHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'LaunchRequest'
      || (request.type === 'IntentRequest'
        && request.intent.name === 'GetNewFactIntent');
  },
  handle(handlerInput) {
    const factArr = data;
    const factIndex = Math.floor(Math.random() * factArr.length);
    const randomFact = factArr[factIndex];
    const speechOutput = GET_FACT_MESSAGE + randomFact;

    return handlerInput.responseBuilder
      .speak(speechOutput)
      .withSimpleCard(SKILL_NAME, randomFact)
      .getResponse();
  },
};

const HelpHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'
      && request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak(HELP_MESSAGE)
      .reprompt(HELP_REPROMPT)
      .getResponse();
  },
};

const ExitHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'
      && (request.intent.name === 'AMAZON.CancelIntent'
        || request.intent.name === 'AMAZON.StopIntent');
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak(STOP_MESSAGE)
      .getResponse();
  },
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);

    return handlerInput.responseBuilder.getResponse();
  },
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);

    return handlerInput.responseBuilder
      .speak('Sorry, an error occurred.')
      .reprompt('Sorry, an error occurred.')
      .getResponse();
  },
};

const SKILL_NAME = 'Space Facts';
const GET_FACT_MESSAGE = 'Here\'s your fact: ';
const HELP_MESSAGE = 'You can say tell me a space fact, or, you can say exit... What can I help you with?';
const HELP_REPROMPT = 'What can I help you with?';
const STOP_MESSAGE = 'Goodbye!';


const data = [
  'A year on Mercury is just 88 days long.',
  'Despite being farther from the Sun, Venus experiences higher temperatures than Mercury.',
  'Venus rotates counter-clockwise, possibly because of a collision in the past with an asteroid.',
  'On Mars, the Sun appears about half the size as it does on Earth.',
  'Earth is the only planet not named after a god.',
  'Jupiter has the shortest day of all the planets.',
  'The Milky Way galaxy will collide with the Andromeda Galaxy in about 5 billion years.',
  'The Sun contains 99.86% of the mass in the Solar System.',
  'The Sun is an almost perfect sphere.',
  'A total solar eclipse can happen once every 1 to 2 years. This makes them a rare event.',
  'Saturn radiates two and a half times more energy into space than it receives from the sun.',
  'The temperature inside the Sun can reach 15 million degrees Celsius.',
  'The Moon is moving approximately 3.8 cm away from our planet every year.',
];
const data2 = [
  
  'Your mum  is so fat thanos had to snap twice.',
  'Your mum’s so stupid she puts lipstick on her forehead to make up her mind.',
  '<say-as interpret-as="interjection">aw man</say-as>.',
  '<say-as interpret-as="interjection">aooga</say-as>.',
  '<say-as interpret-as="interjection">bada bing bada boom</say-as>.',
  '<say-as interpret-as="interjection">cock a doodle doo</say-as>.',
  '<say-as interpret-as="interjection">duh</say-as>.',
  '<say-as interpret-as="interjection">geronimo</say-as>.',
  
  

  
];

const skillBuilder = Alexa.SkillBuilders.standard();

exports.handler = skillBuilder
  .addRequestHandlers(
    GetNewFactHandler,
    GetNewJokeHandler,
    HelpHandler,
    ExitHandler,
    SessionEndedRequestHandler
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();
