import Typography from '@mui/material/Typography';
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Chart } from "react-google-charts";

function App({ token, endDate, startDate, selectedSent }) {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const formattedStartDate = new Date(startDate).toISOString().slice(0, -5) + 'Z';
      const formattedEndDate = new Date(endDate).toISOString().slice(0, -5) + 'Z';

      let url = `http://localhost:8080/graphics/listByDateRange?startDate=${encodeURIComponent(formattedStartDate)}&endDate=${encodeURIComponent(formattedEndDate)}`;
      
      if (selectedSent !== '') {
        url += `&sentimentoPredito=${selectedSent}`;
      }
      
      const response = await axios.get(url);

      const counts = {};

      response.data.forEach(item => {
        const weekNumber = getWeekNumber(new Date(item.reviewCreationDate));
        if (!counts[weekNumber]) {
          counts[weekNumber] = { 'Positive': 0, 'Negative': 0, 'Neutral': 0 };
        }

        if (item.sentimentoPredito === '1') {
          counts[weekNumber]['Positive']++;
        } else if (item.sentimentoPredito === '0') {
          counts[weekNumber]['Negative']++;
        } else if (item.sentimentoPredito === '2') {
          counts[weekNumber]['Neutral']++;
        }
      });

      const chartData = [['Week', 'Positive', 'Negative', 'Neutral']];
      Object.keys(counts).forEach(weekNumber => {
        chartData.push([`Week ${weekNumber}`, counts[weekNumber]['Positive'], counts[weekNumber]['Negative'], counts[weekNumber]['Neutral']]);
      });

      setChartData(chartData);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao buscar dados da API:', error);
      setError('Erro ao buscar dados da API.');
      setLoading(false);
    }
  };

  const getWeekNumber = (date) => {
    const oneJan = new Date(date.getFullYear(), 0, 1);
    const millisecsInDay = 86400000;
    return Math.ceil((((date - oneJan) / millisecsInDay) + oneJan.getDay() + 1) / 7);
  };

  useEffect(() => {
    if (token && startDate && endDate) {
      fetchData();
    } else {
      setError('Token de autenticação, startDate ou endDate não encontrados.');
      setLoading(false);
    }
  }, [token, startDate, endDate, selectedSent]);

  const options = {
    hAxis: {
      title: "Time",
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
      },
    },
    vAxis: {
      title: "Comment Count",
      minValue: 0,
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
      },
    },
    chartArea: {
      width: "65%",
      height: "55%"
    },
    colors: ["#11BF4E", "#F25774", "#FFD700"], // Green, Red, Yellow
    backgroundColor: 'transparent',
    legend: {
      position: 'bottom',
      textStyle: {
        fontName: 'Segoe UI',
        fontSize: 12,
        color: '#808080',
      }
    }
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
        chartType="AreaChart"
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
