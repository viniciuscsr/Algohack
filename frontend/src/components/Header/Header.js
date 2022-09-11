import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
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
    <div className='header__container mb-4'>
      <h1 style={{ display: 'inline' }}>
        <span className='d-none'>SETool</span>
        <Link to='/'>
          <img
            className='header__logo'
            src='/images/placeholderLogo.png'
            alt='nav logo'
          />
        </Link>
      </h1>
      <span className='header__search-form'>
        <input
          type='text'
          onChange={(e) => {
            setUrl(e.target.value);
          }}
          onKeyDown={(e) => submitOnEnter(e)}
        />
        <button
          className=''
          type='submit'
          onClick={(e) => {
            submitUrl(e);
          }}>
          Submit
        </button>
      </span>
    </div>
  );
};

export default Header;
