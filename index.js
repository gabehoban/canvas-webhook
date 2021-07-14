// Require express and body-parser
const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');
const fs = require('fs');

// Setup SSl
var key = fs.readFileSync(__dirname + '/certs/privkey.pem');
var cert = fs.readFileSync(__dirname + '/certs/fullchain.pem');
var options = {
  key: key,
  cert: cert,
};

require('dotenv').config();
const token = process.env.CANVAS_API_TOKEN;
const domain = process.env.CANVAS_DOMAIN

// Initialize express and define a port
const app = express();
const PORT = 3000;

// Tell express to use body-parser's JSON parsing
app.use(bodyParser.json());

app.post('/hook', (req, res) => {
    res.status(200).end(); // Responding is important

    let body = req.body
    switch (body.eventName) {
        case 'order.completed':
            console.log(body)
            const data = JSON.stringify({
                user: {
                    name: body.content.user.billingAddressName,
                    short_name: body.content.user.billingAddressName,
                    time_zone: 'Eastern Time (US & Canada)',
                    locale: 'en-US',
                    terms_of_use: true,
                },
                pseudonym: {
                    unique_id: body.content.user.email,
                    force_self_registration: true
                },
                communication_channel: {
                    type: 'email',
                    address: body.content.user.email
                }
              })

              const options = {
                hostname: domain,
                port: 443,
                path: '/api/v1/accounts/self/users',
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Content-Length': data.length,
                  'Authorization': 'Bearer ' + token
                }
              }

              const req = https.request(options, res => {
                console.log(`statusCode: ${res.statusCode}`)

                res.on('data', d => {
                  process.stdout.write(d)
                })
              })

              req.on('error', error => {
                console.error(error)
              })

              req.write(data)
              console.log("Sent new user to canvas")
              req.end()
        default:
            console.log("Wrong eventName")
            console.log(body.eventName)
    }
});

var server = https.createServer(options, app);
// Start express on the defined port
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

