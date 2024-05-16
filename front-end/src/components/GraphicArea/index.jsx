import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import Chart from "react-apexcharts";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileCsv, faFileImage } from "@fortawesome/free-solid-svg-icons";
import domToImage from "dom-to-image";
import Papa from "papaparse";
import { saveAs } from "file-saver";

function App({ token, endDate, startDate, selectedSent, selectedState, selectedCountry, selectedDataSource }) {
  const [chartOptions, setChartOptions] = useState({});
  const [chartSeries, setChartSeries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const chartRef = useRef(null);
  const [data, setData] = useState([]);

  const fetchData = async () => {
    try {
      const formattedStartDate = new Date(startDate).toISOString().slice(0, -5) + 'Z';
      const formattedEndDate = new Date(endDate).toISOString().slice(0, -5) + 'Z';

      let url = `http://localhost:8080/graphics/listByDateRange?startDate=${encodeURIComponent(formattedStartDate)}&endDate=${encodeURIComponent(formattedEndDate)}`;

      if (selectedSent) url += `&sentimentoPredito=${selectedSent}`;
      if (selectedState) url += `&state=${selectedState}`;
      if (selectedCountry) url += `&country=${selectedCountry}`;
      if (selectedDataSource) url += `&datasource=${selectedDataSource}`;

      const response = await axios.get(url);
      setData(response.data);

      const counts = {};

      response.data.forEach(item => {
        const monthYear = getMonthYear(new Date(item.reviewCreationDate));
        if (!counts[monthYear]) {
          counts[monthYear] = { 'Positive': 0, 'Negative': 0, 'Neutral': 0 };
        }
        if (item.sentimentoPredito === '2') counts[monthYear]['Positive']++;
        if (item.sentimentoPredito === '0') counts[monthYear]['Negative']++;
        if (item.sentimentoPredito === '1') counts[monthYear]['Neutral']++;
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
          toolbar: {
            show: false 
          }
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

  const handleExportJpgClick = () => {
    if (chartRef.current) {
      domToImage.toJpeg(chartRef.current, { quality: 0.95, bgcolor: '#ffffff' })
        .then((dataUrl) => {
          const link = document.createElement('a');
          link.download = 'chart.jpg';
          link.href = dataUrl;
          link.click();
        })
        .catch((error) => {
          console.error('Erro ao exportar gráfico para JPG:', error);
          setError('Erro ao exportar gráfico para JPG.');
        });
    }
  };

  const handleExportCsvClick = () => {
    if (chartSeries.length > 0 && chartOptions.xaxis && chartOptions.xaxis.categories) {
      const csvData = chartOptions.xaxis.categories.map((category, index) => {
        const row = { date: category };
        chartSeries.forEach(series => {
          row[series.name] = series.data[index];
        });
        return row;
      });

      const csv = Papa.unparse(csvData);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
      saveAs(blob, 'chart.csv');
    }
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
      <Grid container alignItems="center" spacing={2}>
        <Grid item xs={10}>
          <Typography variant="h5" style={{ fontWeight: 'bold', fontFamily: 'Segoe UI', fontSize: '12px', color: '#888888', marginLeft: "10px" }}>
            Sentiment Over Time
          </Typography>
        </Grid>
        <Grid item xs={0.7}>
          <FontAwesomeIcon icon={faFileCsv} onClick={handleExportCsvClick} style={{ cursor: 'pointer', color: '#888888', fontSize: '15px' }} />
        </Grid>
        <Grid item xs={0.7}>
          <FontAwesomeIcon icon={faFileImage} onClick={handleExportJpgClick} style={{ cursor: 'pointer', color: '#888888', fontSize: '15px' }} />
        </Grid>
      </Grid>
      <div ref={chartRef}>
        <Chart
          options={chartOptions}
          series={chartSeries}
          type="area"
          width="100%"
          height="350"
        />
      </div>
    </>
  );
}

export default App;
