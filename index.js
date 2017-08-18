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
                sendTextMessage(sender, "Très bien et vous ?")
                sendGenericMessage(sender)
                continue
            }
            sendTextMessage(sender, "Bot: " + text.substring(0, 200))
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
                    "title": "Quick reply",
                    "buttons": [{
                        "type": "postback",
                        "title": "Je vais bien,merci",
                        "payload": "Node.js est une plateforme de développement Javascript. Ce n'est ni un serveur ,ni un Framework, c'est juste le langage Javascript avec des bibliothèques permettant de réaliser des actions comme écrire sur la sortie standard, ouvrir/fermer des connections réseaux ou encore créer un fichier.",
                    },{
                        "type": "postback",
                        "title": "Non,ça ne va pas",
                        "payload": "Heroku est une plateforme « Cloud » qui permet d’héberger, de développer tout type d’application. La plateforme appartient à Salesforce, gage de sécurité, de confidentialité et de haute performance.",
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

