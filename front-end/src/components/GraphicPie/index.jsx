import axios from "axios";
import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";

function App({ token, startDate, endDate, selectedState, selectedCountry, selectedDataSource }) {
  const [chartData, setChartData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async (token, startDate, endDate) => {
    try {
      const formattedStartDate = new Date(startDate).toISOString().slice(0, -5) + 'Z';
      const formattedEndDate = new Date(endDate).toISOString().slice(0, -5) + 'Z';

      let url = `http://localhost:8080/graphics/listByDateRange?startDate=${encodeURIComponent(formattedStartDate)}&endDate=${encodeURIComponent(formattedEndDate)}`;

      if (selectedState !== '') {
        url += `&state=${selectedState}`;
      }

      if (selectedCountry !== '') {
        url += `&country=${selectedCountry}`;
      }

      if (selectedDataSource !== '') {
        url += `&datasource=${selectedDataSource}`;
      }

      const response = await axios.get(url);

      const counts = {
        'Positive': 0,
        'Negative': 0,
        'Neutral': 0
      };

      response.data.forEach(item => {
        const sentimentoPredito = item.sentimentoPredito;

        if (sentimentoPredito === '2') {
          counts['Positive']++;
        } else if (sentimentoPredito === '0') {
          counts['Negative']++;
        } else if (sentimentoPredito === '1') {
          counts['Neutral']++;
        }
      });

      const chartData = {
        options: {
          chart: {
            background: 'transparent',
            type: 'pie',
            toolbar: {
              show: true
            },
          },
          title: {
            text: 'Sentiment Over Time',
            align: 'left',
            style: {
              fontSize: '12px',
              fontWeight: 'bold',
              fontFamily: 'Segoe UI',
              color: '#888888'
            },
          },

          labels: Object.keys(counts),
          colors: ['#06d6a0', '#ef476f', '#ffd166'],
          legend: {
            position: 'bottom',
            labels: {
              colors: '#808080',
              fontSize: '12px',
              fontFamily: 'Segoe UI',
            }
          },
        },
        series: Object.values(counts),
      };

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
      fetchData(token, startDate, endDate);
    } else {
      setError('Token de autenticação, startDate ou endDate não encontrados.');
      setLoading(false);
    }
  }, [token, startDate, endDate, selectedState, selectedCountry, selectedDataSource]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      <br />
      <ReactApexChart options={chartData.options} series={chartData.series} type="pie" height={350} />
    </>
  );
}

export default App;
