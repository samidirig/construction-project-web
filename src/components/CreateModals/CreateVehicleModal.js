import React, { useEffect, useState } from "react";
import "./createModalStyle.scss";
import {
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
  createNewVehicle,
  getCompanyFreeDrivers,
  getSupplierCompanies,
} from "../../config/firebase";

export default function CreateVehicleModal({ isOpen, onClose }) {
  const [driverData, setDriverData] = useState([]);
  const [supplierCompanies, setSupplierCompanies] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [selectedName, setSelectedName] = useState(null);
  const [selectedPlate, setSelectedPlate] = useState(null);
  const [openNegativeSnackbar, setOpenNegativeSnackbar] = useState(false);
  const [openPositiveSnackBar, setOpenPositiveSnackbar] = useState(false);
  const [snackPositiveMessage, setSnackPositiveMessage] = useState("");
  const [snackNegativeMessage, setSnackNegativeMessage] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const suppliers = await getSupplierCompanies();
        setSupplierCompanies(suppliers || []);
      } catch (error) {
        console.error("Error fetching suppliers:", error);
      }
    }
    fetchData();
  }, [isOpen]);

  useEffect(() => {
    async function fetchData() {
      try {
        const drivers = await getCompanyFreeDrivers();
        setDriverData(drivers || []);
      } catch (error) {
        console.error("Error fetching drivers:", error);
      }
    }

    fetchData();
  }, [selectedSupplier]);

  const handleCreateNewVehicle = async () => {
    try {
      if (
        selectedSupplier &&
        selectedDriver &&
        selectedPlate &&
        selectedBrand
      ) {
        const vehicleData = {
          brand: selectedBrand,
          driverId: selectedDriver ? selectedDriver.id : null,
          location: selectedDriver ? selectedDriver.location : null,
          name: selectedName,
          plate: selectedPlate,
          supplierId: selectedSupplier ? selectedSupplier.id : null,
        };

        await createNewVehicle(vehicleData);
        setSnackPositiveMessage("Yeni aracınız eklendi.");
        setOpenPositiveSnackbar(true);
        onClose();
      } else {
        setSnackNegativeMessage(
          "Araç eklerken hata oluştu. Girdiğiniz bilgileri kontrol ediniz!"
        );
        setOpenNegativeSnackbar(true);
      }
    } catch (error) {
      console.error("Error creating a new vehicle:", error);
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
        {/* Modal içeriği buraya gelecek */}
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
              {/* company drivers */}
              <div className="modal-input-content">
                <FormControl fullWidth>
                  <InputLabel id="driver-label">Sürücüler</InputLabel>
                  <Select
                    labelId="driver-label"
                    id="driver"
                    label="Sürücüler"
                    value={selectedDriver || "Seçiniz"}
                    onChange={(event) => setSelectedDriver(event.target.value)}
                  >
                    <MenuItem value="Seçiniz" disabled>
                      Seçiniz
                    </MenuItem>
                    {driverData.length === 0 ? (
                      <MenuItem disabled>
                        Boş sürücünüz yok Araç ekleyemezsiniz!
                      </MenuItem>
                    ) : (
                      driverData.length > 0 &&
                      driverData.map((driver, index) => (
                        <MenuItem key={index} value={driver}>
                          {driver.name} {driver.surname}
                        </MenuItem>
                      ))
                    )}
                  </Select>
                </FormControl>
              </div>
              {/* brand detail */}
              <div className="modal-input-content">
                <TextField
                  id="brand-detail"
                  label="Araç Markası"
                  variant="outlined"
                  required
                  fullWidth
                  inputProps={{ maxLength: 15 }}
                  value={selectedBrand || ""}
                  onChange={(event) => setSelectedBrand(event.target.value)}
                />
              </div>
              {/* plate detail */}
              <div className="modal-input-content">
                <TextField
                  id="plate-detail"
                  label="Araç Plakası"
                  variant="outlined"
                  required
                  fullWidth
                  inputProps={{ maxLength: 11 }}
                  value={selectedPlate || ""}
                  onChange={(event) => setSelectedPlate(event.target.value)}
                />
              </div>
              {/* delivery detail */}
              <div className="modal-input-content">
                <TextField
                  id="name-detail"
                  label="Araç İsmi"
                  variant="outlined"
                  required
                  fullWidth
                  inputProps={{ maxLength: 150 }}
                  value={selectedName || ""}
                  onChange={(event) => setSelectedName(event.target.value)}
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
            onClick={handleCreateNewVehicle}
            sx={{
              ...buttonContent,
              width: "150px",
            }}
            disabled={
              !selectedSupplier ||
              !selectedDriver ||
              !selectedBrand ||
              !selectedPlate ||
              !selectedName
            }
          >
            Araç Oluştur
          </Button>
        </div>
      </div>
    </div>
  );
}
