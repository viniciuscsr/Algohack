import axios from 'axios';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../../components/Header/Header';
import './Results.css';
import GreenCheck from '../../icons/GreenCheck';
import RedXCircle from '../../icons/RedXCircle';
import LoadingOverlay from 'react-loading-overlay';

function Results() {
  const [isLoading, setIsLoading] = useState(false);
  const [metrics, setMetrics] = useState([]);

  const location = useLocation();

  const dashboardSections = [
    { title: 'Reviews', value: 0.23 },
    { title: 'Occupancy Rate', value: 0.76 },
    { title: 'Response Rate', value: 0.93 },
  ];

  const summaryData = {
    dos: [
      'Great use of keywords',
      'Comprehensive description',
      'Complete list of amenities',
    ],
    dont: [
      'Low response rate',
      'Low number of reviews',
      'Low number of photos',
    ],
  };

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        const { data } = await axios.post('/api/airbnb', location.state);
        setMetrics(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [location]);

  const renderDashboardCards = () => {
    return dashboardSections.map(({ title, value }) => {
      const percentage = value * 100;
      return (
        <div className='col col-12 col-lg-4'>
          <div className='results__dashboard-card my-2 p-3'>
            <h3>{title}</h3>
            <p className='results__percentage mx-5'>{percentage}%</p>
            <div
              className='results__pie animate'
              style={{ '--p': percentage, '--b': '10px' }}></div>
          </div>
        </div>
      );
    });
  };

  const renderSummary = () => {
    return (
      <>
        <div className='col col-12 col-lg-4 text-center'>
          <h2>Score</h2>
          <p className='results__percentage mx-5'>57</p>
        </div>
        <div className='col col-12 col-lg-4 my-1'>
          {summaryData.dos.map((item) => {
            return (
              <div>
                <GreenCheck />
                <p className='results__summary-list'>{item}</p>
              </div>
            );
          })}
        </div>
        <div className='col col-12 col-lg-4 my-1'>
          {summaryData.dont.map((item) => {
            return (
              <div>
                <RedXCircle />
                <p className='results__summary-list'>{item}</p>
              </div>
            );
          })}
        </div>
      </>
    );
  };

  return (
    <>
      <Header />
      <LoadingOverlay
        className='results__loading-overlay'
        active={isLoading}
        spinner
        text='Loading...'>
        {metrics && (
          <>
            <div>{metrics.submittedUrl}</div>
            <div className='container pt-4'>
              {/* body */}
              <div className='row results__summary my-1 py-2'>
                {renderSummary()}
              </div>
              <div className='row'>{renderDashboardCards()}</div>
            </div>
          </>
        )}
      </LoadingOverlay>
    </>
  );
}

export default Results;

// TODO: add how to improve rankings section
