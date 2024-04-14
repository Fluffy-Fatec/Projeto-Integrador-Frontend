import Typography from '@mui/material/Typography';
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Chart } from "react-google-charts";

function App({ token }) {
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

      const counts = {};

      response.data.forEach(item => {
        const weekNumber = getWeekNumber(new Date(item.reviewCreationDate));
        if (!counts[weekNumber]) {
          counts[weekNumber] = { 'Positive': 0, 'Negative': 0 };
        }

        if (item.sentimentoPredito === '1') {
          counts[weekNumber]['Positive']++;
        } else if (item.sentimentoPredito === '0') {
          counts[weekNumber]['Negative']++;
        }
      });

      const chartData = [['Week', 'Positive', 'Negative']];
      Object.keys(counts).forEach(weekNumber => {
        chartData.push([`Week ${weekNumber}`, counts[weekNumber]['Positive'], counts[weekNumber]['Negative']]);
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
    if (token) {
      fetchData(token);
    } else {
      setError('Token de autenticação não encontrado.');
      setLoading(false);
    }
  }, [token]);

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
    colors: ["#11BF4E", "#F25774"],
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
      <Typography variant="h5" style={{ padding: '20px', fontWeight: 'bold', fontFamily: 'Segoe UI', fontSize: 22 }}>Sentiment Over Time</Typography>
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
