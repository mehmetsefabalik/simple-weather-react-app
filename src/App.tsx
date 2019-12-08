import React, { useEffect, useState, FunctionComponent } from 'react';
import './App.css';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Popup } from './popup/popup';
import { CountryList } from './list/list';
import { countryApi } from './constants';

const App: FunctionComponent = () => {
  const [countries, setCountries] = useState([]);
  const [showProgress, setShowProgress] = useState(true);
  const [selectedCapital, setSelectedCapital] = useState('');
  const [showPopup, setShowPopup] = useState(false);

  const fetchCountries = async () => {
    const response = await fetch(countryApi);
    const json = await response.json();
    setCountries(json);
    setShowProgress(false);
  }

  useEffect(() => {
    fetchCountries();
  }, []);



  const onCountryClick = async (capital: string) => {
    setSelectedCapital(capital);
    setShowPopup(true);
  }

  return <>
    {
      showProgress &&
      <div className='progress-container'>
        <CircularProgress />
      </div>
    }
    <Popup capital={selectedCapital} open={showPopup} onClose={() => setShowPopup(false)} />
    <CountryList countries={countries} onCountryClick={onCountryClick} />
  </>
}

export default App;
