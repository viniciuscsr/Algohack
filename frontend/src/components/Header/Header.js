import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Header.scss';

const Header = ({ showSearchBar }) => {
  const [url, setUrl] = useState('');

  const navigate = useNavigate();

  const submitUrl = (e) => {
    const urlToString = {
      url: url,
    };

    const result = '?' + new URLSearchParams(urlToString).toString();

    e.preventDefault();
    if (url.trim()) {
      navigate(`/results${result}`, { state: { url: url } });
    }
  };

  const submitOnEnter = (e) => {
    if (e.keyCode === 13) {
      submitUrl(e);
    }
  };

  return (
    <>
      {/* desktop */}
      <div className='header__container d-none d-sm-block'>
        <div style={{ display: 'inline' }}>
          <span className='d-none'>AlgoHack</span>
          <Link to='/'>
            <img
              className='header__logo'
              src='/images/colorfull_algohack_logo_clear.png'
              alt='nav logo'
            />
          </Link>
        </div>
        {showSearchBar && (
          <span className='header__search-form'>
            <input
              type='text'
              className='header__input'
              onChange={(e) => {
                setUrl(e.target.value);
              }}
              onKeyDown={(e) => submitOnEnter(e)}
              placeholder='Paste your AirBnb listing URL here'
            />
            <button
              className='btn btn-primary btn-sm header__button'
              type='submit'
              onClick={(e) => {
                submitUrl(e);
              }}>
              Submit
            </button>
          </span>
        )}
      </div>
      {/* mobile */}
      <div className='header__container-mobile py-3 d-block d-sm-none'>
        <div>
          <span className='d-none'>AlgoHack</span>
          <Link to='/'>
            <img
              className='header__logo-mobile'
              src='/images/colorfull_algohack_logo_clear.png'
              alt='nav logo'
            />
          </Link>
        </div>
        {showSearchBar && (
          <div className='header__search-form-mobile'>
            <div className='header__input'>
              <input
                type='text'
                onChange={(e) => {
                  setUrl(e.target.value);
                }}
                onKeyDown={(e) => submitOnEnter(e)}
                placeholder='Paste your AirBnb listing URL here'
              />
            </div>
            <button
              className='btn btn-primary btn-sm header__button'
              type='submit'
              onClick={(e) => {
                submitUrl(e);
              }}>
              Submit
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Header;
