import { React, useState } from "react";
import {
  TextField,
  Button,
  Link,
  Typography,
  InputAdornment,
  IconButton,
  Snackbar,
  Container,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import { Phone as PhoneIcon } from "@mui/icons-material";
import { useDispatch } from "react-redux";
import { register } from "../redux/authSlice";

import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import RegisterImage from "../assets/images/register_image_2.png";
import { useWindowSizeWidth } from "../config/hooks";
import { addCompanyWithUser } from "../config/firebase";

export default function SuperVisorRegister() {
  const [userName, setUserName] = useState("");
  const [userSurname, setUserSurname] = useState(""); // Added userSurname state
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [companyEmail, setCompanyEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [openErrorSnackbar, setOpenErrorSnackbar] = useState(false);
  const [errorSnackMessage, setErrorSnackMessage] = useState("");
  const windowScreenWidth = useWindowSizeWidth();
  const dispatch = useDispatch();

  const handleNameChange = (e) => {
    setUserName(e.currentTarget.value);
  };
  const handleSurnameChange = (e) => {
    setUserSurname(e.currentTarget.value);
  };
  const handleEmailChange = (e) => {
    setUserEmail(e.currentTarget.value);
  };
  const handlePasswordChange = (e) => {
    setUserPassword(e.currentTarget.value);
  };
  const handlePhoneNumberChange = (value) => {
    setPhoneNumber(value);
  };
  const handleCompanyName = (e) => {
    setCompanyName(e.currentTarget.value);
  };
  const handleCompanyEmail = (e) => {
    setCompanyEmail(e.currentTarget.value);
  };
  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const isValidEmail = (email) => {
    const emailRegex =
      /(?:[a-zA-Z0-9._%+-]+)@(?:icloud\.com|gmail\.com|hotmail\.com|outlook\.com)/;
    return emailRegex.test(email);
  };

  const handleCheckValidEmail = () => {
    const isEmailValid = isValidEmail(userEmail);
    const isCompanyEmailValid = isValidEmail(companyEmail);
    if (isEmailValid && isCompanyEmailValid) {
      handleRegisterUser();
    } else {
      setErrorSnackMessage(
        "Geçerli bir 'E-Posta' veya 'Firma E-Posta' giriniz."
      );
      handleOpenErrorSnackbar();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // const isEmailValid = isValidEmail(userEmail);
    // const isCompanyEmailValid = isValidEmail(companyEmail);
    // if (isEmailValid && isCompanyEmailValid) {
    //   dispatch(register({ userName, userSurname, userEmail, userPassword, companyName, companyEmail, phoneNumber }));
    // } else {
    //   setErrorSnackMessage("Geçerli bir 'E-Posta' veya 'Firma E-Posta' giriniz.");
    //   handleOpenErrorSnackbar();
    // }
  };

  const handleRegisterUser = async () => {
    if (
      !userName ||
      !userSurname ||
      !userEmail ||
      !userPassword ||
      !phoneNumber
    ) {
      alert("Please fill in all the required fields for user registration.");
      return;
    }
    try {
      //   const userData = {
      //     name: userName,
      //     surname: userSurname, // Save the surname in Firestore
      //     email: userEmail,
      //     password: userPassword,
      //   };
      //   const companyData = {
      //     email: companyEmail,
      //     name: companyName,
      //     managerEmail: userEmail,
      //     phone: phoneNumber,
      //   };
      //   const { payload: registeredUser } = await dispatch(register(userData));
      //   if (registeredUser) {
      //     await addCompanyWithUser(registeredUser, companyData);
      //   }
    } catch (error) {
      console.error("Error registering user: ", error);
      alert("An error occurred while registering the user. Please try again.");
    }
  };

  const handleCloseErrorSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenErrorSnackbar(false);
  };

  const handleOpenErrorSnackbar = () => {
    setOpenErrorSnackbar(true);
  };

  return (
    <div
      style={{
        backgroundColor: "#fff",
        borderRadius: "20px",
        padding: "5% 5%",
        height: "100vh",
        display: "flex",
        flexDirection: windowScreenWidth < 960 ? "column" : "row",
        gap: windowScreenWidth < 960 ? "0px" : "50px",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Snackbar
        open={openErrorSnackbar}
        autoHideDuration={4000}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        sx={{
          "& .MuiSnackbarContent-root": {
            minWidth: "300px",
          },
        }}
        onClose={handleCloseErrorSnackbar}
      >
        <MuiAlert onClose={handleCloseErrorSnackbar} severity="error">
          {errorSnackMessage}
        </MuiAlert>
      </Snackbar>
      <div
        style={{
          width: windowScreenWidth < 960 ? "100%" : "70%",
          minHeight: 500,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <form onSubmit={handleSubmit}>
          <Container maxWidth="xs" sx={{ mt: 2 }}>
            <div>
              <Typography
                variant="h4"
                sx={{
                  color: "#FF9843",
                  textAlign: "center",
                }}
              >
                Denetmen hesabınızı oluşturun ve kayıt olun
              </Typography>
            </div>
            <TextField
              fullWidth
              margin="normal"
              label="İsim"
              required
              autoComplete="name"
              autoFocus
              value={userName}
              onChange={handleNameChange}
              sx={{
                color: "#86A7FC",
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "#86A7FC",
                    borderRadius: "35px",
                  },
                },
              }}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Soyisim"
              required
              autoComplete="surname"
              autoFocus
              value={userSurname}
              onChange={handleSurnameChange}
              sx={{
                color: "#86A7FC",
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "#86A7FC",
                    borderRadius: "35px",
                  },
                },
              }}
            />
            <TextField
              fullWidth
              margin="normal"
              label="E-Posta"
              required
              autoComplete="email"
              value={userEmail}
              onChange={handleEmailChange}
              sx={{
                color: "#86A7FC",
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "#86A7FC",
                    borderRadius: "35px",
                  },
                },
              }}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Parola"
              type={showPassword ? "text" : "password"}
              required
              value={userPassword}
              onChange={handlePasswordChange}
              sx={{
                color: "#86A7FC",
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "#86A7FC",
                    borderRadius: "35px",
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
                      {showPassword ? (
                        <VisibilityOffIcon />
                      ) : (
                        <VisibilityIcon />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              required
              margin="normal"
              label="Telefon Numarası"
              helperText="Ör: 5121231213"
              value={phoneNumber}
              sx={{
                color: "#86A7FC",
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "#86A7FC",
                    borderRadius: "35px",
                  },
                },
              }}
              onChange={(e) => {
                let newValue = e.target.value.replace(/\D/g, ""); // Sadece rakam karakterlerini alır
                if (newValue.startsWith("90")) {
                  newValue = newValue.slice(0, 12); // "90" ile başlıyorsa, 12 karakter kabul eder
                } else {
                  newValue = newValue.slice(0, 10); // "90" ile başlamıyorsa, 10 karakter kabul eder
                }
                handlePhoneNumberChange(newValue);
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PhoneIcon />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Denetmen Firma E-Posta"
              required
              autoComplete="companyEmail"
              value={companyEmail}
              onChange={handleCompanyEmail}
              sx={{
                color: "#86A7FC",
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "#86A7FC",
                    borderRadius: "35px",
                  },
                },
              }}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Denetmen Firma İsmi"
              required
              autoComplete="companyName"
              value={companyName}
              onChange={handleCompanyName}
              sx={{
                color: "#86A7FC",
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "#86A7FC",
                    borderRadius: "35px",
                  },
                },
              }}
            />

            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "center",
                marginTop: 25,
              }}
            >
              <Button
                type="submit"
                variant="contained"
                onClick={handleCheckValidEmail}
                sx={{
                  mb: 4,
                  width: 250,
                  height: 40,
                  textAlign: "center",
                  bgcolor: "rgba(255, 152, 67, 0.9)",
                  color: "#fff",
                  borderRadius: "50px",
                  fontFamily: "Arial, Helvatica, sans-serif",
                  fontSize: "16px",
                  cursor: "pointer",
                  textTransform: "inherit",

                  "&:disabled": {
                    opacity: "0.5",
                    cursor: "not-allowed",
                  },
                  "&:hover": {
                    bgcolor: "#FF9843",
                    color: "#ffffff",
                    boxShadow: "0px 0 10px rgba(52, 104, 192, 0.7)",
                  },
                }}
              >
                Kayıt Ol
              </Button>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography>
                <Link
                  color="#FF9843"
                  fontWeight="600"
                  underline="hover"
                  href="../login"
                >
                  Giriş yapın.
                </Link>
              </Typography>
            </div>
          </Container>
        </form>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "70%",
          height: "auto",
          minHeight: 300,
        }}
      >
        <img
          src={RegisterImage}
          alt="login"
          style={{
            width: "100%",
            height: "100%",
            maxHeight: 500,
            borderRadius: "20px",
            objectFit: "contain",
          }}
        />
      </div>
    </div>
  );
}
