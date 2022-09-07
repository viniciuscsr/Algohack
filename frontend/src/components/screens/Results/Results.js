import axios from 'axios';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Loader } from '../../Loader';
import './Results.css';
import GreenCheck from '../../../icons/GreenCheck';
import RedXCircle from '../../../icons/RedXCircle';

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
    try {
      setIsLoading(true);
      async function fetchData() {
        const { data } = await axios.post('/api/airbnb', location.state);
        setMetrics(data);
      }
      fetchData();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
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
        <div className='col col-12 col-lg-4'>
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
      <div>
        {isLoading && <Loader />}
        {metrics && <div>{metrics.submittedUrl}</div>}
      </div>
      <div className='container'>
        {/* header */}
        {/* body */}
        <div className='row results__summary m-2 py-2'>{renderSummary()}</div>
        <div className='row'>{renderDashboardCards()}</div>
      </div>
    </>
  );
}

export default Results;

// TODO: figure out why loading component isnt working
// TODO: add listing URL to query string
