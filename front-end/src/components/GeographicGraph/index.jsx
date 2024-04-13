import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Chart } from 'react-google-charts';

function GeographicGraph() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = sessionStorage.getItem('token');
        if (!token) {
          setError('Token de autenticação não encontrado.');
          setLoading(false);
          return;
        }

        const response = await axios.get('http://localhost:8080/graphics/list', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const filteredData = response.data.filter(item => {
          const lat = parseFloat(item.geolocationLat);
          const lng = parseFloat(item.geolocationLng);
          return lat >= -56.0 && lat <= 12.0 && lng >= -81.0 && lng <= -34.0;
        });

        const chartData = filteredData.map(item => {
          return [
            parseFloat(item.geolocationLat),
            parseFloat(item.geolocationLng),
            parseInt(item.sentimentoPredito)
          ];
        });

        chartData.unshift(["Latitude", "Longitude", "Sentimento"]);
        setData(chartData);
        setLoading(false);
      } catch (error) {
        setError('Erro ao carregar os dados.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleChartSelect = ({ chartWrapper }) => {
    const chart = chartWrapper.getChart();
    const selection = chart.getSelection();
    if (selection.length === 0) return;
    const region = data[selection[0].row + 1];
    console.log("Selected: ", region);
  };

  return (
    <Chart
      chartType="GeoChart"
      width="100%"
      height="100%"
      data={data}
      chartEvents={[
        {
          eventName: 'select',
          callback: handleChartSelect
        }
      ]}
      options={{
        sizeAxis: { minValue: 0, maxValue: 100 },
        region: '005',
        displayMode: 'markers',
        colorAxis: { colors: ['red', 'green'] },
        zoomLevel: 5,
        magnifyingGlass: { enable: true },
        dataLabels: true,
        backgroundColor: 'transparent',
      }}
    />
  );
}

export default GeographicGraph;
