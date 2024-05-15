import React, { useEffect, useState } from "react";
import "./modalStyle.scss";
import {
  Button,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  CircularProgress,
  OutlinedInput,
  InputAdornment,
} from "@mui/material";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { buttonContent, orangeButtonContent } from "../../style/utils";
import {
  createNewProject,
  getCompanyIdByAuthUser,
} from "../../config/firebase";
import { Timestamp } from "firebase/firestore";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { turkeyCities } from "../../assets/datas/data";

export default function CreateProjectModal({ isOpen, onClose }) {
  const [companyId, setCompanyId] = useState([]);
  const [selectedName, setSelectedName] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedBudget, setSelectedBudget] = useState(null);
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedFinishDate, setSelectedFinishDate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isStartCalendarVisible, setIsStartCalendarVisible] = useState(false);
  const [isFinishCalendarVisible, setIsFinishCalendarVisible] = useState(false);
  const [openNegativeSnackbar, setOpenNegativeSnackbar] = useState(false);
  const [openPositiveSnackBar, setOpenPositiveSnackbar] = useState(false);
  const [snackPositiveMessage, setSnackPositiveMessage] = useState("");
  const [snackNegativeMessage, setSnackNegativeMessage] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const company = await getCompanyIdByAuthUser();
        setCompanyId(company);
      } catch (error) {
        console.error("Error fetching companyData:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [isOpen]);

  const handleStartDateChange = (startDate) => {
    setSelectedStartDate(startDate);
  };

  const handleFinishDateChange = (finishDate) => {
    setSelectedFinishDate(finishDate);
  };

  const toggleStartCalendarVisibility = () => {
    setIsStartCalendarVisible((prev) => !prev);
  };

  const toggleFinishCalendarVisibility = () => {
    setIsFinishCalendarVisible((prev) => !prev);
  };

  const projectData = {
    budget: selectedBudget,
    city: selectedCity,
    companyId: companyId,
    createdTime: Timestamp.fromDate(new Date()),
    documents: [],
    finishDate: selectedFinishDate,
    name: selectedName,
    projectImage: "URL",
    startDate: selectedStartDate,
    worksites: [],
  };

  console.log(projectData);

  const handleCreateNewProject = async () => {
    try {
      if (
        companyId &&
        selectedName &&
        selectedCity &&
        selectedBudget &&
        selectedStartDate &&
        selectedFinishDate
      ) {
        const startDate = Timestamp.fromDate(selectedStartDate);
        const finishDate = Timestamp.fromDate(selectedFinishDate);

        const projectData = {
          budget: selectedBudget,
          city: selectedCity,
          companyId: companyId,
          createdTime: Timestamp.fromDate(new Date()),
          documents: [],
          finishDate: finishDate,
          name: selectedName,
          projectImage: "URL",
          startDate: startDate,
          worksites: [],
        };

        await createNewProject(projectData);
        setSnackPositiveMessage("Yeni projeniz oluşturuldu.");
        setOpenPositiveSnackbar(true);
        onClose();
      } else {
        setSnackNegativeMessage(
          "Proje oluşturulurken hata oluştu. Giriş bilgilerinin kontrollerini gerçekleştiriniz!"
        );
        setOpenNegativeSnackbar(true);
      }
    } catch (error) {
      console.error("Error creating a new project:", error);
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
        {/* modal input group */}
        <div className="modal-input-group">
          {/* project name */}
          <div className="modal-input-content">
            <TextField
              id="project-name"
              label="Proje İsmi"
              variant="outlined"
              required
              fullWidth
              inputProps={{ maxLength: 100 }}
              value={selectedName || ""}
              onChange={(event) => setSelectedName(event.target.value)}
            />
          </div>
          {/* project city */}
          <div className="modal-input-content">
            <FormControl fullWidth>
              <InputLabel id="city-label">Proje Şehri</InputLabel>
              <Select
                labelId="city-label"
                id="city"
                label="Proje Şehri"
                value={selectedCity || "Seçiniz"}
                onChange={(event) => setSelectedCity(event.target.value)}
              >
                <MenuItem value="Seçiniz" disabled>
                  Seçiniz
                </MenuItem>
                {turkeyCities.map((city, index) => (
                  <MenuItem key={index} value={city}>
                    {city}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          {/* project budget */}
          <div className="modal-input-content">
            <FormControl fullWidth>
              <InputLabel required htmlFor="outlined-adornment-amount">
                Bütçe
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-amount"
                startAdornment={
                  <InputAdornment position="start">₺</InputAdornment>
                }
                value={selectedBudget || ""}
                onChange={(event) =>
                  setSelectedBudget(
                    event.target.value.replace(/\D/, "").substring(0, 9)
                  )
                }
                inputProps={{ inputMode: "numeric", pattern: "[0-5]*" }}
                label="Bütçe"
              />
            </FormControl>
          </div>

          {/* project start date */}
          <div className="modal-input-content">
            <TextField
              label="Başlangıç Tarihi"
              value={
                selectedStartDate
                  ? selectedStartDate.toLocaleDateString("tr-TR", {
                      day: "numeric",
                      month: "numeric",
                      year: "numeric",
                    })
                  : ""
              }
              fullWidth
              required
              margin="normal"
              // disabled={!isEditMode}
              onChange={() => {}}
              InputProps={{
                startAdornment: (
                  <IconButton onClick={toggleStartCalendarVisibility}>
                    <CalendarMonthIcon
                      sx={{ color: "rgba(255, 152, 67, 0.9)" }}
                    />
                  </IconButton>
                ),
              }}
            />
            {isStartCalendarVisible && (
              <>
                <Calendar
                  sx={{ color: "rgba(255, 152, 67, 0.9)" }}
                  onChange={handleStartDateChange}
                  value={selectedStartDate}
                />
                <Button
                  sx={{ ...buttonContent, width: "auto", height: "auto" }}
                  onClick={toggleStartCalendarVisibility}
                >
                  Kapat
                </Button>
              </>
            )}
          </div>

          {/* project finish date */}
          <div className="modal-input-content">
            <TextField
              label="Bitiş Tarihi"
              value={
                selectedFinishDate
                  ? selectedFinishDate.toLocaleDateString("tr-TR", {
                      day: "numeric",
                      month: "numeric",
                      year: "numeric",
                    })
                  : ""
              }
              fullWidth
              required
              margin="normal"
              // disabled={!isEditMode}
              onChange={() => {}}
              InputProps={{
                startAdornment: (
                  <IconButton onClick={toggleFinishCalendarVisibility}>
                    <CalendarMonthIcon
                      sx={{ color: "rgba(255, 152, 67, 0.9)" }}
                    />
                  </IconButton>
                ),
              }}
            />
            {isFinishCalendarVisible && (
              <>
                <Calendar
                  sx={{ color: "rgba(255, 152, 67, 0.9)" }}
                  onChange={handleFinishDateChange}
                  value={selectedFinishDate}
                />
                <Button
                  sx={{ ...buttonContent, width: "auto", height: "auto" }}
                  onClick={toggleFinishCalendarVisibility}
                >
                  Kapat
                </Button>
              </>
            )}
          </div>
        </div>

        {/* modal button group */}
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
            onClick={handleCreateNewProject}
            sx={{
              ...buttonContent,
              width: "150px",
            }}
            disabled={
              !selectedName ||
              !selectedCity ||
              !selectedBudget ||
              !selectedStartDate ||
              !selectedFinishDate
            }
          >
            Proje Oluştur
          </Button>
        </div>
      </div>
    </div>
  );
}
