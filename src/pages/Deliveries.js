import React, { useEffect, useState } from "react";

import {
  getCompanyByManagerId,
  getCompanyDeliveries,
} from "../config/firebase";
import { CircularProgress, Stack, Typography, Button } from "@mui/material";
import { useWindowSizeWidth } from "../config/hooks";
import MapDeliveries from "../components/map/map_deliveries/MapDeliveries";
import DeliveryTable from "../components/table/delivery_table/DeliveryTable";
import Background1 from "../assets/images/background_1.jpg";
import {
  mainContent,
  tableContent,
  tableContentHeader,
  orangeButtonContent,
} from "../style/utils";
import CreateDeliveryModal from "../components/modal/CreateDeliveryModal";
import CreateVehicleModal from "../components/modal/CreateVehicleModal";
import CreateSupplierModal from "../components/modal/CreateSupplierModal";

export default function Deliveries() {
  const [deliveryData, setDeliveryData] = useState({});
  const [companyData, setCompanyData] = useState({});
  const [loading, setLoading] = useState(true);
  const [confirmationTrigger, setConfirmationTrigger] = useState(false);
  const [isCreateDeliveryModalOpen, setIsCreateDeliveryModalOpen] =
    useState(false);
  const [isCreateVehicleModalOpen, setIsCreateVehicleModalOpen] =
    useState(false);
  const [isCreateSupplierModalOpen, setIsCreateSupplierModalOpen] =
    useState(false);
  const windowScreenWidth = useWindowSizeWidth();

  useEffect(() => {
    async function fetchData() {
      const company = await getCompanyByManagerId();
      setCompanyData(company);

      try {
        const deliveries = await getCompanyDeliveries();
        setDeliveryData(deliveries || []);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [confirmationTrigger]);

  const handleOpenCreateDeliveryModal = () => {
    setIsCreateDeliveryModalOpen(true);
  };

  const handleCloseCreateDeliveryModal = () => {
    setIsCreateDeliveryModalOpen(false);
    setConfirmationTrigger(!confirmationTrigger);
  };

  const handleOpenCreateVehicleModal = () => {
    setIsCreateVehicleModalOpen(true);
  };

  const handleCloseCreateVehicleModal = () => {
    setIsCreateVehicleModalOpen(false);
  };

  const handleOpenCreateSupplierModal = () => {
    setIsCreateSupplierModalOpen(true);
  };

  const handleCloseCreateSupplierModal = () => {
    setIsCreateSupplierModalOpen(false);
  };

  return (
    <div>
      {/* top image content */}
      <div
        style={{
          position: "relative",
          width: "100%",
          height: windowScreenWidth > 900 ? 90 : 200,
          display: "flex",
          borderRadius: "20px",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
        }}
      >
        <img
          src={Background1}
          alt="login"
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            borderRadius: "20px",
            objectFit: "cover",
            zIndex: 1,
          }}
        />

        <div
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            borderRadius: "20px",
            background:
              "linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.5))", // Adjust the gradient values as needed
            zIndex: 2,
          }}
        />

        <Stack
          sx={{
            zIndex: 2,
            position: "absolute",
            bottom: 15,
            left: "5%",
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            alignItems: "center",
            gap: windowScreenWidth > 900 ? "50px" : "40px",
          }}
        >
          <Typography variant="h4" color={"#fff"} gutterBottom>
            {companyData.name} Sipariş ve Teslimat
          </Typography>
          <Stack
            sx={{
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <Button
              variant="contained"
              onClick={handleOpenCreateDeliveryModal}
              sx={orangeButtonContent}
            >
              Sipariş Oluştur
            </Button>
            <Button
              variant="contained"
              onClick={handleOpenCreateSupplierModal}
              sx={{ ...orangeButtonContent, width: "200px" }}
            >
              Tedarikçi Firma Oluştur
            </Button>
            <Button
              variant="contained"
              onClick={handleOpenCreateVehicleModal}
              sx={{ ...orangeButtonContent, width: "200px" }}
            >
              Tedarik Aracı Oluştur
            </Button>
          </Stack>
        </Stack>
      </div>

      {/* map content */}
      <Stack
        sx={{
          position: "relative",
          width: "100%",
          height: windowScreenWidth > 1150 ? 400 : 500,
          mt: 2,
          display: "flex",
          borderRadius: "20px",
          flexDirection: "row",
          flexWrap: windowScreenWidth > 1150 ? "nowrap" : "wrap",
          alignItems: "flex-start",
          gap: "10px",
        }}
      >
        {loading ? (
          <CircularProgress size={50} />
        ) : (
          <Stack
            sx={{
              position: "relative",
              width: "100%",
              height: windowScreenWidth > 1150 ? 400 : 500,
              borderRadius: "20px",
            }}
          >
            {deliveryData.length > 0 ? (
              <MapDeliveries deliveries={deliveryData} />
            ) : (
              <Typography marginTop={10}>Harita yüklenemedi!</Typography>
            )}
          </Stack>
        )}
      </Stack>

      {/* tables */}
      <Stack
        sx={{
          ...mainContent,
          height: windowScreenWidth > 1150 ? 400 : 500,
          flexWrap: windowScreenWidth > 1150 ? "nowrap" : "wrap",
        }}
      >
        {/* delivery table */}
        <Stack
          sx={{
            ...tableContent,
            width: windowScreenWidth > 1150 ? "50%" : "100%", // Güncellendi
          }}
        >
          <Stack sx={tableContentHeader}>
            <Typography variant="h5" sx={{ color: "#fff" }}>
              Siparişler
            </Typography>
          </Stack>

          {loading ? (
            <CircularProgress sx={{ mt: 20 }} size={50} />
          ) : (
            <Stack
              sx={{
                position: "relative",
                alignItems: "center",
                top: "65px",
              }}
            >
              {deliveryData.length > 0 ? (
                <DeliveryTable
                  deliveries={deliveryData}
                  isCompleted={false}
                  companyData={companyData}
                />
              ) : (
                <Typography marginTop={10}>
                  Firmanıza ait teslimat bulunmamaktadır.
                </Typography>
              )}
            </Stack>
          )}
        </Stack>

        {/* completedDeliveries card */}
        <Stack
          sx={{
            ...tableContent,
            width: windowScreenWidth > 1150 ? "50%" : "100%", // Güncellendi
          }}
        >
          <Stack sx={tableContentHeader}>
            <Typography variant="h5" sx={{ color: "#fff" }}>
              Tamamlanmış teslimatlar
            </Typography>
          </Stack>
          {loading ? (
            <CircularProgress sx={{ mt: 20 }} size={50} />
          ) : (
            <Stack
              sx={{
                position: "relative",
                alignItems: "center",
                top: "65px",
              }}
            >
              {deliveryData.length > 0 ? (
                <DeliveryTable
                  deliveries={deliveryData}
                  isCompleted={true}
                  companyData={companyData}
                />
              ) : (
                <Typography marginTop={10}>
                  Tamamlanmış teslimatlar bulunmamaktadır.
                </Typography>
              )}
            </Stack>
          )}
        </Stack>
      </Stack>

      {/* delivery create modal */}
      {isCreateDeliveryModalOpen && (
        <CreateDeliveryModal
          isOpen={isCreateDeliveryModalOpen}
          onClose={handleCloseCreateDeliveryModal}
        />
      )}

      {/* vehicle create modal */}
      {isCreateVehicleModalOpen && (
        <CreateVehicleModal
          isOpen={isCreateVehicleModalOpen}
          onClose={handleCloseCreateVehicleModal}
        />
      )}

      {/* supplier create modal */}
      {isCreateSupplierModalOpen && (
        <CreateSupplierModal
          isOpen={isCreateSupplierModalOpen}
          onClose={handleCloseCreateSupplierModal}
        />
      )}
    </div>
  );
}
