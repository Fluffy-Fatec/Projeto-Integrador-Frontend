import { faFileCsv, faFileImage } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import axios from "axios";
import domToImage from "dom-to-image";
import { saveAs } from "file-saver";
import Papa from "papaparse";
import React, { useEffect, useRef, useState } from "react";
import Chart from "react-apexcharts";

function App({ token, endDate, startDate, selectedSent, selectedState, selectedCountry, selectedDataSource }) {
  const [chartOptions, setChartOptions] = useState({});
  const [chartSeries, setChartSeries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const chartRef = useRef(null);
  const [chartReady, setChartReady] = useState(false);
  const user = localStorage.getItem('username');

  useEffect(() => {
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
        const data = response.data;

        const counts = {};
        data.forEach(item => {
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
        setChartReady(true);
        setLoading(false);
      } catch (error) {
        console.error('Erro ao buscar dados da API:', error);
        setError('Erro ao buscar dados da API.');
        setLoading(false);
      }
    };

    if (token && startDate && endDate) {
      fetchData();
    } else {
      setError('Token de autenticação, startDate ou endDate não encontrados.');
      setLoading(false);
    }
  }, [token, startDate, endDate, selectedSent, selectedState, selectedCountry, selectedDataSource]);

  const getMonthYear = (date) => {
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${month}/${year}`;
  };

  const handleExportCsvClick = async () => {
    try {
      setLoading(true);

      if (chartReady && chartSeries.length > 0 && chartOptions.xaxis && chartOptions.xaxis.categories) {
        const csvData = [];
        const headerRow = ['Date', 'Positive', 'Negative', 'Neutral']; // Cabeçalho CSV
        csvData.push(headerRow);

        chartOptions.xaxis.categories.forEach((category, index) => {
          const rowData = [
            category,
            chartSeries[0].data[index], // Positive
            chartSeries[1].data[index], // Negative
            chartSeries[2].data[index]  // Neutral
          ];
          csvData.push(rowData);
        });

        console.log('CSV Data:', csvData);

        const csv = Papa.unparse(csvData);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
        saveAs(blob, 'Sentiment_Over_Time.csv');

        await axios.post('http://localhost:8080/graphics/report/log', {
          userName: user,
          graphicTitle: "Sentiment Over Time",
          type: "CSV"
        });
      } else {
        setError('Chart data is incomplete or missing.');
      }
    } catch (error) {
      console.error('Error exporting chart CSV:', error);
      setError('Error exporting chart CSV.');
    } finally {
      setLoading(false);
    }
  };


  const handleExportJpgClick = async () => {
    try {
      if (chartRef.current) {
        const dataUrl = await domToImage.toJpeg(chartRef.current.firstChild, { quality: 0.95, bgcolor: '#ffffff' });
        const link = document.createElement('a');
        link.download = 'Sentiment Over Time.jpg';
        link.href = dataUrl;
        link.click();
        await axios.post('http://localhost:8080/graphics/report/log', {
          userName: user,
          graphicTitle: "Sentiment Over Time",
          type: "JPEG"
        });
      } else {
        setError('Chart data is incomplete or missing.');
      }
    } catch (error) {
      console.error('Error exporting chart JPEG:', error);
      setError('Error exporting chart JPEG.');
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
      {chartReady && (
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
      )}
    </>
  );
}

export default App;
