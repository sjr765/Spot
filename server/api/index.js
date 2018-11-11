// const router = require('express').Router()
// const SpotifyWebAPI = require('spotify-web-api-node')
// const axios = require('axios')
// module.exports = router

// const spotifyConfig = new SpotifyWebAPI({
//   clientID: process.env.SPOTIFY_CLIENT_ID,
//   clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
//   callbackURL: process.env.SPOTIFY_CALLBACK
// })

// // router.get('/', async (req, res, next) => {
// // await axios({
// //   method: 'get',
// //   url: 'https://api.spotify.com/v1/me/top/artists',
// //   dataType: 'jsonData',
// //   headers: {
// //     'Accept': 'application/json',
// //     'Authorization': `Bearer ${req.user.dataValues.accessId}`,
// //     'Content-Type': 'application/json'
// //   }})
// // })

// router.get('/top-artists/:accessId', async (req, res, next) => {
//   const accessToken = req.params.accessId
//   try {
//     axios({
//       method: 'get',
//       url: 'https://api.spotify.com/v1/me/top/artists',
//       headers: {
//         Authorization: 'Bearer ' + accessToken
//       },
//       params: {
//         limit: '50',
//         time_range: 'long_term'
//       }
//     }).then(response => {
//       // console.log('RESPONSE.DATA.ITEMS', response.data.items)
//       // console.log('*****WHOLE RESPONSE*****', response)
//       const topArtistData = response.data.items
//       res.json(topArtistData)
//     })
//     // .then(cleanData => console.log('PLEASE WORK:', cleanData))
//     // .then(data => console.log('DATA SHOULD BE HERE', data))
//     // res.json(data)
//   } catch (err) {
//     console.error(err)
//   }
// })
