let ToneAnalyzerV3 = require('watson-developer-cloud/tone-analyzer/v3')

const TONE_ACCESS_TOKEN = process.env.TONE_ACCESS_TOKEN

let toneAnalyzer = new ToneAnalyzerV3({
  version: '2017-09-21',
  iam_apikey: TONE_ACCESS_TOKEN,
  url: 'https://gateway.watsonplatform.net/tone-analyzer/api'
})

//for error handling
// toneAnalyzer.method(params, function(err, response) {
//   // The error will be the first argument of the callback
//   if (err.code == 404) {
//     // Handle Not Found (404) error
//   } else if (err.code == 413) {
//     // Handle Request Too Large (413) error
//   } else {
//     console.log('Unexpected error: ', err.code)
//     console.log('error:', err)
//   }
// })

// export const toneParams = {
//   tone_input: {text: text},
//   content_type: 'application/json'
// }

// export const watsonToneAnalysis = toneAnalyzer.tone(toneParams, function(
//   error,
//   toneAnalysis
// ) {
//   if (error) {
//     console.log(error)
//   } else {
//     console.log(JSON.stringify(toneAnalysis, null, 2))
//   }
// })

module.exports = {
  toneAnalyzer
}
