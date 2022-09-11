import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
    <div className='results__nav mb-4'>
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
    </div>
  );
};

export default Header;
