// Handles messaging_postbacks events
export const handlePostback = function(sender_psid, received_postback) {
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
