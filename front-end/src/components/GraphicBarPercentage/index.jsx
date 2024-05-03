import { Typography } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Chart } from "react-google-charts";

function App({ token, endDate, startDate }) {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async (token) => {
    try {
      const formattedStartDate = new Date(startDate).toISOString().slice(0, -5) + 'Z';
      const formattedEndDate = new Date(endDate).toISOString().slice(0, -5) + 'Z';

      let url = `http://localhost:8080/graphics/listByDateRange?startDate=${encodeURIComponent(formattedStartDate)}&endDate=${encodeURIComponent(formattedEndDate)}`;

      const response = await axios.get(url);

      const stateData = {};

      response.data.forEach(item => {
        const state = item.geolocationState;
        const sentiment = item.sentimentoPredito;

        if (!stateData[state]) {
          stateData[state] = {
            positives: 0,
            negatives: 0,
            neutrals: 0,
            total: 0
          };
        }

        if (sentiment === '1') {
          stateData[state].positives++;
        } else if (sentiment === '0') {
          stateData[state].negatives++;
        } else if (sentiment === '2') {
          stateData[state].neutrals++;
        }

        stateData[state].total++;
      });

      const chartData = [
        ['State', 'Positive', 'Negative', 'Neutral']
      ];

      for (const state in stateData) {
        const { positives, negatives, neutrals, total } = stateData[state];
        const positivePercentage = (positives / total) * 100;
        const negativePercentage = (negatives / total) * 100;
        const neutralPercentage = (neutrals / total) * 100;
        chartData.push([state, positivePercentage, negativePercentage, neutralPercentage]);
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
      fetchData(token);
    } else {
      setError('Token de autenticação, startDate ou endDate não encontrados.');
      setLoading(false);
    }
  }, [token, startDate, endDate]);

  const options = {
    backgroundColor: 'transparent',
    chartArea: {
      width: "60%",
      height: "65%"
    },
    isStacked: true,
    hAxis: {
      title: "Percentage",
      minValue: 0,
      maxValue: 100,

      titleTextStyle: {
        bold: true,
        fontName: 'Segoe UI',
        fontSize: 14,
        color: '#808080',
        italic: false
      },
      textStyle: {
        fontName: 'Segoe UI',
        fontSize: 12,
        color: '#808080'
      }
    },
    vAxis: {
      title: "State",
      titleTextStyle: {
        bold: true,
        fontName: 'Segoe UI',
        fontSize: 14,
        color: '#808080',
        italic: false
      },
      textStyle: {
        fontName: 'Segoe UI',
        fontSize: 12,
        color: '#808080'
      }
    },
    legend: {
      position: 'bottom',
      textStyle: {
        fontName: 'Segoe UI',
        fontSize: 12,
        color: '#808080',
      }
    },
    colors: ["#11BF4E", "#F25774", "#FFD700"], // Green, Red, Yellow
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      <Typography variant="h5" style={{ padding: '20px', fontWeight: 'bold', fontFamily: 'Segoe UI', fontSize: 20 }}>Sentiment by State</Typography>
      <Chart
        chartType="BarChart"
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
