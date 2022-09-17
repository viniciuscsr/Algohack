const express = require('express');
const app = express();
const port = 5000;
const request = require('request');
const fs = require('fs');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const sample = require('./sample');
const axios = require('axios');
const webScrapingApiClient = require('webscrapingapi');
const {
  getElementByText,
  getElementByAttributeValue,
} = require('./utilis/parsingMethods');

const airBnbListing = 'https://www.airbnb.com/rooms/661558087126699190';

// -----------------------------------------------------------
// request
// -----------------------------------------------------------

// request('https://news.ycombinator.com/news', (error, response, body) => {
//   if (error) {
//     console.log('Error: ' + error);
//   }
//   console.log('Status code: ' + response.statusCode);

//   const dom = new JSDOM(response.body);
//   console.log(dom.window.document.querySelector('div').textContent);
// });

app.use(express.json());

app.post('/api/airbnb', (req, res) => {
  setTimeout(() => {
    res.send({
      submittedUrl: req.body.url,
      platform: 'airbnb',
    });
  }, 3000);
});

// -----------------------------------------------------------
// Web Scraping API
// -----------------------------------------------------------

app.get('/web-scraping-api', (req, res) => {
  const client = new webScrapingApiClient('SKst8lyPWXZbBeTKyRu7F0rTslbpY1e9');

  async function exampleUsage() {
    let response = await client.get(
      airBnbListing,
      {
        // API Parameters
        // Set to 0 (off, default) or 1 (on) depending on whether or not to render JavaScript on the target web page. JavaScript rendering is done by using a browser.
        render_js: 1,
        // Set datacenter (default) or residential depending on whether proxy type you want to use for your scraping request. Please note that a single residential proxy API request is counted as 25 API requests.
        proxy_type: 'datacenter',
        // Specify the 2-letter code of the country you would like to use as a proxy geolocation for your scraping API request. Supported countries differ by proxy type, please refer to the Proxy Locations section for details.
        country: 'us',
        // Set depending on whether or not to use the same proxy address to your request.
        session: 1,
        // Specify the maximum timeout in milliseconds you would like to use for your scraping API request. In order to force a timeout, you can specify a number such as 1000. This will abort the request after 1000ms and return whatever HTML response was obtained until this point in time.
        timeout: 10000,
        // Set desktop (default) or mobile or tablet, depending on whether the device type you want to your for your scraping request.
        device: 'desktop',
        // Specify the option you would like to us as conditional for your scraping API request. Can only be used when the parameter render_js=1 is activated.
        wait_until: 'domcontentloaded',
        // Some websites may use javascript frameworks that may require a few extra seconds to load their content. This parameters specifies the time in miliseconds to wait for the website. Recommended values are in the interval 5000-10000.
        wait_for: 10000,
      },
      {
        // API Headers
        authorization: 'bearer test',
        // Specify custom cookies to be passed to the request.
        cookie: 'test_cookie=abc; cookie_2=def',
      }
    );
    if (response.success) {
      const dom = new JSDOM(response.response.data);
      let listingData = {};

      // response rate
      const liElements = dom.window.document.querySelectorAll('li');
      const responseText = getElementByText('Response rate', liElements)
        .textContent;
      const responseRate = responseText.split('Response rate: ')[1];
      listingData.responseRate = responseRate;

      // description
      const divElements = dom.window.document.querySelectorAll('div');
      const arr = Array.from(divElements);

      // has show more button
      // or
      // has description attribuite

      // amenities

      // number of review
      // reviews ratings

      res.send(listingData);
    } else {
      console.log(response.error);
    }
  }

  exampleUsage();
});

// -----------------------------------------------------------
// DOM practice
// -----------------------------------------------------------

app.get('/dom-practice', (req, res) => {
  const dom = new JSDOM(sample);
  let listingData = {};

  // response rate
  const liElements = dom.window.document.querySelectorAll('li');
  const responseText = getElementByText('Response rate', liElements)
    .textContent;
  const responseRate = responseText.split('Response rate: ')[1];
  listingData.responseRate = responseRate;

  // description
  const divElements = dom.window.document.querySelectorAll('div');

  console.log(getElementByAttributeValue(divElements, 'description').outerHTML);

  // has show more button
  // or
  // has description attribuite

  // amenities

  // number of review
  // reviews ratings

  res.send(listingData);
});

// -----------------------------------------------------------

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

// data needed
// - response rate
// - description
// - amenities
// - number of review
// - reviews ratings
