import FavoriteIcon from '@mui/icons-material/Favorite';
import FmdGoodIcon from '@mui/icons-material/FmdGood';
import PublicIcon from '@mui/icons-material/Public';
import SearchOffRoundedIcon from '@mui/icons-material/SearchOffRounded';
import { CircularProgress, Divider, FormControl, Grid, IconButton, Paper, Select, TextField } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import axios from 'axios';
import dayjs from 'dayjs';
import React, { useCallback, useEffect, useState } from 'react';
import CloudWordNegative from '../CloudWordNegative';
import GeographicGraph from '../GeographicGraph';
import GraphicArea from '../GraphicArea';
import GraphicBarDate from '../GraphicBarDate';
import GraphicBarPercentage from '../GraphicBarPercentage';
import GraphicBarScore from '../GraphicBarScore';
import GraphicPie from '../GraphicPie';
import HeatMap from '../HeatMap';
import Treemap from '../Treemap';

const GridDashboard = ({ darkMode, token }) => {
  const [startDate, setStartDate] = useState(dayjs().year(2023).startOf('year').toISOString());
  const [endDate, setEndDate] = useState(dayjs().year(2024).endOf('year').toISOString());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dataFromApi, setDataFromApi] = useState(null);
  const [startInput, setStartInput] = useState('2023-05-04');
  const [endInput, setEndInput] = useState('2024-05-04');
  const [selectedSent, setSelectedSent] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedDataSource, setSelectedDataSource] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [dataSourceOptions, setDataSourceOptions] = useState([]);
  const [states, setStates] = useState([]);
  const [countries, setCountries] = useState([]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [dataSourceResponse, countriesResponse, statesResponse] = await Promise.all([
        axios.get('http://localhost:8080/graphics/datasource', { headers: { 'Authorization': `Bearer ${token}` } }),
        axios.get('http://localhost:8080/graphics/countries', { headers: { 'Authorization': `Bearer ${token}` } }),
        axios.get('http://localhost:8080/graphics/states', { headers: { 'Authorization': `Bearer ${token}` } })
      ]);

      setDataSourceOptions(dataSourceResponse.data);
      setCountries(countriesResponse.data);
      setStates(statesResponse.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const fetchDataByFilters = useCallback(async () => {
    setLoading(true);
    try {
      const formattedStartDate = dayjs(startDate).toISOString().slice(0, -5) + 'Z';
      const formattedEndDate = dayjs(endDate).toISOString().slice(0, -5) + 'Z';

      let url = `http://localhost:8080/graphics/listByDateRange?startDate=${encodeURIComponent(formattedStartDate)}&endDate=${encodeURIComponent(formattedEndDate)}`;

      if (selectedSent) {
        url += `&sentimentoPredito=${selectedSent}`;
      }
      if (selectedState) {
        url += `&state=${selectedState}`;
      }
      if (selectedDataSource) {
        url += `&datasource=${selectedDataSource}`;
      }
      if (selectedCountry) {
        url += `&country=${selectedCountry}`;
      }

      const response = await axios.get(url);
      setDataFromApi(response.data);

    } catch (error) {
      console.error('Error fetching data:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate, selectedSent, selectedState, selectedCountry, selectedDataSource]);

  useEffect(() => {
    fetchDataByFilters();
  }, [fetchDataByFilters]);

  const handleStartInputChange = (event) => {
    const inputValue = event.target.value;
    const formattedStartDate = dayjs(inputValue).toISOString();

    if (dayjs(inputValue).isAfter(dayjs(endInput))) {
      alert("The start date cannot be after the end date.");
      setStartInput(dayjs(startDate).format('YYYY-MM-DD'));
    } else {
      setStartInput(inputValue);
      setStartDate(formattedStartDate);
    }
  };

  const handleEndInputChange = (event) => {
    const inputValue = event.target.value;
    const formattedEndDate = dayjs(inputValue).endOf('day').toISOString();
    setEndInput(inputValue);
    setEndDate(formattedEndDate);
  };

  const handleSentChange = (event) => {
    setSelectedSent(event.target.value);
  };

  const handleStateChange = (event) => {
    setSelectedState(event.target.value);
  };

  const handleDataSourceChange = (event) => {
    setSelectedDataSource(event.target.value);
  };

  const handleCountryChange = (event) => {
    setSelectedCountry(event.target.value);
  };

  const handleSelectChange = (event) => {
    setSelectedCountry('');
    handleCountryChange(event);
  };

  const handleClearFilters = () => {
    setSelectedSent('');
    setSelectedState('');
    setSelectedDataSource('');
    setSelectedCountry('');
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div style={{ marginTop: '50px' }}>
        <TextField
          id="start-date"
          label="Start Date"
          type="date"
          value={startInput}
          onChange={handleStartInputChange}
          InputLabelProps={{
            shrink: true,
          }}
          style={{ marginRight: '10px' }}
        />
        <TextField
          id="end-date"
          label="End Date"
          type="date"
          value={endInput}
          onChange={handleEndInputChange}
          InputLabelProps={{
            shrink: true,
          }}
          style={{ marginRight: '10px' }}
        />
        <FormControl variant="filled" style={{ minWidth: '150px', marginRight: '10px' }}>
          <Select
            native
            value={selectedSent}
            onChange={handleSentChange}
            variant="outlined"
            color='success'
            fullWidth
            inputProps={{
              name: 'Sentiment',
              id: 'Sentiment',
              style: { paddingLeft: '40px', paddingRight: '30px' }
            }}
          >
            <option aria-label="" value=""> All Sentiment</option>
            <option value="2">Positive</option>
            <option value="0">Negative</option>
            <option value="1">Neutral</option>
          </Select>
          <FavoriteIcon style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
        </FormControl>
        <FormControl variant="filled" fullWidth style={{ width: '150px' }}>
          <Select
            native
            value={selectedCountry}
            onChange={handleSelectChange}
            variant="outlined"
            color='success'
            fullWidth
            inputProps={{
              name: 'Country',
              id: 'Country',
              style: { paddingLeft: '40px', paddingRight: '30px' }
            }}
          >
            <option aria-label="All Country" value="">All Country</option>
            {countries.map(country => (
              <option key={country} value={country}>{country}</option>
            ))}
          </Select>
          <PublicIcon style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
        </FormControl>
        <FormControl variant="filled" style={{ minWidth: '150px', marginLeft: '10px' }}>
          <Select
            native
            value={selectedState}
            onChange={handleStateChange}
            variant="outlined"
            color='success'
            fullWidth
            inputProps={{
              name: 'State',
              id: 'State',
              style: { paddingLeft: '40px', paddingRight: '30px' }
            }}
          >
            <option aria-label="All State" value="">All State</option>
            {states.map(state => (
              <option key={state} value={state}>{state}</option>
            ))}
          </Select>
          <FmdGoodIcon style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
        </FormControl>
        <FormControl variant="filled" style={{ minWidth: '150px', marginLeft: '10px' }}>
          <Select
            native
            value={selectedDataSource}
            onChange={handleDataSourceChange}
            variant="outlined"
            color='success'
            fullWidth
            inputProps={{
              name: 'DataSource',
              id: 'DataSource',
            }}
          >
            <option aria-label="" value=""> Data Source</option>
            {dataSourceOptions.map((option, index) => (
              <option key={index} value={option}>{option}</option>
            ))}
          </Select>
        </FormControl>
        <IconButton
          onClick={handleClearFilters}
          style={{ marginTop: '10px', width: '40px', marginLeft: '10px' }}
          color="error"
        >
          <SearchOffRoundedIcon />
        </IconButton>
      </div>

      <Divider style={{ marginTop: '5px' }} />

      {loading && <CircularProgress />}
      {error && <p>Error: {error}</p>}

      {!loading && !error && (
        <Grid container spacing={3} style={{ marginTop: '5px' }}>
          <Grid item xs={12} sm={4}>
            <Paper style={{ height: 450 }}>
              <HeatMap token={token} darkMode={darkMode} startDate={startDate} endDate={endDate} selectedSent={selectedSent} selectedState={selectedState} data={dataFromApi} selectedCountry={selectedCountry} selectedDataSource={selectedDataSource} />
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper style={{ height: 450 }}>
              <Treemap token={token} darkMode={darkMode} startDate={startDate} endDate={endDate} selectedSent={selectedSent} selectedState={selectedState} data={dataFromApi} selectedCountry={selectedCountry} selectedDataSource={selectedDataSource} />
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper style={{ height: 450 }}>
              <GraphicArea darkMode={darkMode} token={token} startDate={startDate} endDate={endDate} data={dataFromApi} selectedSent={selectedSent} selectedState={selectedState} selectedCountry={selectedCountry} selectedDataSource={selectedDataSource} />
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper style={{ height: 400 }}>
              <GraphicPie token={token} darkMode={darkMode} startDate={startDate} endDate={endDate} data={dataFromApi} selectedState={selectedState} selectedCountry={selectedCountry} selectedDataSource={selectedDataSource} />
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper style={{ height: 400 }}>
              <GraphicBarScore token={token} darkMode={darkMode} startDate={startDate} endDate={endDate} data={dataFromApi} selectedSent={selectedSent} selectedState={selectedState} selectedCountry={selectedCountry} selectedDataSource={selectedDataSource} />
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper style={{ height: 400 }}>
              <GraphicBarPercentage token={token} startDate={startDate} endDate={endDate} data={dataFromApi} selectedSent={selectedSent} selectedDataSource={selectedDataSource} />
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper style={{ height: 400 }}>
              <GraphicBarDate token={token} darkMode={darkMode} startDate={startDate} endDate={endDate} data={dataFromApi} selectedSent={selectedSent} selectedDataSource={selectedDataSource} />
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper style={{ height: 400 }}>
              <CloudWordNegative token={token} darkMode={darkMode} startDate={startDate} endDate={endDate} data={dataFromApi} selectedSent={selectedSent} selectedState={selectedState} selectedDataSource={selectedDataSource} />
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper style={{ height: 400 }}>
              <GeographicGraph token={token} startDate={startDate} endDate={endDate} selectedSent={selectedSent} selectedState={selectedState} data={dataFromApi} selectedCountry={selectedCountry} selectedDataSource={selectedDataSource} />
            </Paper>
          </Grid>
        </Grid>
      )}
    </LocalizationProvider>
  );
};

export default GridDashboard;
