import { Typography } from "@mui/material";
import axios from 'axios';
import React, { useEffect, useState } from 'react';

let heatmap;

const GoogleMap = ({ token, startDate, endDate, selectedSent, selectedState, selectedCountry, selectedDataSource }) => {

  const [heatmapData, setHeatmapData] = useState([]);

  useEffect(() => {
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
        const data = response.data;
        console.log(data)
        // Sempre definir os dados do heatmap
        const newHeatmapData = data.map(item => ({
          lat: parseFloat(item.geolocationLat).toFixed(3),
          lng: parseFloat(item.geolocationLng).toFixed(3)
        }));
        setHeatmapData(newHeatmapData);

      } catch (error) {
        console.error('Erro ao buscar dados da API:', error);
      }
    };

    if (token && startDate && endDate) {
      fetchData();
    }
  }, [token, startDate, endDate, selectedSent, selectedState, selectedCountry, selectedDataSource]);


  useEffect(() => {
    if (heatmapData.length > 0) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBT-XPf587QgEzoVCHPBFgLwM0_vfPRS34&libraries=visualization&loading=async&callback=initMap`;
      script.async = true;
      document.body.appendChild(script);

      return () => {
        document.body.removeChild(script);
      };
    }
  }, [heatmapData]);

  window.initMap = () => {
    var centerMap = new window.google.maps.LatLng(37.09024, -95.712891);
    const map = new window.google.maps.Map(document.getElementById('map'), {
      center: centerMap,
      zoom: 3,
      mapTypeId: 'satellite'
    });

    const newHeatmapData = heatmapData.map(coord => new window.google.maps.LatLng(parseFloat(coord.lat), parseFloat(coord.lng)));

    if (heatmap) {
      heatmap.setMap(null);
    }

    heatmap = new window.google.maps.visualization.HeatmapLayer({
      data: newHeatmapData
    });
    heatmap.setMap(map);
  };

  return (
    <>
      <Typography variant="h5" style={{ padding: '20px', fontWeight: 'bold', fontFamily: 'Segoe UI', fontSize: '12px', color: '#888888' }}>Review Heatmap</Typography>
      <div id="map" style={{ width: '100%', height: '82%' }}>
        {/* O mapa será renderizado dentro deste elemento */}
      </div>
    </>
  );
};

export default GoogleMap;
