/**
 * Follow this for guidance 
 * https://developers.google.com/calendar/api/quickstart/nodejs
 * 
 */


// const fs = require('fs').promises;
// const path = require('path');
// const process = require('process');
// const {authenticate} = require('@google-cloud/local-auth');
// const {google} = require('googleapis');

// // If modifying these scopes, delete token.json.
// const SCOPES = ['https://www.googleapis.com/auth/calendar'];
// // const SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];
// // The file token.json stores the user's access and refresh tokens, and is
// // created automatically when the authorization flow completes for the first
// // time.
// const TOKEN_PATH = path.join(process.cwd(), 'token.json');
// const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');

// /**
//  * Reads previously authorized credentials from the save file.
//  *
//  * @return {Promise<OAuth2Client|null>}
//  */
// async function loadSavedCredentialsIfExist() {
//   try {
//     const content = await fs.readFile(TOKEN_PATH);
//     const credentials = JSON.parse(content);
//     return google.auth.fromJSON(credentials);
//   } catch (err) {
//     return null;
//   }
// }

// /**
//  * Serializes credentials to a file compatible with GoogleAuth.fromJSON.
//  *
//  * @param {OAuth2Client} client
//  * @return {Promise<void>}
//  */
// async function saveCredentials(client) {
//   const content = await fs.readFile(CREDENTIALS_PATH);
//   const keys = JSON.parse(content);
//   const key = keys.installed || keys.web;
//   const payload = JSON.stringify({
//     type: 'authorized_user',
//     client_id: key.client_id,
//     client_secret: key.client_secret,
//     refresh_token: client.credentials.refresh_token,
//   });
//   await fs.writeFile(TOKEN_PATH, payload);
// }

// /**
//  * Load or request or authorization to call APIs.
//  *
//  */
// async function authorize() {
//   let client = await loadSavedCredentialsIfExist();
//   if (client) {
//     return client;
//   }
//   client = await authenticate({
//     scopes: SCOPES,
//     keyfilePath: CREDENTIALS_PATH,
//   });
//   if (client.credentials) {
//     await saveCredentials(client);
//   }
//   return client;
// }





//IF WE DONOT WANT TO CREATE A TOKEN.JSON FILE


const path = require('path');
const process = require('process');
const {authenticate} = require('@google-cloud/local-auth');
const {google} = require('googleapis');

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/calendar'];
// const SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
// const TOKEN_PATH = path.join(process.cwd(), 'token.json');
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');
//credentials should be created and O AUth screen should be made from google console.
let savedCredentials = null;

/**
 * Reads previously authorized credentials from the save file.
 *
 * @return {Promise<OAuth2Client|null>}
 */
async function loadSavedCredentialsIfExist() {
  return savedCredentials;
}

/**
 * Serializes credentials to a file compatible with GoogleAuth.fromJSON.
 *
 * @param {OAuth2Client} client
 * @return {Promise<void>}
 */
async function saveCredentials(client) {
  savedCredentials = client;
}

/**
 * Load or request or authorization to call APIs.
 *
 */
async function authorize() {
  let client = await loadSavedCredentialsIfExist();
  if (client) {
    return client;
  }
  client = await authenticate({
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH,
  });
  if (client.credentials) {
    await saveCredentials(client);
  }
  return client;
}
/**
 * Lists the next 10 events on the user's primary calendar.
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
async function listEvents(auth) {
  const calendar = google.calendar({version: 'v3', auth});
  const res = await calendar.events.list({
    calendarId: 'primary',
    timeMin: new Date().toISOString(),
    maxResults: 10,
    singleEvents: true,
    orderBy: 'startTime',
  });
  const events = res.data.items;
  if (!events || events.length === 0) {
    console.log('No upcoming events found.');
    return;
  }
  console.log('Upcoming 10 events:');
  events.map((event, i) => {
    const start = event.start.dateTime || event.start.date;
    console.log(`${start} - ${event.summary}`);
  });
}

const createEvent=(auth)=>{
  // Refer to the Node.js quickstart on how to setup the environment:
// https://developers.google.com/calendar/quickstart/node
// Change the scope to 'https://www.googleapis.com/auth/calendar' and delete any
// stored credentials.
const calendar = google.calendar({ version: 'v3', auth });
const event = {
  'summary': 'Test event creation',
  'location': 'Online',
  'description': 'Testing events for the WEB API of Recrutify',
  'start': {
    'dateTime': '2024-03-07T02:00:00+05:30',
    'timeZone': 'Asia/Kolkata',
  },
  'end': {
    'dateTime': '2024-03-07T22:00:00+05:30',
    'timeZone': 'Asia/Kolkata',
  },
  // 'recurrence': [
  //   'RRULE:FREQ=DAILY;COUNT=2'
  // ],
  'attendees': [
    {'email': 'raj.yash1217@gmail.com'},
    {'email': 'itzsapiena@gmail.com'},
    // {'email': 'devanshpriyadarshan2001@gmail.com'},
    {'email':"yashreya888@gmail.com"}
  ],
  'reminders': {
    'useDefault': false,
    'overrides': [
      {'method': 'email', 'minutes': 24 * 60},
      {'method': 'popup', 'minutes': 10},
    ],
  },
  // conferenceData: {
  //   createRequest: {requestId: "7qxalsvy0e"}
    
  // }
  'conferenceData': {
    'createRequest': {
      'requestId': "7qxalsvy0e",
      'conferenceSolutionKey': {
        'type': 'hangoutsMeet' 
      },
    },
  },
};


calendar.events.insert({
  auth: auth,
  calendarId: 'primary',
  resource: event,
  conferenceDataVersion:1,
  sendNotifications:true,
  eventId: "7cbh8rpc10lrc0ckih9tafss99"
}, function(err, event) {
  if (err) {
    console.log('There was an error contacting the Calendar service: ' + err);
    return;
  }
  console.log(event.data.hangoutLink);
  console.log('Event created: %s', event.data.htmlLink);
});

// gapi.client.calendar.events.patch({
//   calendarId: "primary",
//   eventId: "7cbh8rpc10lrc0ckih9tafss99",
//   resource: eventPatch,
//   sendNotifications: true,
//   conferenceDataVersion: 1
// }).execute(function(event) {
//   console.log("Conference created for event: %s", event.htmlLink);
// });

}
// authorize().then(listEvents).catch(console.error);

authorize().then(createEvent).catch(console.error);