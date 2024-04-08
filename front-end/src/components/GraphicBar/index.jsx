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
          limit: 10 // Limite para os primeiros 100 registros
        }
      });
      console.log('Dados da API:', response.data);

      const scores = {
        1: { positives: 0, negatives: 0 },
        2: { positives: 0, negatives: 0 },
        3: { positives: 0, negatives: 0 },
        4: { positives: 0, negatives: 0 },
        5: { positives: 0, negatives: 0 }
      };

      // Loop através dos dados da resposta para contar positivos e negativos por pontuação
      response.data.forEach(item => {
        const score = item.reviewScore;
        const sentiment = item.sentiment;

        // Incrementa as contagens de positivos e negativos
        if (sentiment === 'Positivo') {
          scores[score].positives++;
        } else if (sentiment === 'Negativo') {
          scores[score].negatives++;
        }
      });

      // Prepara os dados para o gráfico de barras
      const chartData = [
        ['Score', 'Positive', 'Negative']
      ];

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
    title: "Review Score by Sentiment",
    chartArea: { width: "50%" },
    isStacked: true,
    hAxis: {
      title: "Comment Count",
      minValue: 0,
    },
    vAxis: {
      title: "Score",
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
