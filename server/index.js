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
const { getPage } = require('./utilis/webScrapingApi');

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

  async function scrapeAirbnblisting() {
    const response = await getPage(client, airBnbListing);
    // uncomment this line to use sample data
    // const response = {
    //   success: true,
    // };

    if (response.success) {
      const dom = new JSDOM(response.response.data);

      // uncomment this line to use sample data
      // const dom = new JSDOM(sample);

      const liElements = dom.window.document.querySelectorAll('li');
      const divElements = dom.window.document.querySelectorAll('div');
      const spanElements = dom.window.document.querySelectorAll('span');

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

      // Amenities

      // Reviews
      const reviewText = getElementByText('reviews', spanElements).textContent;
      const reviewNumber = parseInt(
        reviewText.split(' ·')[1].split('reviews')[0]
      );
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
    } else {
      console.log(response.error);
    }
  }

  scrapeAirbnblisting();
});

// -----------------------------------------------------------

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
