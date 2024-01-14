import React, { useEffect, useState } from "react";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { Outlet, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useIsLoggedIn } from "../config/hooks";

export default function AuthLayout() {

    const isLoggedIn = useIsLoggedIn();
    const error = useSelector((state) => state.auth.error);

    const [openSnackbar, setOpenSnackbar] = useState(false);

    useEffect(() => {
        if (error) {
            setOpenSnackbar(true);
        }
    }, [error]);

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackbar(false);
    };

    let errorMessage = "";

    switch (error) {
        case "auth/too-many-requests":
            errorMessage = "Çok fazla istek yapıldı. Lütfen daha sonra tekrar deneyin.";
            break;
        case "auth/user-not-found":
            errorMessage = "Kullanıcı bulunamadı.";
            break;
        case "auth/wrong-password":
            errorMessage = "Yanlış şifre girildi. Lütfen tekrar deneyin.";
            break;
        default:
            errorMessage = "Bir hata oluştu.";
    }

    if (isLoggedIn === null) return;
    else if (isLoggedIn === true) return <Navigate replace to="/" />;
    return (
        <div style={{
            padding: '5% 5%',
            backgroundColor:'#FFDD95',
            height:'100vh',
            display:'flex',
            flexDirection:'column',
            alignItems:'center',
            justifyContent:'center'
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
                    {errorMessage}
                </MuiAlert>
            </Snackbar>
            <Outlet />
        </div>
    )
}
