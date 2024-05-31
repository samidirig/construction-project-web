import React, { useState, useCallback, useRef, useEffect } from "react";
import { GoogleMap, useLoadScript, MarkerF } from "@react-google-maps/api";
import "./createModalStyle.scss";
import mapStyle from "../map/mapStyle";
import {
  Autocomplete,
  Button,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import {
  buttonContent,
  orangeButtonContent,
  clickButtonWhite,
} from "../../style/utils";
import {
  createGeoPoint,
  createNewWorksite,
  getCompanyProjects,
  getCompanyIdByAuthUser,
} from "../../config/firebase";
import { Timestamp } from "firebase/firestore";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { turkeyCities } from "../../assets/datas/data";

const mapContainerStyle = {
  width: "100%",
  height: "100%",
  borderRadius: "13px",
  //boxShadow: "0px 0px 10px rgba(1, 30, 48, 0.4)"
};

const center = {
  lat: 41.037419,
  lng: 28.951967,
};

const options = {
  styles: mapStyle,
  disableDefaultUI: true,
  zoomControl: true,
  mapTypeId: "roadmap",
};

export default function CreateWorksiteModal({ isOpen, onClose }) {
  const [projectsData, setProjectsData] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [companyId, setCompanyId] = useState([]);
  const [selectedName, setSelectedName] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedNeighborhood, setSelectedNeighborhood] = useState(null);
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedFinishDate, setSelectedFinishDate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isStartCalendarVisible, setIsStartCalendarVisible] = useState(false);
  const [isFinishCalendarVisible, setIsFinishCalendarVisible] = useState(false);
  const [openNegativeSnackbar, setOpenNegativeSnackbar] = useState(false);
  const [openPositiveSnackBar, setOpenPositiveSnackbar] = useState(false);
  const [snackPositiveMessage, setSnackPositiveMessage] = useState("");
  const [snackNegativeMessage, setSnackNegativeMessage] = useState("");

  // map settings
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  });
  const [markerVisible, setMarkerVisible] = useState(false);
  const [mapType, setMapType] = useState("roadmap");
  const mapRef = useRef(null);
  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);

  const onMapClick = (e) => {
    setSelectedLocation({ lat: e.latLng.lat(), lng: e.latLng.lng() });
    setMarkerVisible(true);
  };
  const handleMarkerClose = () => {
    setSelectedLocation(null);
    setMarkerVisible(false);
  };
  const handleMapTypeChange = () => {
    setMapType(mapType === "roadmap" ? "satellite" : "roadmap");
  };

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

  useEffect(() => {
    const fetchData = () => {
      getCompanyProjects((projects) => {
        setProjectsData(projects || []);
        setLoading(false);
      });
    };

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

  // modal functions
  const handleCreateNewWorksite = async () => {
    try {
      if (
        companyId &&
        selectedProject &&
        selectedLocation &&
        selectedName &&
        selectedStartDate &&
        selectedFinishDate &&
        selectedCity &&
        selectedDistrict &&
        selectedNeighborhood
      ) {
        const startDate = Timestamp.fromDate(selectedStartDate);
        const finishDate = Timestamp.fromDate(selectedFinishDate);

        const worksiteData = {
          city: selectedCity,
          companyId: companyId,
          createdTime: Timestamp.fromDate(new Date()),
          district: selectedDistrict,
          finishDate: finishDate,
          geopoint: createGeoPoint(selectedLocation.lat, selectedLocation.lng),
          name: selectedName,
          neighborhood: selectedNeighborhood,
          worksiteImage: "URL",
          personnels: [],
          projectId: selectedProject.id,
          startDate: startDate,
        };

        await createNewWorksite(worksiteData);
        setSnackPositiveMessage("Yeni şantiyeniz oluşturuldu.");
        setOpenPositiveSnackbar(true);
        onClose();
      } else {
        setSnackNegativeMessage(
          "Şantiye eklerken hata oluştu. Girdiğiniz bilgileri kontrol ediniz!"
        );
        setOpenNegativeSnackbar(true);
      }
    } catch (error) {
      console.error("Error creating a new worksite:", error);
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
        {/* worksite select map*/}
        <div className="modal-content-map" style={{ height: "350px" }}>
          {isLoaded ? (
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              zoom={12}
              center={center}
              options={options}
              onClick={onMapClick}
              onLoad={onMapLoad}
              mapTypeId={mapType}
            >
              {markerVisible && <MarkerF position={selectedLocation} />}
            </GoogleMap>
          ) : (
            <h4>Loading Maps</h4>
          )}
        </div>
        {/* worksite clean button*/}
        <div className="modal-button-group">
          <Button
            type="submit"
            variant="contained"
            onClick={handleMapTypeChange}
            sx={clickButtonWhite}
          >
            {mapType === "roadmap" ? "Uydu Görünümü" : "Normal Harita"}
          </Button>

          <Button onClick={handleMarkerClose} sx={clickButtonWhite}>
            {" "}
            İşaretçi Temizle{" "}
          </Button>
        </div>
        {/* worksite input content */}
        <div className="modal-input-group">
          {/* project name */}
          <div className="modal-input-content">
            <FormControl fullWidth>
              <InputLabel id="project-label">Projeler</InputLabel>
              <Select
                labelId="project-label"
                id="project"
                label="Projeler"
                value={selectedProject || "Seçiniz"}
                onChange={(event) => setSelectedProject(event.target.value)}
              >
                <MenuItem value="Seçiniz" disabled>
                  Seçiniz
                </MenuItem>
                {projectsData.length === 0 ? (
                  <MenuItem value="" disabled>
                    Bir projeniz bulunmamaktadır. Şantiye oluşturamazsınız
                  </MenuItem>
                ) : (
                  projectsData.map((project, index) => (
                    <MenuItem key={index} value={project}>
                      {project.name}
                    </MenuItem>
                  ))
                )}
              </Select>
            </FormControl>
          </div>
          {selectedProject && (
            <>
              {/* worksite name */}
              <div className="modal-input-content">
                <TextField
                  id="name-detail"
                  label="Şantiye İsmi"
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
                  <InputLabel id="city-label">İl</InputLabel>
                  <Select
                    labelId="city-label"
                    id="city"
                    label="İl"
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
              {/* worksite district */}
              <div className="modal-input-content">
                <TextField
                  id="district-detail"
                  label="İlçe"
                  variant="outlined"
                  required
                  fullWidth
                  inputProps={{ maxLength: 30 }}
                  value={selectedDistrict || ""}
                  onChange={(event) => setSelectedDistrict(event.target.value)}
                />
              </div>
              {/* worksite neighborhood */}
              <div className="modal-input-content">
                <TextField
                  id="neighborhood-detail"
                  label="Semt"
                  variant="outlined"
                  required
                  fullWidth
                  inputProps={{ maxLength: 30 }}
                  value={selectedNeighborhood || ""}
                  onChange={(event) =>
                    setSelectedNeighborhood(event.target.value)
                  }
                />
              </div>
              {/* worksite start date */}
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
              {/* worksite finish date */}
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
            </>
          )}
        </div>
        {/* worksite button group */}
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
            onClick={handleCreateNewWorksite}
            sx={{
              ...buttonContent,
              width: "150px",
            }}
            disabled={
              !selectedProject ||
              !selectedLocation ||
              !selectedName ||
              !selectedStartDate ||
              !selectedFinishDate ||
              !selectedCity ||
              !selectedDistrict ||
              !selectedNeighborhood
            }
          >
            Şantiye Oluştur
          </Button>
        </div>
      </div>
    </div>
  );
}
