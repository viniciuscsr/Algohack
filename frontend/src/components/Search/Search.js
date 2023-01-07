import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Search.scss';

export default function Search() {
  const [url, setUrl] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (url.includes('airbnb.com/')) {
      setIsValid(true);
      setShowErrorMessage(false);
    }
  }, [url]);

  const submitOnEnter = (e) => {
    if (e.keyCode === 13) {
      submitUrl(e);
    }
  };

  const submitUrl = async (e) => {
    e.preventDefault();

    const urlToString = {
      url: url,
    };

    const result = '?' + new URLSearchParams(urlToString).toString();

    if (isValid && url.trim()) {
      navigate(`/results${result}`, { state: { url: url } });
    } else {
      setShowErrorMessage(true);
    }
  };

  return (
    <>
      <div className=''>
        <div className='search__container text-center'>
          <div className='search__content-container'>
            <h2 className='search__h2'>Your AirBnB listing URL goes here</h2>
            <input
              className={`search__input m-4 ${
                showErrorMessage ? 'search__input__invalid' : ''
              }`}
              type='text'
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                setShowErrorMessage(false);
              }}
              onKeyDown={(e) => submitOnEnter(e)}></input>
            <button
              className='search__button'
              type='submit'
              onClick={(e) => {
                submitUrl(e);
              }}>
              Submit
            </button>
            {showErrorMessage && (
              <div className='search__invalid-input'>Invalid URL</div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
