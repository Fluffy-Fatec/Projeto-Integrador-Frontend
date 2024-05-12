import axios from "axios";
import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";

function App({ token, endDate, startDate, selectedDataSource }) {
  const [chartData, setChartData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async (token) => {
    try {
      const formattedStartDate = new Date(startDate).toISOString().slice(0, -5) + 'Z';
      const formattedEndDate = new Date(endDate).toISOString().slice(0, -5) + 'Z';

      let url = `http://localhost:8080/graphics/listByDateRange?startDate=${encodeURIComponent(formattedStartDate)}&endDate=${encodeURIComponent(formattedEndDate)}`;

      if (selectedDataSource !== '') {
        url += `&datasource=${selectedDataSource}`;
      }

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

        if (sentiment === '2') {
          stateData[state].positives++;
        } else if (sentiment === '0') {
          stateData[state].negatives++;
        } else if (sentiment === '1') {
          stateData[state].neutrals++;
        }

        stateData[state].total++;
      });

      const series = [{
        data: []
      }];

      for (const state in stateData) {
        const { positives, negatives, neutrals, total } = stateData[state];
        const positivePercentage = ((positives / total) * 100).toFixed(2);
        const negativePercentage = ((negatives / total) * 100).toFixed(2);
        const neutralPercentage = ((neutrals / total) * 100).toFixed(2);

        series[0].data.push({ x: state, y: parseFloat(positivePercentage) });
      }

      setChartData({ series });
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
  }, [token, startDate, endDate, selectedDataSource]);

  const options = {
    chart: {
      type: 'treemap',
      height: 350
    },
    title: {
      text: 'Sentiment Treemap by State',
      align: 'left',
      style: {
        fontSize: '12px',
        fontWeight: 'bold',
        fontFamily: 'Segoe UI',
        color: '#888888'
      },
    },
    legend: {
      show: false
    },
    colors: ["#06d6a0"]
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      <br />
      <div style={{ marginLeft: '15px' }}
      >
        <Chart
          options={options}
          series={chartData.series}
          type="treemap"
          height="400"
          width="95%"
        />
      </div>
    </>
  );
}

export default App;