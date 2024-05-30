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
  createNewShift,
  getCompanyWorksites,
  getGivenUsersInformationByIds,
  getWorksiteTeams,
} from "../../config/firebase";
import { Timestamp } from "firebase/firestore";

export default function CreateShiftModal({ isOpen, onClose }) {
  const [worksitesData, setWorksitesData] = useState([]);
  const [worksiteTeams, setWorksiteTeams] = useState([]);
  const [worksitePersonnels, setWorksitePersonnels] = useState([]);
  const [selectedPersonnels, setSelectedPersonnels] = useState([]);
  const [selectedWorksite, setSelectedWorksite] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedFinishDate, setSelectedFinishDate] = useState(null);
  const [openNegativeSnackbar, setOpenNegativeSnackbar] = useState(false);
  const [openPositiveSnackBar, setOpenPositiveSnackbar] = useState(false);
  const [snackPositiveMessage, setSnackPositiveMessage] = useState("");
  const [snackNegativeMessage, setSnackNegativeMessage] = useState("");

  // useEffect(() => {
  //   async function fetchData() {
  //     try {
  //       const worksites = await getCompanyWorksites();
  //       setWorksitesData(worksites || []);
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
          const worksiteTeams = await getWorksiteTeams(selectedWorksite.id);
          setWorksiteTeams(worksiteTeams);
        }
      } catch (error) {
        console.error("Error fetching worksites:", error);
      }
    }

    fetchData();
  }, [selectedWorksite]);

  useEffect(() => {
    async function fetchData() {
      try {
        if (selectedTeam) {
          const personnels = await getGivenUsersInformationByIds(
            selectedTeam.personnels
          );
          setWorksitePersonnels(personnels);
        }
      } catch (error) {
        console.error("Error fetching worksites:", error);
      }
    }

    fetchData();
  }, [selectedTeam]);

  const handleSelectChange = (event, value) => {
    if (Array.isArray(value) && value.length > 0) {
      const selectedUserIds = value.map((user) => user.userId);
      setSelectedPersonnels(selectedUserIds);
    } else {
      setSelectedPersonnels([]);
    }
  };

  const handleStartDateChange = (event) => {
    setSelectedStartDate(new Date(event.target.value));
  };

  const handleFinishDateChange = (event) => {
    setSelectedFinishDate(new Date(event.target.value));
  };

  const handleCreateNewShift = async () => {
    try {
      if (
        selectedWorksite &&
        selectedStartDate &&
        selectedFinishDate &&
        selectedPersonnels &&
        selectedPersonnels.length > 0
      ) {
        const startDate = Timestamp.fromDate(selectedStartDate);
        const finishDate = Timestamp.fromDate(selectedFinishDate);

        const shiftData = {
          createdTime: new Date(),
          finishTime: finishDate,
          isFinished: false,
          startTime: startDate,
          userFinishTime: null,
          selectedUsers:
            selectedPersonnels.length > 0 ? selectedPersonnels : [],
          worksiteId: selectedWorksite ? selectedWorksite.id : null,
        };

        await createNewShift(shiftData);
        setSnackPositiveMessage("Yeni vardiyanız eklendi.");
        setOpenPositiveSnackbar(true);
        onClose();
      } else {
        setSnackNegativeMessage(
          "Vardiya eklerken hata oluştu. Girdiğiniz bilgileri kontrol ediniz!"
        );
        setOpenNegativeSnackbar(true);
      }
    } catch (error) {
      console.error("Error creating a new shift:", error);
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

  const shiftData = {
    createdTime: new Date(),
    finishTime: selectedFinishDate,
    isFinished: false,
    startTime: selectedStartDate,
    userFinishTime: null,
    selectedUsers: selectedPersonnels,
    worksiteId: selectedWorksite ? selectedWorksite.id : null,
  };

  console.log(shiftData);

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
              <InputLabel id="worksite-label">Vardiya Şantiyesi</InputLabel>
              <Select
                labelId="worksite-label"
                id="worksite"
                label="Vardiya Şantiyesi"
                value={selectedWorksite || "Seçiniz"}
                onChange={(event) => setSelectedWorksite(event.target.value)}
              >
                <MenuItem value="Seçiniz" disabled>
                  Seçiniz
                </MenuItem>
                {worksitesData.length === 0 ? (
                  <MenuItem disabled>
                    Şantiyenizde Takım olmadığı için vardiya oluşturamazsınız.
                  </MenuItem>
                ) : (
                  worksitesData.map((worksite) => (
                    <MenuItem key={worksite.id} value={worksite}>
                      {worksite.name}
                    </MenuItem>
                  ))
                )}
              </Select>
            </FormControl>
          </div>

          <div className="modal-input-content">
            <FormControl fullWidth>
              <InputLabel id="worksite-label">Vardiya Takımı</InputLabel>
              <Select
                labelId="worksite-label"
                id="worksite"
                label="Vardiya Şantiyesi"
                value={selectedTeam || "Seçiniz"}
                onChange={(event) => setSelectedTeam(event.target.value)}
              >
                <MenuItem value="Seçiniz" disabled>
                  Seçiniz
                </MenuItem>
                {selectedWorksite ? (
                  worksiteTeams.length === 0 ? (
                    <MenuItem disabled>
                      Şantiyenizde Takım olmadığı için vardiya oluşturamazsınız.
                    </MenuItem>
                  ) : (
                    worksiteTeams.map((team) => (
                      <MenuItem key={team.id} value={team}>
                        {team.name}
                      </MenuItem>
                    ))
                  )
                ) : (
                  <MenuItem disabled>Şantiye Seçiniz.</MenuItem>
                )}
              </Select>
            </FormControl>
          </div>

          {selectedTeam && (
            <>
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
                          : "Şantiyenizde Personel olmadığı için vardiya oluşturamazsınız"
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
              {/* shift start date */}
              <div className="modal-input-content">
                <TextField
                  label="Vardiya Başlangıç"
                  type="datetime-local"
                  value={
                    selectedStartDate
                      ? new Date(
                          selectedStartDate.getTime() -
                            selectedStartDate.getTimezoneOffset() * 60000
                        )
                          .toISOString()
                          .slice(0, 16)
                      : ""
                  }
                  fullWidth
                  required
                  margin="normal"
                  onChange={handleStartDateChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </div>
              {/* shift finish date */}
              <div className="modal-input-content">
                <TextField
                  label="Vardiya Bitiş"
                  type="datetime-local"
                  value={
                    selectedFinishDate
                      ? new Date(
                          selectedFinishDate.getTime() -
                            selectedFinishDate.getTimezoneOffset() * 60000
                        )
                          .toISOString()
                          .slice(0, 16)
                      : ""
                  }
                  fullWidth
                  required
                  margin="normal"
                  onChange={handleFinishDateChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
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
            onClick={handleCreateNewShift}
            sx={{
              ...buttonContent,
              width: "150px",
            }}
            disabled={
              !selectedWorksite ||
              !selectedStartDate ||
              !selectedFinishDate ||
              !selectedPersonnels ||
              !selectedPersonnels.length > 0 ||
              !worksitePersonnels.length > 0
            }
          >
            Vardiya Oluştur
          </Button>
        </div>
      </div>
    </div>
  );
}
