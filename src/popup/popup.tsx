import React, { FunctionComponent, useEffect, useState } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Content } from '../content/content';
import { DailyWeather } from '../interfaces';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date';
import { weatherApi, coordinatesApi } from '../constants';
import { format, addDays } from 'date-fns'

interface Props {
  capital: string;
  open: boolean;
  onClose: () => void;
}

const Popup: FunctionComponent<Props> = ({ capital, open, onClose }) => {
  const openCageDataKey = process.env.REACT_APP_OPEN_CAGE_KEY;
  const weatherApiKey = process.env.REACT_APP_WEATHER_API_KEY;

  const [lat, setLat] = useState(0);
  const [lon, setLon] = useState(0);
  const [showProgress, setShowProgress] = useState(false);
  const [forecastData, setForecastData] = useState([{ datetime: '', weather: { icon: '' } }]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [dateSelected, setDateSelected] = useState(false);
  const [selectedDateTemp, setSelectedDateTemp] = useState(0);

  const fetchDailyWeatherHistory = async (lat: number, lon: number, startDate: Date): Promise<void> => {
    const dateStr: string = format(startDate, 'yyyy-MM-dd');
    const dateAfterStr: string = format(addDays(startDate, 1), 'yyyy-MM-dd');
    const response = await fetch(`${weatherApi}/history/daily?lat=${lat}&lon=${lon}&start_date=${dateStr}&end_date=${dateAfterStr}&key=${weatherApiKey}`);
    const json = await response.json();
    const data = Array.isArray(json.data) ? json.data[0]?.temp : 'not found'
    setSelectedDateTemp(data)
  }

  const fetchForecastOfWeek = async (lat: number, lon: number): Promise<DailyWeather[]> => {
    const response = await fetch(`${weatherApi}/forecast/daily?lat=${lat}&lon=${lon}&days=7&key=${weatherApiKey}`);
    const json = await response.json();
    return json.data;
  }

  const fetchCoordinatesOfCapital = async (capital: string): Promise<{ lat: number; lon: number }> => {
    const response = await fetch(`${coordinatesApi}?q=${capital}&key=${openCageDataKey}`);
    const json = await response.json();
    const lat = json?.results[0]?.geometry?.lat;
    const lon = json?.results[0]?.geometry?.lng;
    setLat(lat);
    setLon(lon);
    return { lat, lon }
  }

  const fetchData = async () => {
    setShowProgress(true);
    const { lat, lon } = await fetchCoordinatesOfCapital(capital);
    const data = await fetchForecastOfWeek(lat, lon);
    setForecastData(data);
    setShowProgress(false);
  }

  const onDateChanged = async (dateParam: MaterialUiPickersDate) => {
    const date: Date = new Date(dateParam ? dateParam.toString() : '')
    setSelectedDate(date)
    if (!dateSelected) {
      setDateSelected(true);
    }
    fetchDailyWeatherHistory(lat, lon, date);
  }

  useEffect(() => {
    if (open) {
      fetchData();
    } else {
      setSelectedDateTemp(0);
      setDateSelected(false);
    }
  }, [open])

  return <>
    <Dialog
      open={open}
      onClose={onClose}
    >
      <DialogTitle>{capital}</DialogTitle>
      <DialogContent>
        {
          showProgress ?
            <span className='popup-progress'>
              <CircularProgress />
            </span>
            :
            <>
              <Content data={forecastData} />
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker
                  margin="normal"
                  id="date-picker-dialog"
                  label="Select Date"
                  format="MM/dd/yyyy"
                  value={selectedDate}
                  onChange={onDateChanged}
                />
              </MuiPickersUtilsProvider>
              {
                dateSelected && forecastData &&
                <div>{selectedDateTemp}  &#8451;</div>
              }
            </>
        }
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  </>
}

export { Popup };
