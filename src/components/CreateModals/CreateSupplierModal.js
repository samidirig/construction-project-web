import React, { useState, useCallback, useRef, useEffect } from "react";
import { GoogleMap, useLoadScript, MarkerF } from "@react-google-maps/api";
import "./createModalStyle.scss";
import mapStyle from "../map/mapStyle";
import { Autocomplete, Button, InputAdornment, TextField } from "@mui/material";
import { Phone as PhoneIcon } from "@mui/icons-material";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import {
  buttonContent,
  orangeButtonContent,
  clickButtonWhite,
} from "../../style/utils";
import {
  createGeoPoint,
  createNewSupplier,
  getCompanyByManagerId,
} from "../../config/firebase";

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

export default function CreateSupplierModal({ isOpen, onClose }) {
  const [companyData, setCompanyData] = useState([]);
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedName, setSelectedName] = useState(null);
  const [selectedPhone, setSelectedPhone] = useState(null);
  const [openNegativeSnackbar, setOpenNegativeSnackbar] = useState(false);
  const [openPositiveSnackBar, setOpenPositiveSnackbar] = useState(false);
  const [snackPositiveMessage, setSnackPositiveMessage] = useState("");
  const [snackNegativeMessage, setSnackNegativeMessage] = useState("");

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
        const company = await getCompanyByManagerId();
        setCompanyData(company);
      } catch (error) {
        console.error("Error fetching suppliers:", error);
      }
    }
    fetchData();
  }, [isOpen]);

  const handleCreateNewSupplier = async () => {
    try {
      if (
        selectedMaterials &&
        selectedLocation &&
        selectedName &&
        selectedPhone
      ) {
        let phone = selectedPhone;
        if (phone && !phone.startsWith("90")) {
          setSelectedPhone(`90${phone}`);
        }
        const supplierData = {
          location: createGeoPoint(selectedLocation.lat, selectedLocation.lng),
          materials: selectedMaterials,
          name: selectedName,
          phone: selectedPhone,
          receiverId: companyData ? companyData.id : null,
        };

        await createNewSupplier(supplierData);
        setSnackPositiveMessage("Yeni tedarikçiniz eklendi.");
        setOpenPositiveSnackbar(true);
        onClose();
      } else {
        setSnackNegativeMessage(
          "Tedarikçi eklerken hata oluştu. Girdiğiniz bilgileri kontrol ediniz!"
        );
        setOpenNegativeSnackbar(true);
      }
    } catch (error) {
      console.error("Error creating a new supplier:", error);
    }
  };

  const handleSelectChange = (event, value) => {
    setSelectedMaterials(value);
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

  const supplierData = {
    location: selectedLocation,
    materials: selectedMaterials,
    name: selectedName,
    phone: selectedPhone,
    receiverId: companyData ? companyData.id : null,
  };

  console.log(supplierData);

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

        <div className="modal-content-map">
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

        <div className="modal-input-group">
          {/* supplier materials */}
          <div className="modal-input-content">
            <Autocomplete
              multiple
              id="materials"
              fullWidth
              options={constructionMaterials}
              onChange={handleSelectChange}
              getOptionLabel={(option) => option}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  label="Malzemeler"
                  placeholder="Malzeme seçin"
                />
              )}
              value={selectedMaterials}
            />
          </div>
          {/* supplier name */}
          <div className="modal-input-content">
            <TextField
              id="name-detail"
              label="Tedarikçi İsmi"
              variant="outlined"
              required
              fullWidth
              inputProps={{ maxLength: 30 }}
              value={selectedName || ""}
              onChange={(event) => setSelectedName(event.target.value)}
            />
          </div>
          {/* supplier phone */}
          <div className="modal-input-content">
            <TextField
              label="Telefon Numarası"
              value={selectedPhone || ""}
              onChange={(e) => {
                let newValue = e.target.value.replace(/\D/g, ""); // Sadece rakam karakterlerini alır
                if (newValue.startsWith("90")) {
                  newValue = newValue.slice(0, 12); // "90" ile başlıyorsa, 12 karakter kabul eder
                } else {
                  newValue = newValue.slice(0, 10); // "90" ile başlamıyorsa, 10 karakter kabul eder
                }
                setSelectedPhone(newValue);
              }}
              fullWidth
              required
              margin="normal"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PhoneIcon />
                  </InputAdornment>
                ),
              }}
            />
          </div>
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
            onClick={handleCreateNewSupplier}
            sx={{
              ...buttonContent,
              width: "150px",
            }}
            disabled={
              !selectedMaterials ||
              !selectedLocation ||
              !selectedName ||
              !selectedPhone
            }
          >
            Tedarikçi Oluştur
          </Button>
        </div>
      </div>
    </div>
  );
}

const constructionMaterials = [
  "Beton",
  "Çimento",
  "Demir",
  "Tuğla",
  "Kiremit",
  "Alçı",
  "Boya",
  "Seramik",
  "Ahşap",
  "Kaplama Taşı",
  "Marley",
  "Asfalt",
  "Kum",
  "Çakıl",
  "Çimento Çakıl Karışımı",
  "Su Yalıtımı",
  "Elektrik Tesisatı",
  "Su Tesisatı",
  "Doğalgaz Tesisatı",
  "Fayans",
  "Cam",
  "PVC Boru",
  "Metal Boru",
  "Duvar Kağıdı",
  "Yalıtım Malzemesi",
  "Kaplama Malzemesi",
  "Çatı Malzemesi",
  "Döşeme Malzemesi",
  "Isıtma ve Soğutma Sistemleri",
];
