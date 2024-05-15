import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardContent,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";
import Background1 from "../assets/images/background_1.jpg";
import { useWindowSizeWidth } from "../config/hooks";
import {
  getCompanyIdByAuthUser,
  getCompanyByManagerId,
  getCompanyWorksites,
} from "../config/firebase";
import MapWorksite from "../components/map/map_worksites/MapWorksite";
import { orangeButtonContent } from "../style/utils";
import CreateWorksiteModal from "../components/modal/CreateWorksiteModal";

export default function Worksites() {
  const windowScreenWidth = useWindowSizeWidth();
  const [worksitesData, setWorksitesData] = useState([]);
  const [companyData, setCompanyData] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedWorksite, setSelectedWorksite] = useState(null);
  const [confirmationTrigger, setConfirmationTrigger] = useState(false);
  const [isCreateWorksiteModalOpen, setIsCreateWorksiteModalOpen] =
    useState(false);

  useEffect(() => {
    async function fetchData() {
      const company = await getCompanyByManagerId();
      setCompanyData(company);

      try {
        const worksites = await getCompanyWorksites();
        setWorksitesData(worksites || []);
      } catch (error) {
        console.error("Error fetching worksites:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [confirmationTrigger]);

  useEffect(() => {
    const saveCompanyIdToLocal = async () => {
      try {
        const companyId = await getCompanyIdByAuthUser();
        localStorage.setItem("companyId", companyId);
      } catch (error) {
        console.error("Error saving companyId to localStorage:", error);
      }
    };

    saveCompanyIdToLocal();
  }, [confirmationTrigger]);

  const formatTimestampToDate = (timestamp) => {
    const date = new Date(timestamp.seconds * 1000); // Timestamp saniye cinsinden geldiği için 1000 ile çarpıyoruz
    return date.toLocaleDateString();
  };

  const handleCardClick = (worksite) => {
    if (!selectedWorksite) {
      setSelectedWorksite(worksite);
    } else {
      setSelectedWorksite(null);
    }
  };

  const handleGetSelectedWorkSite = (worksite) => {
    setSelectedWorksite(worksite);
  };

  const handleOpenCreateWorksiteModal = () => {
    setIsCreateWorksiteModalOpen(true);
  };

  const handleCloseCreateWorksiteModal = () => {
    setIsCreateWorksiteModalOpen(false);
    setConfirmationTrigger(!confirmationTrigger);
  };

  console.log(selectedWorksite);
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
            zIndex: 2, // Place the gradient overlay above the image
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
            {companyData.name} Şantiyeleri
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
              onClick={handleOpenCreateWorksiteModal}
              sx={orangeButtonContent}
            >
              Şantiye Oluştur
            </Button>
          </Stack>
        </Stack>
      </div>

      {/* map content */}
      <Stack
        sx={{
          mt: 2,
          position: "relative",
          width: "100%",
          height: windowScreenWidth > 900 ? 450 : 500,
          display: "flex",
          borderRadius: "20px",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
        }}
      >
        <MapWorksite
          worksiteList={worksitesData}
          selectedWorksite={selectedWorksite}
          getSelectedWorkSite={(worksite) =>
            handleGetSelectedWorkSite(worksite)
          }
        />
      </Stack>

      {/* card content */}
      <Stack
        sx={{
          mt: 2,
          p: "1%",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          flexWrap: "wrap",
          gap: "25px",
        }}
      >
        {loading ? (
          <CircularProgress size={50} />
        ) : worksitesData && worksitesData.length > 0 ? (
          worksitesData.map((worksite, index) => (
            <Card
              key={index}
              sx={{
                mb: 2,
                p: 1,
                width: "100%",
                maxWidth: windowScreenWidth > 900 ? "400px" : "100%",
                height: "200px",
                backgroundColor: selectedWorksite
                  ? "rgba(255, 152, 67, 0.7)"
                  : "rgba(255, 152, 67, 0.2)",
                borderRadius: "20px",
                boxShadow: "0px 0 10px rgba(52, 104, 192, 0.3)",
                cursor: "pointer",
                transition: "transform 0.3s",
                "&:hover": {
                  transform: "scale(1.05)",
                },
              }}
              onClick={() => handleCardClick(worksite)}
            >
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Proje İsmi: {worksite.name}
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  Firma İsmi: {companyData.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Başlangıç Tarihi: {formatTimestampToDate(worksite.startDate)}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Bitiş Tarihi: {formatTimestampToDate(worksite.finishDate)}
                </Typography>
              </CardContent>
            </Card>
          ))
        ) : (
          <Typography variant="body1">
            Kayıt açtığınız bir şantiye alanı bulunmamaktadır.
          </Typography>
        )}
      </Stack>

      {/* worksite create modal */}
      {isCreateWorksiteModalOpen && (
        <CreateWorksiteModal
          isOpen={isCreateWorksiteModalOpen}
          onClose={handleCloseCreateWorksiteModal}
        />
      )}
    </div>
  );
}
