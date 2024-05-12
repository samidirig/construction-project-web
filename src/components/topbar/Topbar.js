import React from 'react'
import { Link, useLocation } from 'react-router-dom';
import './Topbar.scss';
import { RxDashboard } from "react-icons/rx";
import { IoPersonOutline } from "react-icons/io5";
import { ImBin } from "react-icons/im";
import { CgProfile } from "react-icons/cg";
import { FaTasks } from "react-icons/fa";
import {
    AppBar,
    Toolbar,
} from "@mui/material";
import { getCompanyNameById } from '../../config/firebase';

export default function Topbar() {
    const location = useLocation();

    const TopbarPages = [
        {
            display: 'Ana Ekran',
            icon: <RxDashboard />,
            to: '/',
            section: ''
        },
        {
            display: 'Projeler',
            icon: <FaTasks />,
            to: '/projects',
            section: 'projects'
        },
        {
            display: 'Şantiyeler',
            icon: <ImBin />,
            to: '/worksites',
            section: 'worksites'
        },
        {
            display: 'Personeller',
            icon: <IoPersonOutline />,
            to: '/personnels',
            section: 'personnels'
        },
        {
            display: 'Teslimatlar',
            icon: <IoPersonOutline />,
            to: '/deliveries',
            section: 'deliveries'
        },
        {
            display: 'Profile',
            icon: <CgProfile />,
            to: '/profile',
            section: 'profile'
        },
    ]

    return (
        <>
            <AppBar position="relative" style={{ background: '#ffffff', height: '60px' }}>
                <Toolbar>
                    {TopbarPages.map((page, index) => (
                        <div key={index} style={{ display: 'flex', marginLeft: 10 }}>
                            <Link to={page.to} style={{
                                textDecoration: "none",
                                color: "#FF9843",
                                fontSize: "14px",
                                marginLeft: 20,
                                borderBottom: page.to === location.pathname ? "1px solid #FF9843" : "none",
                                "&:hover": {
                                    color: "yellow",
                                    borderBottom: "1px solid #FF9843",
                                },
                            }}>
                                {page.display}
                            </Link>
                        </div>
                    ))}
                </Toolbar>
            </AppBar>
        </>
    )
}
