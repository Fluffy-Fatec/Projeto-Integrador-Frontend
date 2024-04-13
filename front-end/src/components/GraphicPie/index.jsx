import React, { useState, useEffect } from "react";
import { Chart } from "react-google-charts";
import axios from "axios";

function App() {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async (token) => {
    try {
      const response = await axios.get('http://localhost:8080/graphics/list', {
        headers: {
          'Authorization': `Bearer ${token}`
        },
      });

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
    const token = sessionStorage.getItem('token');
    if (token) {
      fetchData(token);
    } else {
      setError('Token de autenticação não encontrado.');
      setLoading(false);
    }
  }, []);

  const options = {
    backgroundColor: 'transparent',
    // title: "Sentiment Over Time",
    // titleTextStyle: {
    //   bold: true,
    //   fontName: 'Segoe UI',
    //   fontSize: 20,
    //   color: '#5F5F5F'
    // },
    // legend: {
    //   textStyle: {
    //     fontName: 'Segoe UI',
    //     fontSize: 14,
    //     color: '#5F5F5F'
    //   }
    // },
    pieHole: 0.4,
    slices: {
      0: { color: '#11BF4E' },
      1: { color: '#F25774' }
    },
    is3D: false,
    legend: 'none',
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <Chart
      chartType="PieChart"
      width="100%"
      height="100%"
      data={chartData}
      options={options}
    />
  );
}

export default App;
