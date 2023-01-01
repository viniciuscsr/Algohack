import { HOME_COMPONENTS } from './data/input';
import Search from './components/Search/Search';
import HomeCard from './components/HomeCard/HomeCard';
import './App.scss';

function App() {
  const renderCards = () => {
    return (
      <div className='container'>
        <div className='row'>
          {HOME_COMPONENTS.map(({ heading, text, buttonCta }) => (
            <HomeCard heading={heading} text={text} buttonCta={buttonCta} />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className='App'>
      <Search />
      {renderCards()}
    </div>
  );
}

//---

export default App;
