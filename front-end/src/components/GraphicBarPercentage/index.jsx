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
        params: {
          limit: 100
        }
      });
      console.log('Dados da API:', response.data);

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
    const token = sessionStorage.getItem('token');
    if (token) {
      fetchData(token);
    } else {
      setError('Token de autenticação não encontrado.');
      setLoading(false);
    }
  }, []);

  const options = {
    title: "Sentiment by State",
    chartArea: { width: "70%", height: "70%" },
    backgroundColor: 'transparent',
    isStacked: true,
    hAxis: {
      title: "Percentage",
      minValue: 0,
      maxValue: 100,
    },
    vAxis: {
      title: "State",
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
