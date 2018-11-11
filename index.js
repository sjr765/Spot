'use strict'

const {toneAnalyzer} = require('./toneAnalyzer')
const passport = require('passport')
const request = require('request')
const path = require('path')
const SpotifyWebApi = require('spotify-web-api-node')
const axios = require('axios')
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN
const express = require('express'),
  bodyParser = require('body-parser'),
  app = express().use(bodyParser.json())
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: process.env.SPOTIFY_CALLBACK
})
spotifyApi.clientCredentialsGrant().then(
  function(data) {
    console.log('The access token is ' + data.body['access_token'])
    spotifyApi.setAccessToken(data.body['access_token'])
  },
  function(err) {
    console.log('Something went wrong!', err)
  }
)

app.listen(process.env.PORT || 1337, () => console.log('webhook is listening'))
app.use(express.static(path.join(__dirname, 'public')))

// app.get('/', function(req, res) {
//   res.redirect('https://accounts.spotify.com/authorize?')
//   querystring.stringify({
//     response_type: 'code',
//     client_id: process.env.SPOTIFY_CLIENT_ID,
//     scope: 'user-read-private user-read-email',
//     redirectUri
//   })
// })

// Creates the endpoint for our webhook
app.post('/webhook', (req, res) => {
  // Parse the request body from the POST
  let body = req.body

  // Check the webhook event is from a Page subscription
  if (body.object === 'page') {
    // Iterate over each entry - there may be multiple if batched
    body.entry.forEach(function(entry) {
      // Gets the body of the webhook event
      let webhook_event = entry.messaging[0]
      console.log(webhook_event)

      let sender_psid = webhook_event.sender.id
      console.log('Sender PSID: ' + sender_psid)

      if (webhook_event.message) {
        //WATSON ANALYSIS

        // const chatBotText = webhook_event.message.text

        // const toneParams = {
        //   tone_input: {text: chatBotText},
        //   content_type: 'application/json',
        //   sentences: false
        // }

        // toneAnalyzer.tone(toneParams, function(error, toneAnalysis) {
        //   if (error) {
        //     console.log(error)
        //   } else {
        //     console.log('======== TONE ANALYSIS FROM WATSON ============')
        //     console.log(JSON.stringify(toneAnalysis, null, 2))
        //     console.log(
        //       '======== END OF TONE ANALYSIS FROM WATSON ============'
        //     )
        //   }
        // })

        console.log('!!!!!!!!!!!!!!! SPOTIFY API CALL HERE!!!!!!!!!')
        const spotifyUserToken = spotifyApi._credentials.accessToken

        try {
          axios({
            method: 'get',
            url: 'https://api.spotify.com/v1/recommendations',
            headers: {
              Authorization: 'Bearer ' + spotifyUserToken
            },
            params: {
              limit: '1',
              market: 'US',
              seed_genres: 'funk',
              min_popularity: '20'
            }
          }).then(response => {
            console.log('RESPONSE.DATA.TRACKS', response.data.tracks)
            // console.log('*****WHOLE RESPONSE*****', response)
            const recommendedSongs = response.data.tracks
            res.json(recommendedSongs)
          })
        } catch (err) {
          console.error(err)
        }

        console.log('!!!!!!!!!!!!!!! SPOTIFY API END HERE!!!!!!!!!')

        //handle message
        handleMessage(sender_psid, webhook_event.message)
      } else if (webhook_event.postback) {
        handlePostback(sender_psid, webhook_event.postback)
      }
    })

    // Return a '200 OK' response to all events
    res.status(200).send('EVENT_RECEIVED')
  } else {
    // Return a '404 Not Found' if event is not from a page subscription
    res.sendStatus(404)
  }
})

// Adds support for GET requests to our webhook
app.get('/webhook', (req, res) => {
  // Your verify token. Should be a random string.
  let VERIFY_TOKEN = 'SPOT_THE_CHAT_BOT'

  // Parse the query params
  let mode = req.query['hub.mode']
  let token = req.query['hub.verify_token']
  let challenge = req.query['hub.challenge']

  // Checks if a token and mode is in the query string of the request
  if (mode && token) {
    // Checks the mode and token sent is correct
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      // Responds with the challenge token from the request
      console.log('WEBHOOK_VERIFIED')
      res.status(200).send(challenge)
    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403)
    }
  }
})

// Handles messages events
function handleMessage(sender_psid, received_message) {
  let response
  let counter = 0

  // Check if the message contains text
  if (received_message.text) {
    // Create the payload for a basic text message
    if (counter === 0) {
      response = {
        text: `WOOF Hi there! I'm Spot the Spotify Dog. I'd love to give you some song recomendations based on how you're feeling today. Does that sound good to you?`
      }
      if (counter === 1) {
        response = {
          text: 'WOOF Perfect, Lets get started! WOOF'
        }
      }
    }
  } else if (received_message.attachments) {
    // Get the URL of the message attachment
    let attachment_url = received_message.attachments[0].payload.url
    response = {
      attachment: {
        type: 'template',
        payload: {
          template_type: 'generic',
          elements: [
            {
              title: 'Is this the right picture?',
              subtitle: 'Tap a button to answer.',
              image_url: attachment_url,
              buttons: [
                {
                  type: 'postback',
                  title: 'Yes!',
                  payload: 'yes'
                },
                {
                  type: 'postback',
                  title: 'No!',
                  payload: 'no'
                }
              ]
            }
          ]
        }
      }
    }
  }

  // Sends the response message
  callSendAPI(sender_psid, response)
}

// Handles messaging_postbacks events
function handlePostback(sender_psid, received_postback) {
  let response

  // Get the payload for the postback
  let payload = received_postback.payload

  // Set the response based on the postback payload
  if (payload === 'yes') {
    response = {text: 'Thanks!'}
  } else if (payload === 'no') {
    response = {text: 'Oops, try sending another image.'}
  }
  // Send the message to acknowledge the postback
  callSendAPI(sender_psid, response)
}

// Sends response messages via the Send API
function callSendAPI(sender_psid, response) {
  // Construct the message body
  let request_body = {
    recipient: {
      id: sender_psid
    },
    message: response
  }
  // Send the HTTP request to the Messenger Platform
  request(
    {
      uri: 'https://graph.facebook.com/v2.6/me/messages',
      qs: {access_token: PAGE_ACCESS_TOKEN},
      method: 'POST',
      json: request_body,
      messaging_type: 'RESPONSE'
    },
    (err, res, body) => {
      if (!err) {
        console.log('message sent!')
      } else {
        console.error('Unable to send message:' + err)
      }
    }
  )
}
