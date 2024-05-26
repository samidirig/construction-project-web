import React, { useEffect, useState } from "react";
import "./viewModalStyle.scss";
import { orangeButtonContent } from "../../style/utils";
import { Button, CircularProgress, Stack, Typography } from "@mui/material";
import {
  getGivenUsersInformationByIds,
  getWorksiteShifts,
} from "../../config/firebase";
import ViewPersonnelTable from "../table/personel_table/ViewPersonnelTable";

export default function ViewWorksitePersonnels({
  isOpen,
  onClose,
  viewSelectedWorksite,
}) {
  const [personnelData, setPersonnelData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        if (viewSelectedWorksite) {
          const personnels = await getGivenUsersInformationByIds(
            viewSelectedWorksite.personnels
          );
          setPersonnelData(personnels || []);
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [isOpen]);

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
              {personnelData.length > 0 ? (
                <ViewPersonnelTable
                  personnels={personnelData}
                  worksiteId={viewSelectedWorksite.id}
                />
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
