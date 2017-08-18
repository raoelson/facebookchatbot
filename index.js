'use strict'

var express = require('express')
var bodyParser = require('body-parser')
var request = require('request')
var app = express()

app.set('port', (process.env.PORT || 5000))

// Process urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// Process json
app.use(bodyParser.json())

// Index route
app.get('/', function (req, res) {
    res.send('Bonjour, Je suis votre Facebook Messenger Bot')
})

app.get('/webhook/', function (req, res) {
    if (req.query['hub.verify_token'] === 'Bot_Messenger_App') {
        res.send(req.query['hub.challenge'])
    }
    res.send('Error, wrong token')
})

app.listen(app.get('port'), function() {
    console.log('running on port', app.get('port'))
})


// End Point

app.post('/webhook/', function (req, res) {
    let messaging_events = req.body.entry[0].messaging
    for (let i = 0; i < messaging_events.length; i++) {
        let event = req.body.entry[0].messaging[i]
        let sender = event.sender.id
        if (event.message && event.message.text) {
            let text = event.message.text
            if (text === 'salut') {
                sendGenericMessage(sender)
                continue
            }
            sendTextMessage(sender, "Bot: " + text.substring(0, 200))
        }
        if (event.postback) {
            let text = JSON.stringify(event.postback)
            sendTextMessage(sender, "Postback received: "+text.substring(0, 200), token)
            continue
        }
    }
    res.sendStatus(200)
})

var token = "EAAKEvlfZA46IBAIzfadyUalTuAIJlnAnTnNWBY9fbgMg9k8iEmYlAlryIj6XkADxZC5OS6hZAcUXLZCIp1J1Xasp0QvJharNJPolucciRQ0LX1PObeurrZAvGC1Y70dJtZCbAY4hjrTLkwrUIzBIlDm7M5mQkV7wFQfYTgyHkRHoVNBOmAiPZClXVDowVseNTMZD"

// Echo back messages

function sendTextMessage(sender, text) {
   let messageData = {
        text:text
    }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}
       

// Two cards.

function sendGenericMessage(sender) {
    let messageData = {"attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [{
                    "title": "Choses à savoir créer un bot",
                    "subtitle": "Quelques questions sur notre bot",
                    "image_url": "https://raw.githubusercontent.com/mlaidouni/FacebookBot/master/facebook-chatbots.png",
                    "buttons": [{
                        "type": "postback",
                        "title": "C’est quoi un bot Facebook?",
                        "payload": "Un bot conversationnel, c’est un logiciel informatique qui réalise des conversations automatisées. Un bot Facebook, c’est la même chose, mais sur un certain réseau social",
                    },{
                        "type": "postback",
                        "title": "Quelles sont les entreprises qui ont essayé les bots ?",
                        "payload": "Il s’agit de CNN, qui vous envoie un briefing par message chaque matin, comme une newsletter, quoi. En France, il y a notamment Skyscanner, Voyages-Sncf et KLM.",
                    }, {
                        "type": "postback",
                        "title": "Comment créer votre bot Facebook?",
                        "payload": "Il existe deux façons pour créer un bot facebook, soit d'utiliser une plateforme sans codage ou le créer en codage",
                    }],
                }]  
            } 
        }
    
    }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}

