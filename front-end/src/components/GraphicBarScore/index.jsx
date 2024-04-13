import React, { useState, useEffect } from "react";
import { Chart } from "react-google-charts";
import axios from "axios";

function App({ token }) {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  console.log(" 1" + token)

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
    title: "Review Score by Sentiment",
    backgroundColor: 'transparent',
    titleTextStyle: {
      bold: true,
      fontName: 'Segoe UI',
      fontSize: 20,
      color: '#5F5F5F'
    },
    chartArea: {
      width: "65%",
      height: "50%"
    },
    isStacked: true,
    hAxis: {
      title: "Comment Count",
      minValue: 0,
      legend: {
        textStyle: {
          fontName: 'Segoe UI',
          fontSize: 14,
          color: '#5F5F5F',
          italic: false
        }
      },
      titleTextStyle: {
        bold: true,
        fontName: 'Segoe UI',
        fontSize: 14,
        color: '#5F5F5F',
        italic: false
      },
    },
    vAxis: {
      title: "Score",
      legend: {
        textStyle: {
          fontName: 'Segoe UI',
          fontSize: 14,
          color: '#5F5F5F',
          italic: false
        }
      },
      titleTextStyle: {
        bold: true,
        fontName: 'Segoe UI',
        fontSize: 14,
        color: '#5F5F5F',
        italic: false
      },
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
