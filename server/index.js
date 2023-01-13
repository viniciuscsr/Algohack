const express = require('express');
const app = express();
const port = 5000;
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const sample = require('./samples/sample');
const amenitiesSample = require('./samples/amenitiesSample');
const webScrapingApiClient = require('webscrapingapi');
const dotenv = require('dotenv');
const morgan = require('morgan');
const {
  getElementByText,
  getElementByExactText,
  getElementByAttributeValue,
} = require('./utilis/parsingMethods');
const { getPage } = require('./utilis/webScrapingApi');
const reviewFeatures = require('./constants/reviewFeatures');

app.use(express.json());
dotenv.config();
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

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

app.post('/api/results', async (req, res) => {
  const airBnbListing = req.body.url;
  const client = new webScrapingApiClient(process.env.WEB_SCRAPING_KEY);

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

    // -------------------------------------------------------------------------------------------
    // title
    // -------------------------------------------------------------------------------------------

    const h1Element = dom.window.document.querySelector('h1');
    const title = h1Element.textContent;

    // -------------------------------------------------------------------------------------------
    // response rate
    // -------------------------------------------------------------------------------------------

    const responseText = getElementByText(
      'Response rate',
      liElements
    )?.textContent;
    const responseRate =
      parseInt(responseText.split('Response rate: ')[1].split('%')[0]) / 100;

    // -------------------------------------------------------------------------------------------
    // description
    // -------------------------------------------------------------------------------------------

    // const descriptionText = getElementByAttributeValue(
    //   divElements,
    //   'description'
    // ).textContent;

    // -------------------------------------------------------------------------------------------
    // // Amenities
    // -------------------------------------------------------------------------------------------

    // // const amenitiesResponse = await getPage(
    // //   client,
    // //   `${airBnbListing}/amenities`
    // // );

    // const amenitiesResponse = {
    //   success: true,
    // };
    // let amenitiesList = [];
    // if (amenitiesResponse.success) {
    //   // const dom = new JSDOM(amenitiesResponse.response.data);

    //   const dom = new JSDOM(amenitiesSample);

    //   // get amenities H2
    //   const h2Elements = dom.window.document.querySelectorAll('h2');
    //   const amenitiesH2 = getElementByText(
    //     'What this place offers',
    //     h2Elements
    //   );

    //   // find the right section that has a amenities H2
    //   const sectionElements = dom.window.document.querySelectorAll('section');
    //   const sectionArr = Array.from(sectionElements);
    //   const sectionIndex = sectionArr.findIndex(
    //     (section) =>
    //       section.textContent.includes(amenitiesH2.textContent) &&
    //       !section.textContent.includes('Show all')
    //   );

    //   const amenitiesDivs = sectionArr[sectionIndex].querySelectorAll('div');
    //   amenitiesDivs.forEach((div) => {
    //     if (div.className === '_vzrbjl') {
    //       amenitiesList.push(div.textContent);
    //     }
    //   });

    //   // TODO: create a hard coded array of strings with amenities and compare to content on the page to get final amenity list
    // }

    // -------------------------------------------------------------------------------------------
    // Reviews
    // -------------------------------------------------------------------------------------------

    let reviews = {};

    const reviewText = getElementByText('reviews', spanElements).textContent;
    // check if the listing has any reviews
    reviews.reviewNumber = reviewText.includes('·')
      ? parseInt(reviewText.split(' ·')[1].split('reviews')[0])
      : 0;

    if (reviews.reviewNumber > 0) {
      reviews.reviewRating = parseFloat(reviewText.split(' ·')[0]);

      //select all divs in a section that have an h2 with 'reviews' as textcontent

      // get reviews H2
      const h2Elements = dom.window.document.querySelectorAll('h2');
      const reviewsH2 = getElementByText('reviews', h2Elements);

      // find the right section that has a review H2
      const sectionElements = dom.window.document.querySelectorAll('section');
      const sectionArr = Array.from(sectionElements);
      const sectionIndex = sectionArr.findIndex((section) =>
        section.textContent.includes(reviewsH2.textContent)
      );

      // get all divs from reviews section
      const reviewDivs = sectionArr[sectionIndex].querySelectorAll('div');

      const divArr = Array.from(reviewDivs);

      reviewFeatures.forEach((feature) => {
        const reviewFeatureDiv = getElementByExactText(
          feature,
          divElements
        ).outerHTML;
        const index =
          divArr.findIndex((el) => el.outerHTML === reviewFeatureDiv) + 1;

        const featureRating = parseFloat(divArr[index].textContent);

        reviews[feature.toLowerCase()] = featureRating;
      });
    }

    const listingData = {
      title,
      responseRate,
      // descriptionText,
      reviews,
      // amenities: [...amenitiesList],
    };

    res.send(listingData);
  } else {
    res.status(500).send(response.error);
  }
});

// -----------------------------------------------------------

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
