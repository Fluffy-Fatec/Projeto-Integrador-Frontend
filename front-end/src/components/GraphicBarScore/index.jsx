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

function App({ token, startDate, endDate, selectedSent, selectedState, selectedCountry, selectedDataSource }) {
  const [chartOptions, setChartOptions] = useState({});
  const [chartSeries, setChartSeries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const chartRef = useRef(null);
  const user = localStorage.getItem('username');

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!token) {
          setError('Token de autenticação não encontrado.');
          setLoading(false);
          return;
        }

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

        const response = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const scores = {
          1: { positives: 0, negatives: 0, neutrals: 0 },
          2: { positives: 0, negatives: 0, neutrals: 0 },
          3: { positives: 0, negatives: 0, neutrals: 0 },
          4: { positives: 0, negatives: 0, neutrals: 0 },
          5: { positives: 0, negatives: 0, neutrals: 0 }
        };

        response.data.forEach(item => {
          const score = item.reviewScore;
          const sentimentoPredito = item.sentimentoPredito;

          if (sentimentoPredito === '2') {
            scores[score].positives++;
          } else if (sentimentoPredito === '0') {
            scores[score].negatives++;
          } else if (sentimentoPredito === '1') {
            scores[score].neutrals++;
          }
        });

        const chartData = [
          { name: 'Positive', data: [] },
          { name: 'Negative', data: [] },
          { name: 'Neutral', data: [] }
        ];

        for (let score = 5; score >= 1; score--) {
          chartData[0].data.push(scores[score].positives);
          chartData[1].data.push(scores[score].negatives);
          chartData[2].data.push(scores[score].neutrals);
        }

        const options = {
          chart: {
            type: 'bar',
            height: 350,
            toolbar: {
              show: false
            },
          },
          dataLabels: {
            enabled: false
          },
          plotOptions: {
            bar: {
              horizontal: false,
            },
          },
          title: {
            text: '',
            align: 'left',
            style: {
              fontSize: '12px',
              fontWeight: 'bold',
              fontFamily: 'Segoe UI',
              color: '#888888'
            },
          },
          xaxis: {
            categories: ['5', '4', '3', '2', '1']
          },
          colors: ['#06d6a0', '#ef476f', '#ffd166'],
        };

        setChartOptions(options);
        setChartSeries(chartData);
        setLoading(false);
      } catch (error) {
        console.error('Erro ao buscar dados da API:', error);
        setError('Erro ao buscar dados da API.');
        setLoading(false);
      }
    };

    fetchData();
  }, [token, startDate, endDate, selectedSent, selectedState, selectedCountry, selectedDataSource]);

  const handleExportJpgClick = async () => {
    try {
      if (chartRef.current) {
        const dataUrl = await domToImage.toJpeg(chartRef.current, { quality: 0.95, bgcolor: '#ffffff' });
        
        const link = document.createElement('a');
        link.download = 'Review Score by Sentiment.jpg';
        link.href = dataUrl;
        link.click();
  
        await axios.post('http://localhost:8080/graphics/report/log', {
          userName: user,
          graphicTitle: "Review Score by Sentiment",
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
      if (chartSeries && chartSeries.length >= 3 && chartOptions && chartOptions.xaxis && chartOptions.xaxis.categories) {
        const data = chartSeries[0].data.map((_, index) => ({
          score: chartOptions.xaxis.categories[index],
          positive: chartSeries[0].data[index],
          negative: chartSeries[1].data[index],
          neutral: chartSeries[2].data[index]
        }));
  
        const csv = Papa.unparse(data);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
        saveAs(blob, 'Review Score by Sentiment.csv');
  
        await axios.post('http://localhost:8080/graphics/report/log', {
          userName: user,
          graphicTitle: "Review Score by Sentiment",
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
          <Typography variant="h5" style={{ fontWeight: 'bold', fontFamily: 'Segoe UI', fontSize: '12px', color: '#888888', marginLeft: "10px" }}>Review Score by Sentiment</Typography>
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
          type="bar"
          height={350}
        />
      </div>
    </>
  );
}

export default App;
