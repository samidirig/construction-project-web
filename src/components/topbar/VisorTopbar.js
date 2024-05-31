import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Topbar.scss";
import { MdSpaceDashboard } from "react-icons/md";

import {
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { FaProjectDiagram } from "react-icons/fa";
import { IoConstructSharp } from "react-icons/io5";
import { RiTeamFill } from "react-icons/ri";
import { TbTruckDelivery } from "react-icons/tb";
import { IoDocuments } from "react-icons/io5";
import { CgProfile } from "react-icons/cg";

const VisorTopbar = () => {
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [drawerOpen, setDrawerOpen] = useState(false);

  const TopbarPages = [
    {
      display: "Ana Ekran",
      icon: <MdSpaceDashboard />,
      to: "/visorHome",
      section: "",
    },
    // {
    //   display: "Projeler",
    //   icon: <FaProjectDiagram  />,
    //   to: "/projects",
    //   // to: "/visors",
    //   section: "projects",
    // },
    {
      display: "Profile",
      icon: <CgProfile />,
      to: "/visorProfile",
      section: "profile",
    },
  ];

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setDrawerOpen(open);
  };

  return (
    <>
      <AppBar
        position="relative"
        style={{ background: "#ffffff", height: "60px" }}
      >
        <Toolbar>
          {isMobile ? (
            <>
              <IconButton
                edge="start"
                color="#FF9843"
                aria-label="menu"
                onClick={toggleDrawer(true)}
              >
                <MenuIcon />
              </IconButton>
              <Drawer
                anchor="left"
                open={drawerOpen}
                onClose={toggleDrawer(false)}
              >
                <List>
                  {TopbarPages.map((page, index) => (
                    <Link
                      key={index}
                      to={page.to}
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      <ListItem button onClick={toggleDrawer(false)}>
                        <ListItemIcon>{page.icon}</ListItemIcon>
                        <ListItemText primary={page.display} />
                      </ListItem>
                    </Link>
                  ))}
                </List>
              </Drawer>
              <Typography variant="h6" color={"#FF9843"} noWrap style={{ flexGrow: 1 }}>
                My Application
              </Typography>
            </>
          ) : (
            TopbarPages.map((page, index) => (
              <div key={index} style={{ display: "flex", marginLeft: 10 }}>
                <Link
                  to={page.to}
                  style={{
                    textDecoration: "none",
                    color: "#FF9843",
                    fontSize: "14px",
                    marginLeft: 20,
                    borderBottom:
                      page.to === location.pathname
                        ? "1px solid #FF9843"
                        : "none",
                    "&:hover": {
                      color: "yellow",
                      borderBottom: "1px solid #FF9843",
                    },
                  }}
                >
                  {page.display}
                </Link>
              </div>
            ))
          )}
        </Toolbar>
      </AppBar>
    </>
  );
};

export default VisorTopbar;
