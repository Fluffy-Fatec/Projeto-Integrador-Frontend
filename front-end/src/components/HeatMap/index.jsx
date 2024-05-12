import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Typography } from "@mui/material";

const GoogleMap = ({
  token,
  startDate,
  endDate,
  selectedSent,
  selectedState,
  selectedCountry,
  selectedDataSource
}) => {
  const [heatmapData, setHeatmapData] = useState([]);
  const [map, setMap] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const url = constructApiUrl(startDate, endDate, selectedSent, selectedState, selectedCountry, selectedDataSource);
      const response = await axios.get(url);
      const data = response.data;
      const newHeatmapData = data.map(item => ({
        lat: parseFloat(item.geolocationLat),
        lng: parseFloat(item.geolocationLng)
      }));
      setHeatmapData(newHeatmapData);
    } catch (error) {
      console.error('Erro ao buscar dados da API:', error);
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate, selectedSent, selectedState, selectedCountry, selectedDataSource]);

  useEffect(() => {
    if (token && startDate && endDate) {
      setLoading(true);
      fetchData();
    }
  }, [token, startDate, endDate, fetchData]);

  useEffect(() => {
    if (!map) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBT-XPf587QgEzoVCHPBFgLwM0_vfPRS34&libraries=visualization&callback=initMap`;
      script.async = true;
      window.initMap = () => {
        const newMap = new window.google.maps.Map(document.getElementById('map'), {
          center: { lat: 0, lng: 0 },
          zoom: 2,
          mapTypeId: 'satellite'
        });
        setMap(newMap);
        if (heatmapData.length > 0) {
          const bounds = new window.google.maps.LatLngBounds();
          heatmapData.forEach(coord => {
            bounds.extend(coord);
          });
          newMap.fitBounds(bounds);
          const heatmap = new window.google.maps.visualization.HeatmapLayer({
            data: heatmapData.map(coord => new window.google.maps.LatLng(coord.lat, coord.lng)),
            map: newMap
          });
        }
      };
      document.body.appendChild(script);
      return () => {
        document.body.removeChild(script);
        window.initMap = null;
      };
    }
  }, [map, heatmapData]);

  const constructApiUrl = (startDate, endDate, selectedSent, selectedState, selectedCountry, selectedDataSource) => {
    let url = `http://localhost:8080/graphics/listByDateRange?startDate=${encodeURIComponent(new Date(startDate).toISOString().slice(0, -5) + 'Z')}&endDate=${encodeURIComponent(new Date(endDate).toISOString().slice(0, -5) + 'Z')}`;
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
    return url;
  };

  return (
    <>
      <Typography variant="h5" style={{ padding: '20px', fontWeight: 'bold', fontFamily: 'Segoe UI', fontSize: '12px', color: '#888888', }}>Review Heatmap</Typography>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div id="map" style={{ width: '100%', height: '82%' }}></div>
      )}
    </>
  );
};

export default GoogleMap;