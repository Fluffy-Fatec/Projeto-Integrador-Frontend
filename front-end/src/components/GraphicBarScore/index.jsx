import Typography from '@mui/material/Typography';
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Chart } from "react-google-charts";

function App({ token }) {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!token) {
          setError('Token de autenticação não encontrado.');
          setLoading(false);
          return;
        }

        const response = await axios.get('http://localhost:8080/graphics/list', {
          headers: {
            'Authorization': `Bearer ${token}`
          },
        });

        const scores = {
          1: { positives: 0, negatives: 0 },
          2: { positives: 0, negatives: 0 },
          3: { positives: 0, negatives: 0 },
          4: { positives: 0, negatives: 0 },
          5: { positives: 0, negatives: 0 }
        };

        response.data.forEach(item => {
          const score = item.reviewScore;
          const sentimentoPredito = item.sentimentoPredito;

          if (sentimentoPredito === '1') {
            scores[score].positives++;
          } else if (sentimentoPredito === '0') {
            scores[score].negatives++;
          }
        });

        const chartData = [['Score', 'Positive', 'Negative']];

        for (let score = 5; score >= 1; score--) {
          chartData.push([score.toString(), scores[score].positives, scores[score].negatives]);
        }

        setChartData(chartData);
        setLoading(false);
      } catch (error) {
        console.error('Erro ao buscar dados da API:', error);
        setError('Erro ao buscar dados da API.');
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const options = {
    backgroundColor: 'transparent',
    chartArea: {
      width: "60%",
      height: "55%"
    },

    isStacked: true,
    hAxis: {
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
    vAxis: {
      title: "Score",
      
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
    legend: {
      position: 'bottom',
      textStyle: {
        fontName: 'Segoe UI',
        fontSize: 12,
        color: '#808080',
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
    <>
      <Typography variant="h5" style={{ padding: '20px', fontWeight: 'bold', fontFamily: 'Segoe UI', fontSize: 20 }}>Review Score by Sentiment</Typography>
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
