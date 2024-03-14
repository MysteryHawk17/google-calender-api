const express = require('express');
const { google } = require('googleapis');
const dotenv = require('dotenv');

dotenv.config({});

const app = express();

const PORT = process.env.PORT || 8000;

const calendar = google.calendar({
    version: 'v3',
    auth: process.env.CLIENT_API_KEY
})

const oauth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URL
)

const scopes = [
    'https://www.googleapis.com/auth/calendar'
]

app.get('/google', (req, res) => {

    const url = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes
    });

    res.redirect(url);
});

app.post('/google/redirect', async (req, res) => {
    const code = req.query.code;

    const { tokens } = await oauth2Client.getToken(code)
    oauth2Client.setCredentials(tokens)
    const event = {
        'summary': 'Test event creation',
        'location': 'Online',
        'description': 'Testing events for the WEB API of Recrutify',
        'start': {
            'dateTime': '2024-03-15T02:00:00+05:30',
            'timeZone': 'Asia/Kolkata',
        },
        'end': {
            'dateTime': '2024-03-15T22:00:00+05:30',
            'timeZone': 'Asia/Kolkata',
        },
        'attendees': [
            { 'email': 'yashreya8882.0@gmail.com' },
            { 'email': 'yashreya888@gmail.com' },
            // {'email': 'devanshpriyadarshan2001@gmail.com'},
            // { 'email': "aakashprajapat59@gmail.com" }
        ],
        'reminders': {
            'useDefault': false,
            'overrides': [
                { 'method': 'email', 'minutes': 24 * 60 },
                { 'method': 'popup', 'minutes': 10 },
            ],
        },
        'conferenceData': {
            'createRequest': {
                'requestId': "7qxalsvy0e",
                'conferenceSolutionKey': {
                    'type': 'hangoutsMeet'
                },
            },
        },
    };
    try {
        const eventScheduled = await calendar.events.insert({
            calendarId: 'primary',
            auth: oauth2Client,
            conferenceDataVersion: 1,
            sendNotifications: true,
            requestBody: event,

        });

        res.send('Done the work');
    } catch (error) {
        console.log(error);
        return res.send("ERROR")
    }
});



app.listen(PORT, () => {
    console.log(`server started at ${PORT}`);
})