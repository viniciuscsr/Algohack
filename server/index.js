const express = require('express');
const app = express();
const port = 3000;
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

app.get('/', (req, res) => {
  res.send('Hello world');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
