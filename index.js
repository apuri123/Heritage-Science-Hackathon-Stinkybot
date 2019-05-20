'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const app = express()


app.set('port', (process.env.PORT || 5000))

// Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// Process application/json
app.use(bodyParser.json())

// Index route
app.get('/', function (req, res) {
	res.send('Hello world, I am a chat botdfjbsdfn')
})

// All callbacks for Messenger will be POST-ed here
app.post("/webhook", function (req, res) {
  // Make sure this is a page subscription
	console.log("hi");
	res.sendStatus(200);
  if (req.body.object == "page") {
	  if (req.body.entry && req.body.entry.length <= 0) {
		  return;
	  }
	  
	  req.body.entry.forEach((pageEntry) => {
		  pageEntry.messaging.forEach((messagingEvent) => {
			  console.log(messagingEvent);
			  if (messagingEvent.message){
				  processMessage(messagingEvent);
			  }
			  
		  })
	  })
  }
  
});

// for Facebook verification
app.get('/webhook/', function (req, res) {
	if (req.query['hub.verify_token'] === 'my_voice_is_my_password_verify_me') {
		res.send(req.query['hub.challenge'])
	}
	res.send('Error, wrong token')
})

// Spin up the server
app.listen(app.get('port'), function() {
	console.log('running on port', app.get('port'))
})

// sends message to user
function sendMessage(recipientId, message) {
							console.log("sendMEssage");

  request({
    url: "https://graph.facebook.com/v2.6/me/messages",
    qs: {access_token: process.env.PAGE_ACCESS_TOKEN},
    method: "POST",
    json: {
      recipient: {id: recipientId},
      message: message,
    }
  }, function(error, response, body) {
    if (error) {
      console.log("Error sending message: " + response.error);
    }
  });
}

function processMessage(event) {
	console.log("here");
	console.log(event.message);
	event.message.is_echo = false;
  if (!event.message.is_echo) {
    var message = event.message;
    var senderId = event.sender.id;

    console.log("Received message from senderId: " + senderId);
    //console.log("Message is: " + JSON.stringify(message));
	console.log(message.text);

    // You may get a text or attachment but not both
    if (message.text) {
		console.log("process message");
      var formattedMsg = message.text;

			if(formattedMsg.includes("Hi")){
				console.log("hi received");
				sendMessage(senderId, {text: "Thank you for participating in the Barking Stink scent memories project. Do you consent to this project collecting data on your age and gender?"});
			} else if(formattedMsg.includes("yes")){
				sendMessage(senderId, {text: "What is your age and gender?"});			
			} else if(formattedMsg.includes("55 and female")){
				sendMessage(senderId, {text: "Do you have any recollection of specific smells in the Barking area?"});
			} else if(formattedMsg.includes("fishing industry")){
				sendMessage(senderId, {text: "When do you remember these smells / scents?"})
			} else if(formattedMsg.includes("70s")){
				sendMessage(senderId, {text: "When was the smell most dominant during the day?"})
			} else if(formattedMsg.includes("morning")){
				sendMessage(senderId, {text: "Where was the smell most dominant? (e.g. on the streets, along the river, etc)"})
			} else if(formattedMsg.includes("river")){
				sendMessage(senderId, {text: "What is the best word to describe its effect on you? (e.g. distracting, comforting, soothing, startling, jarring, repulsive, stomach turning)"})
			} else if(formattedMsg.includes("repulsive")){
				sendMessage(senderId, {text: "How strong was it? (faint, strong, medium)"})
			} else if(formattedMsg.includes("strong")){
				sendMessage(senderId, {text:"Do you associated postive, neutral or negative emotions with this scent?"})
			} else if(formattedMsg.includes("neutral")){
				sendMessage(senderId, {text:"What activities do you associate with this smell?"})
			} else if(formattedMsg.includes("fishing")){
				sendMessage(senderId, {text:"Thank you for participating. This information will be used to form a living history Barking."})
			}
      }
    }
}
