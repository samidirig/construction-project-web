import React, { useEffect, useState } from "react";
import "./viewModalStyle.scss";
import { orangeButtonContent } from "../../style/utils";
import { Button, CircularProgress, Stack, Typography } from "@mui/material";
import { getGivenWorksitesInformationByIds } from "../../config/firebase";
import ViewWorksitesTable from "../table/worksites_table/ViewWorksitesTable";

export default function ViewProjectWorksites({
  isOpen,
  onClose,
  viewSelectedProject,
}) {
  const [worksiteData, setWorksiteData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      getGivenWorksitesInformationByIds(viewSelectedProject.worksites, (worksites) => {
        setWorksiteData(worksites || []);
        setLoading(false);
      });
    };

    if (isOpen) {
      fetchData();
    }
  }, [isOpen, viewSelectedProject.worksites]);

  console.log(worksiteData);

  return (
    <div className="view-modal-overlay">
      <div className="view-modal-content">
        <div className="view-modal-subcontent">
          {loading ? (
            <Stack
              sx={{
                width: "100%",
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
              }}
            >
              <CircularProgress size={50} />
            </Stack>
          ) : (
            <Stack
              sx={{
                position: "relative",
                alignItems: "center",
              }}
            >
              {worksiteData.length > 0 ? (
                <ViewWorksitesTable worksites={worksiteData} />
              ) : (
                <Typography marginTop={10}>
                  Şantiyenize ait personel bulunmamaktadır.
                </Typography>
              )}
            </Stack>
          )}
        </div>
        {/* close button */}
        <div className="view-modal-button-group">
          <Button
            variant="contained"
            onClick={onClose}
            sx={orangeButtonContent}
          >
            Kapat
          </Button>
        </div>
      </div>
    </div>
  );
}
