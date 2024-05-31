import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Typography, Link, InputAdornment, IconButton } from "@mui/material";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { useSelector, useDispatch } from "react-redux";
import { changeEmail, changePassword, logIn, logOut } from "../redux/visorAuthSlice";
import { checkVisorCompanyByUserEmail, getVisorUserRoleByEmail } from "../config/firebase";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import LoginImage from "../assets/images/login_image_2.png"
import { useWindowSizeWidth } from "../config/hooks";

export default function VisorLogin() {
  const email = useSelector((state) => state.auth.email);
  const password = useSelector((state) => state.auth.password);
  const isLoading = useSelector((state) => state.auth.isLoading);
  const dispatch = useDispatch();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackMessage, setSnackMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const windowScreenWidth = useWindowSizeWidth();
  const navigate = useNavigate();


  const handleEmailChange = (e) => {
    dispatch(changeEmail(e.currentTarget.value));
  };

  const handlePasswordChange = (e) => {
    dispatch(changePassword(e.currentTarget.value));
  };
  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let isCompanyCreated;
      try {
        isCompanyCreated = await checkVisorCompanyByUserEmail(email);
      } catch (error) {
        console.error("There isn't any Visor Company that given to function: ", error);
        setSnackMessage("Sistemde bir hata mevcut, Firma bulunamamaktadır.");
        handleOpenSnackBar();
        dispatch(logOut());
        return;
      }

      switch (isCompanyCreated) {
        case true:
          // const userExists = await checkUserByEmail(email);
          const isManager = await getVisorUserRoleByEmail(email);

          if (isManager) {
            dispatch(logIn({ email, password }));
          } else if (!isManager) {
            setSnackMessage("Giriş için yetkili değilsiniz!");
            handleOpenSnackBar();
          } else {
            setSnackMessage("Bu kimlikte kayıtlı kullanıcı bulunmamaktadır!");
            handleOpenSnackBar();
          }
          break;

        case false:
          setSnackMessage("Girdiğiniz hesapla ilgili bir Firma bulunamamaktadır. Kayıt Olunuz.");
          handleOpenSnackBar();
          dispatch(logOut());
          break;

        default:
          break;
      }
    } catch (error) {
      console.error('Error Sign In 45:', error);
      handleOpenSnackBar();
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  const handleOpenSnackBar = () => {
    setOpenSnackbar(true);
  }

  return (
    <div
      style={{
        backgroundColor: '#fff',
        borderRadius: '20px',
        padding: '5% 5%',
        height: '100vh',
        display: 'flex',
        flexDirection: windowScreenWidth < 960 ? 'column' : 'row',
        gap: windowScreenWidth < 960 ? '0px' : '50px',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={4000}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        sx={{

          '& .MuiSnackbarContent-root': {
            minWidth: '300px',
          },
        }}
        onClose={handleCloseSnackbar}
      >
        <MuiAlert onClose={handleCloseSnackbar} severity="error">
          {snackMessage}
        </MuiAlert>
      </Snackbar>

      <div style={{
        width: windowScreenWidth < 960 ? '100%' : '70%',
        minHeight: 500,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography variant='h4' sx={{
            color: "#FF9843",
            textAlign: 'center'
          }}>Denetim için giriş yapınız</Typography>
        </div>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            margin='normal'
            label="E-Posta"
            required
            autoComplete='email'
            autoFocus
            value={email}
            onChange={handleEmailChange}
            sx={{
              color: "#86A7FC",
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#86A7FC',
                  borderRadius: '50px',
                },
              },
            }}
          />
          <TextField
            fullWidth
            margin='normal'
            label="Parola"
            type={showPassword ? 'text' : 'password'}
            required
            value={password}
            onChange={handlePasswordChange}
            sx={{
              color: "#86A7FC",
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#86A7FC',
                  borderRadius: '50px',
                },
              },
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleTogglePasswordVisibility}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Button
              type='submit'
              variant='contained'
              disabled={isLoading}
              sx={{
                mt: 2,
                mb: 2,
                width: 250,
                height: 40,
                textAlign: "center",
                bgcolor: "rgba(255, 152, 67, 0.9)",
                color: "#fff",
                borderRadius: '50px',
                fontFamily: 'Arial, Helvatica, sans-serif',
                fontSize: '14px',
                cursor: 'pointer',
                textTransform: 'inherit',
                '&:disabled': {
                  opacity: '0.5',
                  cursor: 'not-allowed'
                },
                '&:hover': {
                  bgcolor: "#FF9843",
                  color: "#ffffff",
                  boxShadow: "0px 0 10px rgba(52, 104, 192, 0.7)",
                }
              }}>
              {isLoading ? "Yükleniyor" : "Giriş yap"}
            </Button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <Typography>
              <Link color="#FF9843" fontWeight='600' underline="hover" href="../visorRegister">Yeni hesap oluştur</Link>
            </Typography>

            {/* <Typography>
              <Link color="#FF9843" fontWeight='600' underline="hover" href="../forgot-password">Parolamı unuttum?</Link>
            </Typography> */}
          </div>
        </form>
        <Button
          type="submit"
          variant="contained"
          onClick={() => navigate("/login")}
          sx={{
            mt: 0,
            mb: 2,
            width: 170,
            height: 30,
            textAlign: "center",
            bgcolor: "#fff",
            color: "rgba(255, 152, 67, 0.9)",
            borderRadius: "50px",
            fontFamily: "Arial, Helvatica, sans-serif",
            fontSize: "14px",
            cursor: "pointer",
            textTransform: "inherit",

            "&:disabled": {
              opacity: "0.5",
              cursor: "not-allowed",
            },
            "&:hover": {
              bgcolor: "#FFFFFF",
              color: "rgba(255, 152, 67, 0.9)",
              boxShadow: "0px 0 10px rgba(52, 104, 192, 0.3)",
            },
          }}
        >
          Firma Girişi
        </Button>
      </div>

      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '70%',
        height:"auto",
        minHeight: 300,
      }}>
        <img src={LoginImage} alt="login" style={{ width: '100%', height: 'auto', maxHeight: 600, objectFit: 'contain' }} />
      </div>
    </div>
  )
}
