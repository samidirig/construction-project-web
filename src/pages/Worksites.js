import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardContent,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";
import Background1 from "../assets/images/worksite_background.PNG";
import { useWindowSizeWidth } from "../config/hooks";
import {
  getCompanyIdByAuthUser,
  getCompanyByManagerId,
  getCompanyWorksites,
} from "../config/firebase";
import MapWorksite from "../components/map/map_worksites/MapWorksite";
import { orangeButtonContent, worksiteCardContent } from "../style/utils";
import CreateWorksiteModal from "../components/CreateModals/CreateWorksiteModal";
import CreateShiftModal from "../components/CreateModals/CreateShiftModal";
import ViewWorksitePersonnels from "../components/ViewModals/ViewWorksitePersonnels";
import ViewWorksiteShifts from "../components/ViewModals/ViewWorksiteShifts";
import ViewWorksiteDetails from "../components/ViewModals/ViewWorksiteDetails";
import TopImage from "../components/TopImage";

export default function Worksites() {
  const windowScreenWidth = useWindowSizeWidth();
  const [worksitesData, setWorksitesData] = useState([]);
  const [companyData, setCompanyData] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedWorksite, setSelectedWorksite] = useState(null);
  const [viewSelectedWorksite, setViewSelectedWorksite] = useState(null);
  const [selectedCardIndex, setSelectedCardIndex] = useState(null);
  const [confirmationTrigger, setConfirmationTrigger] = useState(false);
  const [isCreateWorksiteModalOpen, setIsCreateWorksiteModalOpen] =
    useState(false);
  const [isCreateShiftModalOpen, setIsCreateShiftModalOpen] = useState(false);
  const [isWorksiteShiftModalOpen, setIsWorksiteShiftModalOpen] =
    useState(false);
  const [isWorksitePersonnelModalOpen, setIsWorksitePersonnelModalOpen] =
    useState(false);
  const [isWorksiteDetailsModalOpen, setIsWorksiteDetailsModalOpen] =
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

  const handleCardClick = (worksite, index) => {
    if (!selectedWorksite) {
      setSelectedWorksite(selectedWorksite === worksite ? null : worksite);
      setSelectedCardIndex(index === selectedCardIndex ? null : index);
    } else {
      setSelectedWorksite(null);
      setSelectedCardIndex(null);
    }
  };

  const handleButtonClick = (worksite, modalType) => {
    if (!viewSelectedWorksite) {
      setViewSelectedWorksite(
        viewSelectedWorksite === worksite ? null : worksite
      );

      switch (modalType) {
        case "shifts":
          handleOpenWorksiteShiftModal(worksite);
          break;
        case "personnels":
          handleOpenWorksitePersonnelModal(worksite);
          break;
        case "details":
          handleOpenWorksiteDetailsModal(worksite);
          break;
        default:
          console.error(`Invalid modal type: ${modalType}`);
      }
    } else {
      setViewSelectedWorksite(null);
    }
  };

  const handleMapSelectedWorkSite = (worksite) => {
    setSelectedWorksite(worksite);
    setSelectedCardIndex(null);
  };

  const handleOpenCreateWorksiteModal = () => {
    setIsCreateWorksiteModalOpen(true);
  };

  const handleOpenCreateShiftModal = () => {
    setIsCreateShiftModalOpen(true);
  };

  const handleOpenWorksiteShiftModal = () => {
    setIsWorksiteShiftModalOpen(true);
  };

  const handleOpenWorksitePersonnelModal = () => {
    setIsWorksitePersonnelModalOpen(true);
  };

  const handleOpenWorksiteDetailsModal = () => {
    setIsWorksiteDetailsModalOpen(true);
  };

  const handleCloseCreateWorksiteModal = () => {
    setIsCreateWorksiteModalOpen(false);
    setConfirmationTrigger(!confirmationTrigger);
  };

  const handleCloseCreateShiftModal = () => {
    setIsCreateShiftModalOpen(false);
    setConfirmationTrigger(!confirmationTrigger);
  };

  const handleCloseWorksitePersonnelModal = () => {
    setIsWorksitePersonnelModalOpen(false);
    setViewSelectedWorksite(null);
    setConfirmationTrigger(!confirmationTrigger);
  };

  const handleCloseWorksiteShiftModal = () => {
    setIsWorksiteShiftModalOpen(false);
    setViewSelectedWorksite(null);
    setConfirmationTrigger(!confirmationTrigger);
  };

  const handleCloseWorksiteDetailsModal = () => {
    setIsWorksiteDetailsModalOpen(false);
    setViewSelectedWorksite(null);
    setConfirmationTrigger(!confirmationTrigger);
  };

  console.log(viewSelectedWorksite);
  return (
    <div>
      {/* top image content */}
      <TopImage
        imagePath={Background1}
        companyName={companyData.name}
        page={"Şantiyeleri"}
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
            onClick={handleOpenCreateWorksiteModal}
            sx={orangeButtonContent}
          >
            Şantiye Oluştur
          </Button>
          <Button
            variant="contained"
            onClick={handleOpenCreateShiftModal}
            sx={orangeButtonContent}
          >
            Vardiya Oluştur
          </Button>
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
            handleMapSelectedWorkSite(worksite)
          }
          getSelectedModal={(worksite, modalType) =>
            handleButtonClick(worksite, modalType)
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
                ...worksiteCardContent,
                maxWidth: windowScreenWidth > 900 ? "420px" : "100%",
                backgroundColor:
                  selectedCardIndex === index || selectedWorksite === worksite
                    ? "rgba(255, 152, 67, 0.7)"
                    : "rgba(255, 152, 67, 0.2)",
              }}
            >
              <CardContent>
                <Stack
                  sx={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "start",
                    justifyContent: "space-around",
                    cursor: "pointer",
                  }}
                  onClick={() => handleCardClick(worksite, index)}
                >
                  <Typography variant="h6" gutterBottom>
                    {worksite.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Başlangıç Tarihi:{" "}
                    {formatTimestampToDate(worksite.startDate)}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Bitiş Tarihi: {formatTimestampToDate(worksite.finishDate)}
                  </Typography>
                </Stack>

                {/* card buttons */}
                <Stack
                  sx={{
                    width: "100%",
                    pt: 2,
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "20px",
                  }}
                >
                  <Button
                    variant="contained"
                    onClick={() => handleButtonClick(worksite, "shifts")}
                    sx={{
                      ...orangeButtonContent,
                      width: 110,
                      height: 30,
                      fontSize: "12px",
                    }}
                  >
                    Vardiyalar
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => handleButtonClick(worksite, "personnels")}
                    sx={{
                      ...orangeButtonContent,
                      width: 110,
                      height: 30,
                      fontSize: "12px",
                    }}
                  >
                    Personeller
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => handleButtonClick(worksite, "details")}
                    sx={{
                      ...orangeButtonContent,
                      bgcolor: "rgba(134, 167, 252, 0.9)",
                      width: 110,
                      height: 30,
                      fontSize: "12px",
                      "&:hover": {
                        bgcolor: "rgba(134, 167, 252, 0.7)",
                        color: "#ffffff",
                        boxShadow: "0px 0 10px rgba(52, 104, 192, 0.7)",
                      },
                    }}
                  >
                    Düzenle
                  </Button>
                </Stack>
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

      {/* shift create modal */}
      {isCreateShiftModalOpen && (
        <CreateShiftModal
          isOpen={isCreateShiftModalOpen}
          onClose={handleCloseCreateShiftModal}
        />
      )}

      {isWorksiteShiftModalOpen && (
        <ViewWorksiteShifts
          isOpen={isWorksiteShiftModalOpen}
          onClose={handleCloseWorksiteShiftModal}
          viewSelectedWorksite={viewSelectedWorksite}
        />
      )}

      {isWorksitePersonnelModalOpen && (
        <ViewWorksitePersonnels
          isOpen={isWorksitePersonnelModalOpen}
          onClose={handleCloseWorksitePersonnelModal}
          viewSelectedWorksite={viewSelectedWorksite}
        />
      )}

      {isWorksiteDetailsModalOpen && (
        <ViewWorksiteDetails
          isOpen={isWorksiteDetailsModalOpen}
          onClose={handleCloseWorksiteDetailsModal}
          viewSelectedWorksite={viewSelectedWorksite}
        />
      )}
    </div>
  );
}
