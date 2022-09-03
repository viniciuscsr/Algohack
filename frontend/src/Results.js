import axios from 'axios';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Loader } from './components/Loader';

function Results() {
  const [isLoading, setIsLoading] = useState(false);
  const [metrics, setMetrics] = useState([]);

  const location = useLocation();

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

  return (
    <div>
      {isLoading && <Loader />}
      {metrics && <div>{metrics.submittedUrl}</div>}
    </div>
  );
}

export default Results;

// figure out why loading component isnt working
