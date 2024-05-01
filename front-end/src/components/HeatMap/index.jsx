import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Typography } from "@mui/material";

const GoogleMap = ({ token }) => {
  const [heatmapData, setHeatmapData] = useState([]);

  useEffect(() => {
    const fetchData = async (token) => {
      try {
        const response = await axios.get('http://localhost:8080/graphics/list', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        });

        const data = response.data;
        const newHeatmapData = data.map(item => ({
          lat: parseFloat(item.geolocationLat).toFixed(3),
          lng: parseFloat(item.geolocationLng).toFixed(3)
        }));
        setHeatmapData(newHeatmapData);

      } catch (error) {
        console.error('Erro ao buscar dados da API:', error);
      }
    };

    if (token) {
      fetchData(token);
    }
  }, [token]);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBT-XPf587QgEzoVCHPBFgLwM0_vfPRS34&libraries=visualization&loading=async&callback=initMap`;
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  window.initMap = () => {
    var centerMap = new window.google.maps.LatLng(-14.235004, -51.92528);
    const map = new window.google.maps.Map(document.getElementById('map'), {
      center: centerMap,
      zoom: 4,
      mapTypeId: 'satellite'
    });

    const newHeatmapData = heatmapData.map(coord => new window.google.maps.LatLng(parseFloat(coord.lat), parseFloat(coord.lng)));

    const heatmap = new window.google.maps.visualization.HeatmapLayer({
      data: newHeatmapData
    });
    heatmap.setMap(map);
  };

  return (
    <>
      <Typography variant="h5" style={{ padding: '20px', fontWeight: 'bold', fontFamily: 'Segoe UI', fontSize: 20 }}>Sentiment Map</Typography>
      <div id="map" style={{ width: '100%', height: '88%' }}>
        {/* O mapa será renderizado dentro deste elemento */}
      </div>
    </>
  );
};

export default GoogleMap;
