// const router = require('express').Router()
// const passport = require('passport')
// const SpotifyWebApi = require('spotify-web-api-node')
// const SpotifyStrategy = require('passport-spotify').Strategy
// module.exports = router

// passport.serializeUser(function(user, done) {
//   done(null, user)
// })

// passport.deserializeUser(function(obj, done) {
//   done(null, obj)
// })

// const spotifyConfig = {
//   clientID: process.env.SPOTIFY_CLIENT_ID,
//   clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
//   callbackURL: process.env.SPOTIFY_CALLBACK
// }

// if (!process.env.SPOTIFY_CLIENT_ID || !process.env.SPOTIFY_CLIENT_SECRET) {
//   console.log('Spotify client ID / secret not found.')
// } else {
//   const spotifyConfig = {
//     clientID: process.env.SPOTIFY_CLIENT_ID,
//     clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
//     callbackURL: process.env.SPOTIFY_CALLBACK
//   }
//   passport.use(
//     new SpotifyStrategy(
//       spotifyConfig,
//       (accessToken, refreshToken, expires_in, profile, done) => {
//         process.nextTick(async () => {
//           console.log('PROFILE OBJ IN AUTH/SPOTIFY:', profile)
//           const profileJSON = profile._json
//           const spotifyId = profileJSON.id
//           const email = profileJSON.email
//           let username = profileJSON.display_name
//           const name = username.replace(' ', '-')
//           const accessId = accessToken
//           const refreshId = refreshToken
//           // const access_token = accessToken;
//           // const refresh_token = refreshToken;
//           // profileUrl = https.open.spotify.com/user/${spotifyId} || profileJSON.href
//           // uri = profileJSON.uri

//           console.log('EXPIRES IN:', expires_in)
//         })
//       }
//     )
//   )

//   router.get(
//     '/',
//     passport.authenticate('spotify', {
//       scope: [
//         'user-read-email',
//         'playlist-modify-private',
//         'playlist-modify-public',
//         'user-read-recently-played',
//         'user-read-private',
//         'user-top-read'
//       ],
//       showDialog: true
//     }),
//     (req, res) => {}
//   )

//   router.get(
//     '/callback',
//     passport.authenticate('spotify', {
//       // successRedirect: '/home',
//       failureRedirect: '/login'
//     }),
//     (req, res) => {
//       res.redirect('/')
//     }
//   )
// }
