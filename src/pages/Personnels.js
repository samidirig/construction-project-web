import React, { useEffect, useState } from 'react'
import { getCompanyByManagerId, getCompanyPersonnels, getCompanyWaitingPersonnels, setPersonnelStatuConfirm } from '../config/firebase';
import { Button, Card, CardContent, CircularProgress, Stack, Typography } from '@mui/material';
import Background1 from '../assets/images/background_1.jpg';
import PersonnelsTable from '../components/table/personel_table/PersonnelTable';
import { useWindowSizeWidth } from '../config/hooks';
import {
  mainContent,
  tableContent,
  tableContentHeader,
  // buttonContent,
} from "../style/utils";

export default function Personnels() {

  const windowScreenWidth = useWindowSizeWidth();
  const [personnelData, setPersonnelData] = useState({});
  const [waitingPersonnelData, setWaitingPersonnelData] = useState({});
  const [companyData, setCompanyData] = useState({});
  const [loading, setLoading] = useState(true);
  const [confirmationTrigger, setConfirmationTrigger] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const company = await getCompanyByManagerId();
      setCompanyData(company);

      try {
        const personnels = await getCompanyPersonnels();
        setPersonnelData(personnels || []);
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [confirmationTrigger]);

  useEffect(() => {
    async function fetchData() {
      const company = await getCompanyByManagerId();
      setCompanyData(company);

      try {
        const waitingPersonnels = await getCompanyWaitingPersonnels();
        setWaitingPersonnelData(waitingPersonnels || []);
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [confirmationTrigger]);

  const handleSetPersonelConfirm = async (personnelId) => {
    try {
      const success = await setPersonnelStatuConfirm(personnelId);
      if (success) {
        // İşlem başarılı olduysa, gerekirse ek işlemleri burada gerçekleştirebilirsiniz.
        setConfirmationTrigger((prev) => !prev);
        console.log(`Personel (${personnelId}) başarıyla onaylandı.`);
      } else {
        console.error(`Personel (${personnelId}) onaylanırken bir hata oluştu.`);
      }
    } catch (error) {
      console.error('Personel onaylama işlemi sırasında bir hata oluştu:', error);
    }
  }

  console.log(waitingPersonnelData);
  console.log(personnelData);

  return (
    <div>
      {/* top image content */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: 200,
        display: 'flex',
        borderRadius: '50px',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'center',
      }}>
        <img src={Background1} alt="login" style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          borderRadius: '50px',
          objectFit: 'cover',
          zIndex: 1,
        }} />
        <div style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          borderRadius: '50px',
          background: 'linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.5))', // Adjust the gradient values as needed
          zIndex: 2, // Place the gradient overlay above the image
        }} />

        <Stack sx={{
          zIndex: 2,
          position: 'absolute',
          bottom: 15,
          left: '5%',
          display: 'flex',
          flexDirection: 'row',
          gap: '50px'
        }}>
          <Typography variant="h4" color={'#fff'} gutterBottom>
            {companyData.name} Personeller
          </Typography>

        </Stack>
      </div>

      {/* tables */}
      <Stack sx={{
        ...mainContent,
        height: windowScreenWidth > 1150 ? 400 : 500,
        flexWrap: windowScreenWidth > 1150 ? 'nowrap' : 'wrap',
      }}>

        {/* personnels table */}
        <Stack sx={{
          ...tableContent,
          width: windowScreenWidth > 1150 ? '50%' : '100%', // Güncellendi
        }}>

          <Stack sx={tableContentHeader}>
            <Typography variant='h5' sx={{ color: '#fff' }}>
              Personeller
            </Typography>
          </Stack>

          {loading ? (
            <CircularProgress sx={{ mt: 20 }} size={50} />
          ) : (
            <Stack sx={{
              position: 'relative',
              alignItems: 'center',
              top: '65px',
            }}>
              {personnelData.length > 0 ? (
                <PersonnelsTable personnels={personnelData} companyData={companyData} />
              ) : (
                <Typography marginTop={10}>
                  Firmanıza ait mevcut Personeller bulunamadı.
                </Typography>
              )}
            </Stack>
          )}
        </Stack>

        {/* waitingPersonnel card */}
        <Stack sx={{
          ...tableContent,
          width: windowScreenWidth > 1150 ? '50%' : '100%', // Güncellendi
        }}>

          <Stack sx={tableContentHeader}>
            <Typography variant='h5' sx={{ color: '#fff' }}>
              Onay Bekleyenler
            </Typography>
          </Stack>

          {loading ? (
            <CircularProgress sx={{ mt: 20 }} size={50} />
          ) : (
            <Stack sx={{
              position: 'relative',
              alignItems: 'center',
              top: '65px',
            }}>
              {waitingPersonnelData.length > 0 ? (
                waitingPersonnelData.map((waitingPersonnel, index) => (
                  <Card key={index} sx={{
                    mb: 2,
                    p: 1,
                    width: '80%',
                    maxWidth: '80%',
                    height: 'auto',
                    backgroundColor: 'rgba(255, 152, 67, 0.2)',
                    borderRadius: '20px',
                    boxShadow: "0px 0 10px rgba(52, 104, 192, 0.3)",
                    transition: 'transform 0.3s',
                    overflow:'auto',
                    '&:hover': {
                      transform: 'scale(1.05)',
                    },
                  }}>
                    <CardContent sx={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}>
                      <Stack sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        justifyContent: 'center',
                      }}>
                        <Typography variant="h6" gutterBottom>
                          Personel: {waitingPersonnel.name + " " + waitingPersonnel.surname}
                        </Typography>
                        <Typography variant="subtitle1" gutterBottom>
                          Yeni Personel Kayıt.
                        </Typography>
                        <Typography variant="subtitle1" gutterBottom>
                          Onay Durum: Onay Bekliyor
                        </Typography>
                      </Stack>
                      <Button
                        onClick={() => handleSetPersonelConfirm(waitingPersonnel.id)}
                        sx={{
                          width: 100,
                          height: 30,
                          textAlign: "center",
                          bgcolor: "rgba(134, 167, 252, 0.9)",
                          color: "#fff",
                          borderRadius: '50px',
                          fontFamily: 'Arial, Helvatica, sans-serif',
                          fontSize: '14px',
                          cursor: 'pointer',
                          textTransform: 'inherit',
                          '&:hover': {
                            marginTop: '5px',
                            bgcolor: "rgba(134, 167, 252, 0.9)",
                            color: "#ffffff",
                            boxShadow: "0px 0 10px rgba(52, 104, 192, 0.7)",
                            transform: 'scale(1.05)',
                          }
                        }}>Onayla</Button>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Typography marginTop={10}>
                  Bekleyen personel başvurusu bulunmamaktadır.
                </Typography>
              )}
            </Stack>
          )}
        </Stack>

      </Stack>
    </div>
  )
}
