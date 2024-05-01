import React from 'react';
import fundo from "../../assets/fundo-login.jpg";
import Login from "../PrivacyPolicy";

const FundoLogin = () => {
  const pageStyle = {
    width: '100vw',
    height: '100vh',
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  };

  const backgroundStyle = {
    width: '100%',
    height: '100%',
    backgroundImage: `url(${fundo})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    opacity: 0.09
  };

  const overlayStyle = {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.10)',
    position: 'absolute',
    top: 0,
    left: 0,
  };

  return (
    <div style={pageStyle}>
      <div style={backgroundStyle}></div>
      <div style={overlayStyle}><Login /></div>
    </div>
  );
};

export default FundoLogin;
