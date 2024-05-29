import React, { useEffect, useState } from "react";

import {
  getCompanyByManagerId,
  getCompanyDeliveries,
} from "../config/firebase";
import { CircularProgress, Stack, Typography, Button } from "@mui/material";
import { useWindowSizeWidth } from "../config/hooks";
import MapDeliveries from "../components/map/map_deliveries/MapDeliveries";
import DeliveryTable from "../components/table/delivery_table/DeliveryTable";
import Background1 from "../assets/images/delivery_background.PNG";
import {
  mainContent,
  tableContent,
  tableContentHeader,
  orangeButtonContent,
} from "../style/utils";
import CreateDeliveryModal from "../components/CreateModals/CreateDeliveryModal";
import CreateVehicleModal from "../components/CreateModals/CreateVehicleModal";
import CreateSupplierModal from "../components/CreateModals/CreateSupplierModal";
import TopImage from "../components/TopImage";

export default function Deliveries() {
  const [deliveryData, setDeliveryData] = useState(null);
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
      try {
        const company = await getCompanyByManagerId();
        setCompanyData(company || []);
      } catch (error) {
        console.error("Error fetching documents:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = () => {
      getCompanyDeliveries((deliveries) => {
        setDeliveryData(deliveries || null);
        setLoading(false);
      });
    };

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
      <TopImage
        imagePath={Background1}
        companyName={companyData.name}
        page={"Sipariş ve Teslimat"}
      />

      <div
        style={{
          position: "relative",
          width: "100%",
          height: "auto",
          minHeight: 50,
          borderRadius: "50px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Stack
          sx={{
            zIndex: 2,
            mt: "20px",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            flexWrap: "wrap",
            gap: "50px",
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
            <MapDeliveries deliveries={deliveryData} />
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
            width: windowScreenWidth > 1150 ? "50%" : "100%",
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
              {deliveryData && deliveryData.length > 0 ? (
                <DeliveryTable
                  deliveries={deliveryData}
                  isCompleted={false}
                  companyData={companyData}
                />
              ) : (
                <Typography marginTop={10}>
                  Aktif ait teslimatlar bulunmamaktadır.
                </Typography>
              )}
            </Stack>
          )}
        </Stack>

        {/* completedDeliveries card */}
        <Stack
          sx={{
            ...tableContent,
            width: windowScreenWidth > 1150 ? "50%" : "100%",
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
                overflow: "auto",
                top: "65px",
              }}
            >
              {deliveryData && deliveryData.length > 0 ? (
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
