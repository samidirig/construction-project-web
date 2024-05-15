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
} from "@mui/material";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { buttonContent, orangeButtonContent } from "../../style/utils";
import {
  createNewDelivery,
  getCompanyByManagerId,
  getCompanyWorksites,
  getSupplierCompanies,
  getSupplierVehicles,
} from "../../config/firebase";
import { Timestamp } from "firebase/firestore";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

export default function CreateDeliveryModal({ isOpen, onClose }) {
  const [companyData, setCompanyData] = useState([]);
  const [supplierCompanies, setSupplierCompanies] = useState([]);
  const [supplierMaterials, setSupplierMaterials] = useState([]);
  const [supplierVehicles, setSupplierVehicles] = useState([]);
  const [worksitesData, setWorksitesData] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [selectedWorksite, setSelectedWorksite] = useState(null);
  const [selectedDeliveryDetail, setSelectedDeliveryDetail] = useState(null);
  const [selectedDeliveryDate, setSelectedDeliveryDate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingContent, setLoadingContent] = useState(true);
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);
  const [openNegativeSnackbar, setOpenNegativeSnackbar] = useState(false);
  const [openPositiveSnackBar, setOpenPositiveSnackbar] = useState(false);
  const [snackPositiveMessage, setSnackPositiveMessage] = useState("");
  const [snackNegativeMessage, setSnackNegativeMessage] = useState("");

  useEffect(() => {
    async function fetchData() {
      const company = await getCompanyByManagerId();
      setCompanyData(company);

      try {
        const suppliers = await getSupplierCompanies();
        setSupplierCompanies(suppliers || []);
      } catch (error) {
        console.error("Error fetching suppliers:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [isOpen]);

  useEffect(() => {
    async function fetchData() {
      try {
        if (selectedSupplier) {
          const vehicles = await getSupplierVehicles(selectedSupplier.id);
          setSupplierVehicles(vehicles || []);

          const worksites = await getCompanyWorksites();
          setWorksitesData(worksites || []);
        }
      } catch (error) {
        console.error("Error fetching materials or vehicles:", error);
      } finally {
        setLoadingContent(false);
      }
    }
    fetchData();
  }, [selectedSupplier]);

  useEffect(() => {
    if (selectedSupplier) {
      setSupplierMaterials(selectedSupplier.materials || []);
    }
  }, [selectedSupplier]);

  const handleDateChange = (date) => {
    // const timestamp = Timestamp.fromDate(date);
    setSelectedDeliveryDate(date);
  };

  const toggleCalendarVisibility = () => {
    setIsCalendarVisible((prev) => !prev);
  };

  const handleCreateNewDelivery = async () => {
    try {
      if (selectedSupplier && selectedVehicle && selectedWorksite) {
        const deliveryDate = Timestamp.fromDate(selectedDeliveryDate);

        const deliveryData = {
          createdTime: Timestamp.fromDate(new Date()),
          deliveryTime: deliveryDate,
          description: selectedDeliveryDetail,
          finishTime: null,
          isDone: false,
          receiverId: companyData.id,
          receiverLoc: selectedWorksite.geopoint,
          receiverName: companyData.name,
          supplierLoc: selectedSupplier.location,
          supplierName: selectedSupplier.name,
          userId: selectedVehicle.driverId,
          vehicleId: selectedVehicle.id,
        };

        await createNewDelivery(deliveryData);
        setSnackPositiveMessage("Yeni siparişiniz oluşturuldu.");
        setOpenPositiveSnackbar(true);
        onClose();
      } else {
        setSnackNegativeMessage(
          "Sipariş verirken hata oluştu. Tedarikçi, Teslimat Aracı ve Teslimat Noktası kontrollerini gerçekleştiriniz!"
        );
        setOpenNegativeSnackbar(true);
      }
    } catch (error) {
      console.error("Error creating a new delivery:", error);
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
        <div className="modal-input-group">
          <div className="modal-input-content">
            <FormControl fullWidth>
              <InputLabel id="supplier-label">Tedarikçi Firma</InputLabel>
              <Select
                labelId="supplier-label"
                id="supplier"
                label="Tedarikçi Firma"
                value={selectedSupplier || "Seçiniz"}
                onChange={(event) => setSelectedSupplier(event.target.value)}
              >
                <MenuItem value="Seçiniz" disabled>
                  Seçiniz
                </MenuItem>
                {supplierCompanies.length > 0 &&
                  supplierCompanies.map((supplier) => (
                    <MenuItem key={supplier.id} value={supplier}>
                      {supplier.name}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </div>

          {selectedSupplier && (
            <>
              {/* delivery material */}
              <div className="modal-input-content">
                <FormControl fullWidth>
                  <InputLabel id="material-label">Malzemeler</InputLabel>
                  <Select
                    labelId="material-label"
                    id="material"
                    label="Malzemeler"
                    value={selectedMaterial || "Seçiniz"}
                    onChange={(event) =>
                      setSelectedMaterial(event.target.value)
                    }
                  >
                    <MenuItem value="Seçiniz" disabled>
                      Seçiniz
                    </MenuItem>
                    {supplierMaterials.length > 0 &&
                      supplierMaterials.map((material, index) => (
                        <MenuItem key={index} value={material}>
                          {material}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </div>
              {/* delivery vehicle */}
              <div className="modal-input-content">
                <FormControl fullWidth>
                  <InputLabel id="vehicle-label">Teslimat Aracı</InputLabel>
                  <Select
                    labelId="vehicle-label"
                    id="vehicle"
                    label="Teslimat Aracı"
                    value={selectedVehicle || "Seçiniz"}
                    onChange={(event) => setSelectedVehicle(event.target.value)}
                  >
                    <MenuItem value="Seçiniz" disabled>
                      Seçiniz
                    </MenuItem>
                    {supplierVehicles.length === 0 ? (
                      <MenuItem disabled>
                        Araç Yok Sipariş Veremezsiniz!
                      </MenuItem>
                    ) : (
                      supplierVehicles.map((vehicle, index) => (
                        <MenuItem key={index} value={vehicle}>
                          {`${vehicle.plate} - ${vehicle.brand} - ${vehicle.name}`}
                        </MenuItem>
                      ))
                    )}
                  </Select>
                </FormControl>
              </div>
              {/* receiver location */}
              <div className="modal-input-content">
                <FormControl fullWidth>
                  <InputLabel id="receiver-label">Teslimat Noktası</InputLabel>
                  <Select
                    labelId="receiver-label"
                    id="receiver"
                    label="Teslimat Noktası"
                    value={selectedWorksite || "Seçiniz"}
                    onChange={(event) =>
                      setSelectedWorksite(event.target.value)
                    }
                  >
                    <MenuItem value="Seçiniz" disabled>
                      Seçiniz
                    </MenuItem>
                    {worksitesData.length === 0 ? (
                      <MenuItem disabled>
                        Teslimat Noktanız Yok Sipariş Veremezsiniz!
                      </MenuItem>
                    ) : (
                      worksitesData.map((worksite, index) => (
                        <MenuItem key={index} value={worksite}>
                          {`${worksite.name} - ${worksite.neighborhood}`}
                        </MenuItem>
                      ))
                    )}
                  </Select>
                </FormControl>
              </div>
              {/* delivery detail */}
              <div className="modal-input-content">
                <TextField
                  id="delivery-detail"
                  label="Sipariş Detay"
                  variant="outlined"
                  required
                  fullWidth
                  inputProps={{ maxLength: 150 }} // Maksimum giriş uzunluğu 150 karakter
                  value={selectedDeliveryDetail || ""} // Değer deliveryDetail state'inden gelir
                  onChange={(event) =>
                    setSelectedDeliveryDetail(event.target.value)
                  } // Değişen değeri deliveryDetail state'ine ata
                />
              </div>
              {/* delivery date */}
              <div className="modal-input-content">
                <TextField
                  label="Teslimat Tarihi"
                  value={
                    selectedDeliveryDate
                      ? selectedDeliveryDate.toLocaleDateString("tr-TR", {
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
                      <IconButton onClick={toggleCalendarVisibility}>
                        <CalendarMonthIcon
                          sx={{ color: "rgba(255, 152, 67, 0.9)" }}
                        />
                      </IconButton>
                    ),
                  }}
                />
                {isCalendarVisible && (
                  <>
                    <Calendar
                      sx={{ color: "rgba(255, 152, 67, 0.9)" }}
                      onChange={handleDateChange}
                      value={selectedDeliveryDate}
                    />
                    <Button
                      sx={{ ...buttonContent, width: "auto", height: "auto" }}
                      onClick={toggleCalendarVisibility}
                    >
                      Takvimi Kapat
                    </Button>
                  </>
                )}
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
            onClick={handleCreateNewDelivery}
            sx={{
              ...buttonContent,
              width: "150px",
            }}
            disabled={
              !selectedSupplier ||
              !selectedVehicle ||
              !selectedMaterial ||
              !selectedWorksite ||
              !selectedDeliveryDate
            }
          >
            Sipariş Oluştur
          </Button>
        </div>
      </div>
    </div>
  );
}
