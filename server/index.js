const express = require('express');
const app = express();
const port = 5000;
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const sample = require('./sample');
const webScrapingApiClient = require('webscrapingapi');
const dotenv = require('dotenv');
const {
  getElementByText,
  getElementByExactText,
  getElementByAttributeValue,
} = require('./utilis/parsingMethods');

const airBnbListing = 'https://www.airbnb.com/rooms/661558087126699190';

app.use(express.json());
dotenv.config();

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
  const client = new webScrapingApiClient(process.env.WEB_SCRAPING_KEY);

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
      const liElements = dom.window.document.querySelectorAll('li');
      const divElements = dom.window.document.querySelectorAll('div');
      const spanElements = dom.window.document.querySelectorAll('span');
      const sectionElements = dom.window.document.querySelectorAll('section');

      // response rate
      const responseText = getElementByText('Response rate', liElements)
        .textContent;
      const responseRate = responseText.split('Response rate: ')[1];

      // description
      const descriptionText = getElementByAttributeValue(
        divElements,
        'description'
      ).textContent;

      // has show more button
      // or
      // has description attribuite

      // amenities

      // Reviews
      const reviewText = getElementByText('reviews', spanElements).textContent;
      const reviewNumber = parseInt(
        reviewText.split(' ·')[1].split('reviews')[0]
      );
      const reviewRating = parseFloat(reviewText.split(' ·')[0]);

      const listingData = {
        responseRate,
        descriptionText,
        reviews: {
          reviewNumber,
          reviewRating,
        },
      };

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

  const liElements = dom.window.document.querySelectorAll('li');
  const divElements = dom.window.document.querySelectorAll('div');
  const spanElements = dom.window.document.querySelectorAll('span');

  // response rate
  const responseText = getElementByText('Response rate', liElements)
    .textContent;
  const responseRate = responseText.split('Response rate: ')[1];

  // description
  const descriptionText = getElementByAttributeValue(divElements, 'description')
    .textContent;

  // has show more button
  // or
  // has description attribuite

  // Amenities

  // Reviews
  const reviewText = getElementByText('reviews', spanElements).textContent;
  const reviewNumber = parseInt(reviewText.split(' ·')[1].split('reviews')[0]);
  const reviewRating = parseFloat(reviewText.split(' ·')[0]);

  //select all divs in a section that has an h2 with 'reviews' as textcontent

  // get reviews H2
  const h2Elements = dom.window.document.querySelectorAll('h2');
  const reviewsH2 = getElementByText('reviews', h2Elements);

  // find the right section
  const sectionElements = dom.window.document.querySelectorAll('section');
  const sectionArr = Array.from(sectionElements);
  const sectionIndex = sectionArr.findIndex((section) =>
    section.textContent.includes(reviewsH2.textContent)
  );

  // get all divs from reviews section
  const reviewDivs = sectionArr[sectionIndex].querySelectorAll('div');

  const reviewFeatures = [
    'Cleanliness',
    'Accuracy',
    'Communication',
    'Location',
    'Check-in',
    'Value',
  ];

  const divArr = Array.from(reviewDivs);
  const reviewFeatureScore = {};

  reviewFeatures.forEach((feature) => {
    const reviewFeatureDiv = getElementByExactText(feature, divElements)
      .outerHTML;
    const index =
      divArr.findIndex((el) => el.outerHTML === reviewFeatureDiv) + 1;

    const featureRating = parseFloat(divArr[index].textContent);

    reviewFeatureScore[feature.toLowerCase()] = featureRating;
  });

  const listingData = {
    responseRate,
    descriptionText,
    reviews: {
      reviewNumber,
      reviewRating,
      ...reviewFeatureScore,
    },
  };

  res.send(listingData);
});

// -----------------------------------------------------------

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
