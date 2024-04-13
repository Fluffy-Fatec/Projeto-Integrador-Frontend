import React, { useState, useEffect } from "react";
import { Chart } from "react-google-charts";
import axios from "axios";
import Cookies from 'js-cookie'; // Importe a biblioteca js-cookie

function App({token}) {
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

      const stateData = {};

      response.data.forEach(item => {
        const state = item.geolocationState;
        const sentiment = item.sentimentoPredito;

        if (!stateData[state]) {
          stateData[state] = {
            positives: 0,
            negatives: 0,
            total: 0
          };
        }

        if (sentiment === '1') {
          stateData[state].positives++;
        } else if (sentiment === '0') {
          stateData[state].negatives++;
        }

        stateData[state].total++;
      });

      const chartData = [
        ['State', 'Positive', 'Negative']
      ];

      for (const state in stateData) {
        const { positives, negatives, total } = stateData[state];
        const positivePercentage = (positives / total) * 100;
        const negativePercentage = (negatives / total) * 100;
        chartData.push([state, positivePercentage, negativePercentage]);
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
    if (token) {
      fetchData(token);
    } else {
      setError('Token de autenticação não encontrado.');
      setLoading(false);
    }
  }, []);

  const options = {
    title: "Sentiment by State",
    backgroundColor: 'transparent',

    titleTextStyle: {
      bold: true,
      fontName: 'Segoe UI',
      fontSize: 20,
      color: '#5F5F5F'
    },
    chartArea: {
      width: "65%",
      height: "65%"
    },
    isStacked: true,
    hAxis: {
      title: "Percentage",
      minValue: 0,
      maxValue: 100,
      legend: {
        textStyle: {
          fontName: 'Segoe UI',
          fontSize: 14,
          color: '#5F5F5F',
          italic: false // Remover o itálico
        }
      },
      titleTextStyle: {
        bold: true,
        fontName: 'Segoe UI',
        fontSize: 14,
        color: '#5F5F5F',
        italic: false // Remover o itálico
      }
    },
    vAxis: {
      title: "State",
      textStyle: {
        fontName: 'Segoe UI',
        fontSize: 10,
        color: '#5F5F5F',
        italic: false // Remover o itálico
      },
      legend: {
        textStyle: {
          fontName: 'Segoe UI',
          fontSize: 10,
          color: '#5F5F5F',
          italic: false // Remover o itálico
        }
      },
      titleTextStyle: {
        bold: true,
        fontName: 'Segoe UI',
        fontSize: 14,
        color: '#5F5F5F',
        italic: false // Remover o itálico
      }
    },
    colors: ["#11BF4E", "#F25774"],
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <Chart
      chartType="BarChart"
      width="100%"
      height="100%"
      data={chartData}
      options={options}
    />
  );
}

export default App;
