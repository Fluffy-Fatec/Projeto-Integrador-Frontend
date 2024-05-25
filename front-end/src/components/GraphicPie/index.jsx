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

function App({ token, startDate, endDate, selectedState, selectedCountry, selectedDataSource }) {
  const [chartData, setChartData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const chartRef = useRef(null);
  const user = localStorage.getItem('username');

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
              show: false
            },
          },
          title: {
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

  const handleExportJpgClick = async () => {
    try {
      if (chartRef.current) {
        const dataUrl = await domToImage.toJpeg(chartRef.current, { quality: 0.95, bgcolor: '#ffffff' });
        const link = document.createElement('a');
        link.download = 'Percentage of Sentiment.jpg';
        link.href = dataUrl;
        link.click();

        await axios.post('http://localhost:8080/graphics/report/log', {
          userName: user,
          graphicTitle: "Percentage of Sentiment",
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


  const handleExportCsvClick = async () => {
    try {
      if (chartData && chartData.options && chartData.options.labels && chartData.series) {
        const data = chartData.options.labels.map((label, index) => ({
          sentiment: label,
          count: chartData.series[index]
        }));

        const csv = Papa.unparse(data);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
        saveAs(blob, 'Percentage of Sentiment.csv');

        await axios.post('http://localhost:8080/graphics/report/log', {
          userName: user,
          graphicTitle: "Percentage of Sentiment",
          type: "CSV"
        });
      } else {
        setError('No data available to export.');
      }
    } catch (error) {
      console.error('Error exporting chart data:', error);
      setError('Error exporting chart data.');
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
      <Grid container alignItems="center" spacing={2}>
        <Grid item xs={10}>
          <Typography variant="h5" style={{ fontWeight: 'bold', fontFamily: 'Segoe UI', fontSize: '12px', color: '#888888', marginLeft: "10px" }}>Percentage of Sentiment </Typography>
        </Grid>
        <Grid item xs={0.7}>
          <FontAwesomeIcon icon={faFileCsv} onClick={handleExportCsvClick} style={{ cursor: 'pointer', color: '#888888', fontSize: '15px' }} />
        </Grid>
        <Grid item xs={0.7}>
          <FontAwesomeIcon icon={faFileImage} onClick={handleExportJpgClick} style={{ cursor: 'pointer', color: '#888888', fontSize: '15px' }} />
        </Grid>
      </Grid>
      <div ref={chartRef}>
        <Chart options={chartData.options} series={chartData.series} type="pie" height={350} />
      </div>
    </>
  );
}

export default App;
