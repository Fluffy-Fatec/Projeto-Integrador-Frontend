import axios from "axios";
import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";

function App({ token, endDate, startDate, selectedSent, selectedState, selectedCountry, selectedDataSource }) {
  const [chartOptions, setChartOptions] = useState({});
  const [chartSeries, setChartSeries] = useState([]);
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

      const counts = {};

      response.data.forEach(item => {
        const monthYear = getMonthYear(new Date(item.reviewCreationDate));
        if (!counts[monthYear]) {
          counts[monthYear] = { 'Positive': 0, 'Negative': 0, 'Neutral': 0 };
        }

        if (item.sentimentoPredito === '2') {
          counts[monthYear]['Positive']++;
        } else if (item.sentimentoPredito === '0') {
          counts[monthYear]['Negative']++;
        } else if (item.sentimentoPredito === '1') {
          counts[monthYear]['Neutral']++;
        }
      });

      const categories = Object.keys(counts);
      const series = Object.keys(counts[categories[0]]).map(sentiment => ({
        name: sentiment,
        data: categories.map(monthYear => counts[monthYear][sentiment])
      }));

      setChartOptions({
        xaxis: {
          categories: categories,
          style: {
            color: '#888888'
          }
        },
        chart: {
          background: 'transparent',
        },
        legend: {
          position: 'bottom',
          offsetY: 5,
          labels: {
            color: '#888888',
            useSeriesColors: false
          }
        },
        title: {
          text: 'Sentiment Over Time',
          align: 'left',
          style: {
            fontSize: '12px',
            fontWeight: 'bold',
            fontFamily: 'Segoe UI',
            color: '#888888',
          },
        },
        colors: ['#06d6a0', '#ef476f', '#ffd166']
      });


      setChartSeries(series);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao buscar dados da API:', error);
      setError('Erro ao buscar dados da API.');
      setLoading(false);
    }
  };

  const getMonthYear = (date) => {
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${month}/${year}`;
  };

  useEffect(() => {
    if (token && startDate && endDate) {
      fetchData();
    } else {
      setError('Token de autenticação, startDate ou endDate não encontrados.');
      setLoading(false);
    }
  }, [token, startDate, endDate, selectedSent, selectedState, selectedCountry, selectedDataSource]);

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
        options={chartOptions}
        series={chartSeries}
        type="area"
        width="100%"
        height="400"
      />
    </>
  );
}

export default App;
