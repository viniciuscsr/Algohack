const express = require('express');
const app = express();
const port = 5000;
const request = require('request');
const fs = require('fs');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const sample = require('./sample');
const axios = require('axios');

// request('https://news.ycombinator.com/news', (error, response, body) => {
//   if (error) {
//     console.log('Error: ' + error);
//   }
//   console.log('Status code: ' + response.statusCode);

//   const dom = new JSDOM(response.body);
//   console.log(dom.window.document.querySelector('div').textContent);
// });

app.use(express.json());
app.get('/', (req, res) => {
  res.send('Hello world');
});

app.post('/api/airbnb', (req, res) => {
  setTimeout(() => {
    res.send({
      submittedUrl: req.body.url,
      platform: 'airbnb',
    });
  }, 3000);
});

// -----------------------------------------------------------

process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;
var username = 'lum-customer-hl_2b98090e-zone-unblocker';
var password = 'vewkyo262311';
var port1 = 22225;
var session_id = (1000000 * Math.random()) | 0;
var options = {
  auth: {
    username: username + '-session-' + session_id,
    password,
  },
  host: 'zproxy.lum-superproxy.io',
  port1,
  rejectUnauthorized: false,
};

axios.get('https://www.airbnb.com/rooms/661558087126699190', options).then(
  function (data) {
    const dom = new JSDOM(data.data);
    const elements = dom.window.document.querySelectorAll('li');
    console.log(elements.length);
    elements.forEach((element) => {
      console.log(element.textContent);
    });
  },
  function (err) {
    console.error(err);
  }
);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

//
