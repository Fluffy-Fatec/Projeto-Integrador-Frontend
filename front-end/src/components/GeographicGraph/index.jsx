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

function ApexChart({ startDate, endDate, selectedState, selectedCountry, selectedDataSource }) {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const chartRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
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

        const countsByState = {};

        response.data.forEach(item => {
          const state = item.geolocationState;
          const sentimentoPredito = item.sentimentoPredito;

          if (!countsByState[state]) {
            countsByState[state] = {
              'Positive': 0,
              'Negative': 0,
              'Neutral': 0
            };
          }

          if (sentimentoPredito === '2') {
            countsByState[state]['Positive']++;
          } else if (sentimentoPredito === '0') {
            countsByState[state]['Negative']++;
          } else if (sentimentoPredito === '1') {
            countsByState[state]['Neutral']++;
          }
        });

        const chartData = Object.keys(countsByState).map(state => ({
          x: state,
          Positive: countsByState[state]['Positive'],
          Negative: countsByState[state]['Negative'],
          Neutral: countsByState[state]['Neutral']
        }));

        setChartData(chartData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data from API:', error);
        setError('Error fetching data from API.');
        setLoading(false);
      }
    };

    fetchData();
  }, [startDate, endDate, selectedCountry, selectedDataSource, selectedState]);

  const options = {
    chart: {
      height: 350,
      type: 'line',
      toolbar: {
        show: false // Adiciona esta linha para remover o menu do gráfico
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'smooth'
    },
    xaxis: {
      type: 'category',
      categories: chartData.map(data => data.x),
      style: {
        color: '#888888'
      }
    },
    yaxis: {
      title: {
        text: 'Count',
        style: {
          color: '#888888'
        }
      }
    },
    tooltip: {
      shared: false,
      y: {
        formatter: function (val) {
          return val;
        }
      }
    },
    title: {
      text: '',
      align: 'left',
      style: {
        fontSize: '12px',
        fontWeight: 'bold',
        fontFamily: 'Segoe UI',
        color: '#888888',
      },
    },
    colors: ['#06d6a0', '#ef476f', '#ffd166'],
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
          console.error('Error exporting chart to JPG:', error);
          setError('Error exporting chart to JPG.');
        });
    }
  };

  const handleExportCsvClick = () => {
    const data = chartData.map(item => ({
      state: item.x,
      positive: item.Positive,
      negative: item.Negative,
      neutral: item.Neutral
    }));

    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    saveAs(blob, 'chart.csv');
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <Grid container alignItems="center" spacing={2}>
        <Grid item xs={10}>
          <Typography variant="h5" style={{ fontWeight: 'bold', fontFamily: 'Segoe UI', fontSize: '12px', color: '#888888', marginLeft: "10px" }}>Count by Feelings by State</Typography>
        </Grid>
        <Grid item xs={0.7}>
          <FontAwesomeIcon icon={faFileCsv} onClick={handleExportCsvClick} style={{ cursor: 'pointer', color: '#888888', fontSize: '15px' }} />
        </Grid>
        <Grid item xs={0.7}>
          <FontAwesomeIcon icon={faFileImage} onClick={handleExportJpgClick} style={{ cursor: 'pointer', color: '#888888', fontSize: '15px' }} />
        </Grid>
      </Grid>
      <div ref={chartRef}>
        <Chart options={options} series={[
          { name: 'Positive', data: chartData.map(data => data.Positive) },
          { name: 'Negative', data: chartData.map(data => data.Negative) },
          { name: 'Neutral', data: chartData.map(data => data.Neutral) }
        ]} type="line" height={350} />
      </div>
    </div>
  );
}

export default ApexChart;
