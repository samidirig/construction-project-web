import { useState, useEffect } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useVisorIsLoggedIn } from "../config/hooks";
import VisorTopbar from '../components/topbar/VisorTopbar';
import { getVisorCompanyIdByAuthUser } from '../config/firebase';

export default function VisorMainLayout() {

    const isVisorLoggedIn = useVisorIsLoggedIn();
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
                const companyId = await getVisorCompanyIdByAuthUser();
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


    if (isVisorLoggedIn === null) return null;
    else if (isVisorLoggedIn === false) return <Navigate replace to="/visorLogin" />;
    return (
        <div style={{ display: 'flex', flexDirection: 'column', marginTop: '0px' }}>
            <div style={{ zIndex: 34 }}>
                <VisorTopbar name={"companyName"} />
            </div>
            <div style={{ padding: '1%', height: 'calc(100vh - 60px)', width: '100%' }}>
                <Outlet />
            </div>
        </div>
    );
}