const express = require('express');
const app = express();
const port = 5000;
const request = require('request');
const fs = require('fs');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const sample = require('./sample');

request('https://news.ycombinator.com/news', (error, response, body) => {
  if (error) {
    console.log('Error: ' + error);
  }
  console.log('Status code: ' + response.statusCode);

  const dom = new JSDOM(sample);
  console.log(dom.window.document.querySelector('div').textContent);
});

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello world');
});

app.post('/api/airbnb', (req, res) => {
  console.log(req.body);
  res.send({
    test1: 'test1',
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
