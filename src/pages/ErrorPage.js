import React from 'react';
import { Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function ErrorPage() {
  const navigate = useNavigate();

  const handleRedirect = () => {
    navigate('/visorHome');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <Typography variant="h4" gutterBottom>
        Böyle bir sayfa bulunmamaktadır.
      </Typography>
      <Button variant="contained" color="primary" onClick={handleRedirect}>
        Anasayfaya Dön
      </Button>
    </div>
  );
}