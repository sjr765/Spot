'use strict'

const {toneAnalyzer} = require('./toneAnalyzer')
const passport = require('passport')
const request = require('request')
const path = require('path')
const SpotifyWebApi = require('spotify-web-api-node')
const axios = require('axios')
const express = require('express'),
  bodyParser = require('body-parser'),
  app = express().use(bodyParser.json())
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: process.env.SPOTIFY_CALLBACK
})
import {handleMessage, callSendApi, handlePostback} from './messagefunctions'

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

      // Get the sender PSID
      let sender_psid = webhook_event.sender.id
      console.log('Sender PSID: ' + sender_psid)

      // Check if the event is a message or postback and
      // pass the event to the appropriate handler function
      if (webhook_event.message) {
        //WATSON ANALYSIS

        const chatBotText = webhook_event.message.text

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

        // spotifyApi.searchTracks('artist:Love').then(
        //   function(data) {
        //     console.log(data.body)
        //     console.log(data.body.tracks.items[1])
        //   },
        //   function(err) {
        //     console.log('Something went wrong!', err)
        //   }
        // )
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
