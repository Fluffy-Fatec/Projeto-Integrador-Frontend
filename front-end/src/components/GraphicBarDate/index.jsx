import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';

export function App({ token, startDate, endDate, selectedSent, selectedDataSource }) {
  const [chartData, setChartData] = useState({});
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

      if (selectedDataSource !== '') {
        url += `&datasource=${selectedDataSource}`;
      }

      const response = await axios.get(url);

      const originCounts = {};
      response.data.forEach(item => {
        const origin = item.origin;
        if (!originCounts[origin]) {
          originCounts[origin] = { positive: 0, negative: 0, neutral: 0 };
        }

        const sentiment = item.sentimentoPredito;
        if (sentiment === '2') {
          originCounts[origin].positive++;
        } else if (sentiment === '0') {
          originCounts[origin].negative++;
        } else if (sentiment === '1') {
          originCounts[origin].neutral++;
        }
      });

      setChartData(originCounts);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao buscar dados da API:', error);
      setError('Erro ao buscar dados da API.');
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token && startDate && endDate) {
      fetchData();
    } else {
      setError('Parâmetros de data ou token faltando.');
      setLoading(false);
    }
  }, [token, startDate, endDate, selectedSent, selectedDataSource]);

  const options = {
    chart: {
      type: 'bar',
      height: 350
    },
    plotOptions: {
      bar: {
        horizontal: true,
        columnWidth: '55%',
        endingShape: 'rounded'
      },
    },
    colors: ['#06d6a0', '#ef476f', '#ffd166'],
    dataLabels: {
      enabled: false
    },
    grid: {
      borderColor: '#f1f1f1',
    },
    yaxis: {
      title: {
        text: 'Data source',
        style: {
          color: '#888888'
        }
      }
    },
    xaxis: {
      categories: ['Positivo', 'Negativo', 'Neutro'],
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return val.toFixed(0);
        }
      }
    },
    title: {
      text: 'Sentiment Classification by Source',
      align: 'left',
      style: {
        fontSize: '12px',
        fontWeight: 'bold',
        fontFamily: 'Segoe UI',
        color: '#888888',
      },
    },
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
      <Chart
        options={options}
        series={Object.entries(chartData).map(([origin, counts]) => ({
          name: origin,
          data: [counts.positive, counts.negative, counts.neutral]
        }))}
        type="bar"
        height={350}
      />
    </>
  );
}

export default App;
