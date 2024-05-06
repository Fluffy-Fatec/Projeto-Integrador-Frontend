import Typography from '@mui/material/Typography';
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Chart } from "react-google-charts";

function App({ token, startDate, endDate, selectedState, selectedCountry, selectedDataSource }) {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async (token, startDate, endDate) => {
    try {
      const formattedStartDate = new Date(startDate).toISOString().slice(0, -5) + 'Z';
      const formattedEndDate = new Date(endDate).toISOString().slice(0, -5) + 'Z';

      let url = `http://localhost:8080/graphics/listByDateRange?startDate=${encodeURIComponent(formattedStartDate)}&endDate=${encodeURIComponent(formattedEndDate)}`;

      if (selectedState !== '') {
        url += `&state=${selectedState}`;
      }

      if (selectedCountry !== '') {
        url += `&country=${selectedCountry}`;
      }

      if (selectedDataSource !== '') {
        url += `&datasource=${selectedDataSource}`;
      }

      const response = await axios.get(url);

      const countsByState = {};

      response.data.forEach(item => {
        const state = item.geolocationState;
        const sentimentoPredito = item.sentimentoPredito;

        if (!countsByState[state]) {
          countsByState[state] = {
            'Positive': 0,
            'Negative': 0,
            'Neutral': 0
          };
        }

        if (sentimentoPredito === '2') {
          countsByState[state]['Positive']++;
        } else if (sentimentoPredito === '0') {
          countsByState[state]['Negative']++;
        } else if (sentimentoPredito === '1') {
          countsByState[state]['Neutral']++;
        }
      });

      const chartData = [['State', 'Positive', 'Negative', 'Neutral']];

      for (const state in countsByState) {
        const { Positive, Negative, Neutral } = countsByState[state];
        chartData.push([state, Positive, Negative, Neutral]);
      }

      setChartData(chartData);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao buscar dados da API:', error);
      setError('Erro ao buscar dados da API.');
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token && startDate && endDate) {
      fetchData(token, startDate, endDate);
    } else {
      setError('Token de autenticação, startDate ou endDate não encontrados.');
      setLoading(false);
    }
  }, [token, startDate, endDate, selectedCountry, selectedDataSource]);

  const options = {
    backgroundColor: 'transparent',
    pieHole: 0.4,
    slices: [
      { color: '#ef476f' },
      { color: '#ffd166' },
      { color: '#06d6a0' }
    ],
    series: {
      0: { color: '#06d6a0' },
      1: { color: '#ef476f' },
      2: { color: '#ffd166' },
    },
    is3D: false,
    chartArea: {
      width: "65%",
      height: "55%"
    },
    legend: {
      position: 'bottom',
      textStyle: {
        fontName: 'Segoe UI',
        fontSize: 12,
        color: '#808080',
      }
    },
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      <Typography variant="h5" style={{ padding: '20px', fontWeight: 'bold', fontFamily: 'Segoe UI', fontSize: 20 }}>State Sentiment Trend Chart</Typography>
      <Chart
        chartType="ComboChart"
        width="100%"
        height="100%"
        style={{ marginTop: '-75px' }}
        data={chartData}
        options={options}
      />
    </>
  );
}

export default App;
