import { useState, useEffect } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useIsLoggedIn } from "../config/hooks";
import Topbar from '../components/topbar/Topbar';
import { getCompanyIdByAuthUser } from '../config/firebase';

export default function Layout() {

    const isLoggedIn = useIsLoggedIn();
    const [screenWidth, setScreenWidth] = useState(window.innerWidth);
    const [companyId, setCompanyId] = useState(null);
    useEffect(() => {
        const handleResize = () => {
            setScreenWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [screenWidth]);

    useEffect(() => {
        const saveCompanyIdToLocal = async () => {
            try {
                const companyId = await getCompanyIdByAuthUser();
                localStorage.setItem('companyId', companyId);
                setCompanyId(companyId);
            } catch (error) {
                console.error('Error saving companyId to localStorage:', error);
            }
        };

        saveCompanyIdToLocal();

    }, [companyId]);

    let newPadding = 0;
    if (screenWidth > 850) { newPadding = 80; } else { newPadding = 80; }


    if (isLoggedIn === null) return;
    else if (isLoggedIn === false) return <Navigate replace to="/login" />;
    return (
        <div style={{ display: 'flex', flexDirection: 'column', marginTop: '0px' }}>
            <div style={{ zIndex: 34 }}>
                <Topbar name={"companyName"} />
            </div>
            <div style={{ padding: '1%', height: 'calc(100vh - 60px)', width: '100%' }}>
                <Outlet />
            </div>
        </div>
    );
}