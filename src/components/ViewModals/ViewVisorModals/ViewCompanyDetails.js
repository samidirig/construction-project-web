import React, { useState } from "react";
import "../viewModalStyle.scss";
import { orangeButtonContent } from "../../../style/utils";
import {
  Button,
  Typography,
  Box,
} from "@mui/material";
import Image1 from "../../../assets/images/project_background.PNG";
import { useWindowSizeWidth } from "../../../config/hooks";

export default function ViewCompanyDetails({
  isOpen,
  onClose,
  viewSelectedCompany,
}) {
  const windowScreenWidth = useWindowSizeWidth();
  const [companyData, setCompanyData] = useState(viewSelectedCompany);


  if (!isOpen) return null;
  return (
    <div className="view-modal-overlay">
      <div className="view-modal-content">
        <div
          className="view-modal-image"
          style={{
            flexDirection: windowScreenWidth < 900 ? "column" : "row",
          }}
        >
          <div className="view-modal-image-content">
            <img
              src={companyData.projectImage || Image1}
              alt="Project"
              className="view-modal-image-self"
            />
          </div>

          <div className="view-modal-subcontent">
            <Typography variant="h5" component="h2" sx={{ mt: 2 }}>
              <strong>{companyData.name}</strong>
            </Typography>

            <Box sx={{ mb: 2 }}>
              <Typography variant="body1">
                <strong>Firma E-Posta:</strong> {companyData.email}
              </Typography>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="body1">
                <strong>Firma Telefon:</strong> {companyData.phone}
              </Typography>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="body1">
                <strong>Manager E-Posta:</strong> {companyData.managerEmail}
              </Typography>
            </Box>
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="body1">
                <strong>Manager İsmi:</strong> {companyData.managerEmail}
              </Typography>
            </Box>
          </div>

          <div className="view-modal-button-group">
            <Button
              variant="contained"
              sx={{
                ...orangeButtonContent,
                bgcolor: "rgba(134, 167, 252, 0.9)",
                "&:hover": {
                  bgcolor: "rgba(134, 167, 252, 0.7)",
                  color: "#ffffff",
                  boxShadow: "0px 0 10px rgba(52, 104, 192, 0.7)",
                },
              }}
              onClick={onClose}
            >
              Kapat
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
