import axios from 'axios';
import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import Header from '../../components/Header/Header';
import './Results.scss';
import LoadingOverlay from 'react-loading-overlay';
import { Modal, Button } from 'react-bootstrap';

function Results() {
  const [isLoading, setIsLoading] = useState(false);
  const [metrics, setMetrics] = useState(null);
  const [error, setError] = useState(false);

  const location = useLocation();

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        const { data } = await axios.post('/api/results', location.state);
        setMetrics(data);
      } catch (error) {
        console.error(error);
        setError(true);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [location]);

  const renderDashboardCards = () => {
    const dashboardSections = [
      {
        title: 'Response Rate',
        value: metrics.responseRate,
        isPercentage: true,
        details: {
          good: {
            range: [0.76, 1],
            description:
              'Great work. Continue to respond to inquiries and booking requests as quickly as possible to keep your response rate as close to 100% as possible. Airbnb recommends responding within 24 hours to increase the likelihood of a booking.',
          },
          average: {
            range: [0.41, 0.75],
            description:
              'Your response rate is average. You can improve by doing...',
          },
          poor: {
            range: [0, 0.4],
            description: 'Your response rate is Poor.',
          },
        },
      },
      // {
      //   title: 'Review Rating',
      //   value: metrics.reviews.reviewRating,
      //   isPercentage: false,
      // },
      // {
      //   title: 'Review Number',
      //   value: metrics.reviews.reviewNumber,
      //   isPercentage: false,
      // },
      // {
      //   title: 'Cleanliness Review',
      //   value: metrics.reviews.cleanliness,
      //   isPercentage: false,
      // },
      // {
      //   title: 'Accuracy Reviw',
      //   value: metrics.reviews.accuracy,
      //   isPercentage: false,
      // },
      // {
      //   title: 'Communication Review',
      //   value: metrics.reviews.communication,
      //   isPercentage: false,
      // },
      // {
      //   title: 'Location Review',
      //   value: metrics.reviews.location,
      //   isPercentage: false,
      // },
      // {
      //   title: 'Check-in Review',
      //   value: metrics.reviews['check-in'],
      //   isPercentage: false,
      // },
      // {
      //   title: 'Value Review',
      //   value: metrics.reviews.value,
      //   isPercentage: false,
      // },
    ];

    return dashboardSections.map(
      ({ title, value, isPercentage, details }, i) => {
        const finalValue = isPercentage ? `${Math.round(value * 100)}%` : value;

        let desc;
        let cat;
        Object.keys(details).forEach((category) => {
          const { range, description } = details[category];
          if (range[0] <= value && value <= range[1]) {
            desc = description;
            cat = category;
          }
        });

        return (
          <div key={i} className='col col-12 col-lg-12'>
            <div className='results__dashboard-card my-2 p-3'>
              <h3>{title}</h3>
              <div className='results__details-container'>
                <p>{desc}</p>
                <p
                  className={`results__value__${cat} results__percentage mx-5`}>
                  {finalValue}
                </p>
              </div>
            </div>
          </div>
        );
      }
    );
  };

  const handleClose = () => {
    setError(false);
  };

  return (
    <>
      <Header />
      <LoadingOverlay
        className='results__loading-overlay'
        active={isLoading}
        spinner
        text='Loading... It might take a few seconds.'>
        {metrics ? (
          <>
            <div className='results__container container'>
              {/* body */}
              <div className='row'>{renderDashboardCards()}</div>
            </div>
          </>
        ) : (
          <div className='results__container container' />
        )}
        <>
          <Modal centered show={error} onHide={handleClose}>
            <Modal.Body bsPrefix='modal-body text-center'>
              Oops.. Something went wrong. Please try again.
            </Modal.Body>
            <Modal.Footer bsPrefix='modal-footer text-center d-flex justify-content-center'>
              <Link to='/'>
                <Button variant='primary' onClick={handleClose}>
                  Go to Homepage
                </Button>
              </Link>
            </Modal.Footer>
          </Modal>
        </>
      </LoadingOverlay>
    </>
  );
}

export default Results;

// TODO: add how to improve rankings section
