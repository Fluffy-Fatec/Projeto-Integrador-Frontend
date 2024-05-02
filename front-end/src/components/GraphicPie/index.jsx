import Typography from '@mui/material/Typography';
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Chart } from "react-google-charts";

function App({ token, startDate, endDate, selectedSent}) {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async (token, startDate, endDate) => {
    try {
      const formattedStartDate = new Date(startDate).toISOString().slice(0, -5) + 'Z';
      const formattedEndDate = new Date(endDate).toISOString().slice(0, -5) + 'Z';

      let url = `http://localhost:8080/graphics/listByDateRange?startDate=${encodeURIComponent(formattedStartDate)}&endDate=${encodeURIComponent(formattedEndDate)}`;
      
      // Adiciona o parâmetro de sentimento se um sentimento foi selecionado
      if (selectedSent !== '') {
        url += `&sentimentoPredito=${selectedSent}`;
      }

      const response = await axios.get(url);

      const counts = {
        'Positive': 0,
        'Negative': 0
      };

      response.data.forEach(item => {
        const sentimentoPredito = item.sentimentoPredito;

        if (sentimentoPredito === '1') {
          counts['Positive']++;
        } else if (sentimentoPredito === '0') {
          counts['Negative']++;
        }
      });

      const chartData = [
        ['Sentiment', 'Count'],
        ['Positive', counts['Positive']],
        ['Negative', counts['Negative']]
      ];

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
  }, [token, startDate, endDate, selectedSent]);

  const options = {
    backgroundColor: 'transparent',

    pieHole: 0.4,
    slices: {
      0: { color: '#11BF4E' },
      1: { color: '#F25774' }
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
      <Typography variant="h5" style={{ padding: '20px', fontWeight: 'bold', fontFamily: 'Segoe UI', fontSize: 20 }}>Sentiment Over Time</Typography>
      <Chart
        chartType="PieChart"
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
