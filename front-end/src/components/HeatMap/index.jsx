import React, { useEffect } from 'react';
import { Typography } from "@mui/material";

const GoogleMap = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBT-XPf587QgEzoVCHPBFgLwM0_vfPRS34&libraries=visualization&callback=initMap`;
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // A função initMap deve estar definida no escopo global para ser chamada pelo script da API
  window.initMap = () => {
    const map = new window.google.maps.Map(document.getElementById('map'), {
      center: { lat: -14.235004, lng: -51.92528 },
      zoom: 4,
      mapTypeId: 'satellite'
    });

    const heatmapData = [
      new window.google.maps.LatLng(37.782, -122.447),
      new window.google.maps.LatLng(37.782, -122.445),
      new window.google.maps.LatLng(37.782, -122.443),
      new window.google.maps.LatLng(37.782, -122.441),
      new window.google.maps.LatLng(37.782, -122.439),
      new window.google.maps.LatLng(37.782, -122.437),
      new window.google.maps.LatLng(37.782, -122.435),
      new window.google.maps.LatLng(37.785, -122.447),
      new window.google.maps.LatLng(37.785, -122.445),
      new window.google.maps.LatLng(37.785, -122.443),
      new window.google.maps.LatLng(37.785, -122.441),
      new window.google.maps.LatLng(37.785, -122.439),
      new window.google.maps.LatLng(37.785, -122.437),
      new window.google.maps.LatLng(37.785, -122.435)
    ];

    const heatmap = new window.google.maps.visualization.HeatmapLayer({
      data: heatmapData
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
