import React, { useEffect, useState } from "react";
import "./viewModalStyle.scss";
import { orangeButtonContent } from "../../style/utils";
import { Button, CircularProgress, Stack, Typography } from "@mui/material";
import { getWorksiteShifts } from "../../config/firebase";
import ViewShiftTable from "../table/shifts_table/ViewShiftTable";

export default function ViewWorksiteShifts({
  isOpen,
  onClose,
  viewSelectedWorksite,
}) {
  const [shiftsData, setShiftsData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        if (viewSelectedWorksite) {
          const shifts = await getWorksiteShifts(viewSelectedWorksite.id);
          setShiftsData(shifts || []);
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [isOpen]);

  console.log(shiftsData);
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
              {shiftsData.length > 0 ? (
                <ViewShiftTable
                  shifts={shiftsData}
                  worksiteId={viewSelectedWorksite.id}
                />
              ) : (
                <Typography marginTop={10}>
                  Şantiyenize ait vardiya bulunmamaktadır.
                </Typography>
              )}
            </Stack>
          )}
        </div>

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
