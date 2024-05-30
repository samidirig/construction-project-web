import React, { useEffect, useState } from "react";
import "./viewModalStyle.scss";
import { orangeButtonContent } from "../../style/utils";
import {
  Button,
  CircularProgress,
  Stack,
  Typography,
  Modal,
  Box,
  TextField,
  Autocomplete,
} from "@mui/material";
import {
  getGivenUsersInformationByIds,
  getPersonnelNotOnWorksite,
  addPersonnelToWorksite,
} from "../../config/firebase";
import ViewPersonnelTable from "../table/personel_table/ViewPersonnelTable";

export default function ViewWorksitePersonnels({
  isOpen,
  onClose,
  viewSelectedWorksite,
}) {
  const [personnelData, setPersonnelData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openAddPersonnelModal, setOpenAddPersonnelModal] = useState(false);
  const [availablePersonnels, setAvailablePersonnels] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);

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
  }, [isOpen, openAddPersonnelModal]);

  const handleOpenAddPersonnelModal = async () => {
    try {
      const personnels = await getPersonnelNotOnWorksite(
        viewSelectedWorksite.id
      );
      setAvailablePersonnels(personnels || []);
      setOpenAddPersonnelModal(true);
    } catch (error) {
      console.error("Error fetching available personnels:", error);
    }
  };

  const handleCloseAddPersonnelModal = () => {
    setOpenAddPersonnelModal(false);
    setSelectedUsers([]);
  };

  const handleSelectChange = (event, value) => {
    setSelectedUsers(value.map((user) => user.userId));
  };

  const handleSaveAndAssign = async () => {
    await addPersonnelToWorksite(viewSelectedWorksite.id, selectedUsers);
    handleCloseAddPersonnelModal();
    onClose();
  };

  console.log(availablePersonnels);

  console.log(selectedUsers);
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
            onClick={handleOpenAddPersonnelModal}
            sx={orangeButtonContent}
          >
            Personel Ekle
          </Button>
          <Button
            variant="contained"
            onClick={onClose}
            sx={orangeButtonContent}
          >
            Kapat
          </Button>
        </div>
      </div>

      <Modal
        open={openAddPersonnelModal}
        onClose={handleCloseAddPersonnelModal}
        aria-labelledby="add-personnel-modal-title"
        aria-describedby="add-personnel-modal-description"
      >
        <Box
          className="modal-input-content"
          sx={{
            padding: "20px",
            backgroundColor: "white",
            borderRadius: "10px",
            width: "400px",
            margin: "auto",
            marginTop: "10%",
          }}
        >
          <Typography
            id="add-personnel-modal-title"
            variant="h6"
            component="h2"
          >
            Personel Ekle
          </Typography>
          <Autocomplete
            multiple
            id="available-personnels"
            fullWidth
            options={availablePersonnels}
            onChange={handleSelectChange}
            getOptionLabel={(option) => `${option.userName} ${option.userSurname}`}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                label="Personeller"
                placeholder="Personel seçin"
              />
            )}
          />
          <Button
            variant="contained"
            onClick={handleSaveAndAssign}
            sx={{ ...orangeButtonContent, marginTop: "10px" }}
          >
            Kaydet ve Ata
          </Button>
          <Button
            variant="contained"
            onClick={handleCloseAddPersonnelModal}
            sx={{ ...orangeButtonContent, marginTop: "10px" }}
          >
            İptal
          </Button>
        </Box>
      </Modal>
    </div>
  );
}
