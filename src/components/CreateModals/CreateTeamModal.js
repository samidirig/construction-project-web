import React, { useEffect, useState } from "react";
import "./createModalStyle.scss";
import {
  Autocomplete,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { buttonContent, orangeButtonContent } from "../../style/utils";
import {
  createNewTeam,
  getCompanyIdByAuthUser,
  getCompanyWorksites,
  getGivenUsersInformationByIds,
} from "../../config/firebase";

export default function CreateTeamModal({ isOpen, onClose }) {
  const [worksitesData, setWorksitesData] = useState([]);
  const [companyId, setCompanyId] = useState(null);
  const [worksitePersonnels, setWorksitePersonnels] = useState([]);
  const [selectedName, setSelectedName] = useState(null);
  const [selectedPersonnels, setSelectedPersonnels] = useState([]);
  const [selectedWorksite, setSelectedWorksite] = useState(null);
  const [openNegativeSnackbar, setOpenNegativeSnackbar] = useState(false);
  const [openPositiveSnackBar, setOpenPositiveSnackbar] = useState(false);
  const [snackPositiveMessage, setSnackPositiveMessage] = useState("");
  const [snackNegativeMessage, setSnackNegativeMessage] = useState("");

  // useEffect(() => {
  //   async function fetchData() {
  //     try {
  //       const company = await getCompanyIdByAuthUser();
  //       setCompanyId(company);
  //     } catch (error) {
  //       console.error("Error fetching suppliers:", error);
  //     }
  //   }
  //   fetchData();
  // }, [isOpen]);

  useEffect(() => {
    const fetchData = () => {
      getCompanyWorksites((worksites) => {
        setWorksitesData(worksites || []);
      });
    };

    fetchData();
  }, [isOpen]);

  useEffect(() => {
    async function fetchData() {
      try {
        if (selectedWorksite) {
          const personnels = await getGivenUsersInformationByIds(
            selectedWorksite.personnels
          );
          setWorksitePersonnels(personnels);
        }
      } catch (error) {
        console.error("Error fetching worksites:", error);
      }
    }

    fetchData();
  }, [selectedWorksite]);

  const handleSelectChange = (event, value) => {
    if (Array.isArray(value) && value.length > 0) {
      const selectedUserIds = value.map((user) => user.userId);
      setSelectedPersonnels(selectedUserIds);
    } else {
      setSelectedPersonnels([]);
    }
  };

  const handleCreateNewTeam = async () => {
    try {
      if (
        companyId &&
        selectedWorksite &&
        selectedName &&
        selectedPersonnels &&
        selectedPersonnels.length > 0
      ) {
        const teamData = {
          companyId: companyId,
          createdTime: new Date(),
          personnels: selectedPersonnels.length > 0 ? selectedPersonnels : [],
          teamName: selectedName,
          worksiteId: selectedWorksite ? selectedWorksite.id : null,
        };

        await createNewTeam(teamData);
        setSnackPositiveMessage("Yeni takımınız eklendi.");
        setOpenPositiveSnackbar(true);
        onClose();
      } else {
        setSnackNegativeMessage(
          "Takım eklerken hata oluştu. Girdiğiniz bilgileri kontrol ediniz!"
        );
        setOpenNegativeSnackbar(true);
      }
    } catch (error) {
      console.error("Error creating a new team:", error);
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenNegativeSnackbar(false);
  };

  const handleClosePositiveSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenPositiveSnackbar(false);
  };

  const teamData = {
    companyId: companyId,
    createdTime: new Date(),
    personnels: selectedPersonnels,
    teamName: selectedName,
    worksiteId: selectedWorksite ? selectedWorksite.id : null,
  };

  console.log(teamData);

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {/* message bar negative */}
        <Snackbar
          open={openNegativeSnackbar}
          autoHideDuration={10000}
          anchorOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
          sx={{
            "& .MuiSnackbarContent-root": {
              marginTop: "100px",
              minWidth: "300px",
            },
          }}
          onClose={handleCloseSnackbar}
        >
          <MuiAlert onClose={handleCloseSnackbar} severity="error">
            {snackNegativeMessage}
          </MuiAlert>
        </Snackbar>

        {/* message bar positive*/}
        <Snackbar
          open={openPositiveSnackBar}
          autoHideDuration={7000}
          anchorOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
          sx={{
            "& .MuiSnackbarContent-root": {
              marginTop: "100px",
              minWidth: "500px",
            },
          }}
          onClose={handleClosePositiveSnackbar}
        >
          <MuiAlert onClose={handleClosePositiveSnackbar} severity="success">
            {snackPositiveMessage}
          </MuiAlert>
        </Snackbar>

        <div className="modal-input-group">
          <div className="modal-input-content">
            <FormControl fullWidth>
              <InputLabel id="worksite-label">Takım Şantiyesi</InputLabel>
              <Select
                labelId="worksite-label"
                id="worksite"
                label="Takım Şantiyesi"
                value={selectedWorksite || "Seçiniz"}
                onChange={(event) => setSelectedWorksite(event.target.value)}
              >
                <MenuItem value="Seçiniz" disabled>
                  Seçiniz
                </MenuItem>
                {worksitesData.length === 0 ? (
                      <MenuItem disabled>
                        Şantiyeniz yok Takım oluşturamazsınız!
                      </MenuItem>
                    ) : (
                      worksitesData &&
                      worksitesData.length > 0 &&
                      worksitesData.map((worksite) => (
                        <MenuItem key={worksite.id} value={worksite}>
                          {worksite.name}
                        </MenuItem>
                      ))
                    )}
              </Select>
            </FormControl>
          </div>

          {selectedWorksite && (
            <>
              {/* takım ismi */}
              <div className="modal-input-content">
                <TextField
                  id="name-detail"
                  label="Takım İsmi"
                  variant="outlined"
                  required
                  fullWidth
                  helperText="Maksimum 30 Karakter."
                  inputProps={{ maxLength: 30 }}
                  value={selectedName || ""}
                  onChange={(event) => setSelectedName(event.target.value)}
                />
              </div>
              {/* team personnels */}
              <div className="modal-input-content">
                <Autocomplete
                  multiple
                  id="personnels"
                  fullWidth
                  options={worksitePersonnels}
                  onChange={handleSelectChange}
                  getOptionLabel={(option) =>
                    `${option.userName} ${option.userSurname}`
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      label="Personeller"
                      placeholder={
                        worksitePersonnels.length > 0
                          ? "Personel Seçin"
                          : "Şantiyenize Personel ekleyiniz"
                      }
                      helperText={
                        worksitePersonnels.length > 0
                          ? ""
                          : "Şantiyenizde Personel olmadığı için takım oluşturamazsınız"
                      }
                    />
                  )}
                  value={
                    worksitePersonnels?.filter((personnel) =>
                      selectedPersonnels.includes(personnel.userId)
                    ) || []
                  }
                />
              </div>
            </>
          )}
        </div>

        <div className="modal-button-group">
          <Button
            variant="contained"
            onClick={onClose}
            sx={orangeButtonContent}
          >
            Kapat
          </Button>
          <Button
            variant="contained"
            onClick={handleCreateNewTeam}
            sx={{
              ...buttonContent,
              width: "150px",
            }}
            disabled={
              !companyId ||
              !selectedWorksite ||
              !selectedName ||
              !selectedPersonnels ||
              !selectedPersonnels.length > 0 ||
              !worksitePersonnels.length > 0
            }
          >
            Takım Oluştur
          </Button>
        </div>
      </div>
    </div>
  );
}
