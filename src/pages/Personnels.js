import React, { useEffect, useState } from "react";
import {
  getCompanyByManagerId,
  getCompanyPersonnels,
  getCompanyTeams,
  getCompanyWaitingPersonnels,
  getPermitsCompanies,
} from "../config/firebase";
import { Button, CircularProgress, Stack, Typography } from "@mui/material";
import Background1 from "../assets/images/personnel_background.PNG";
import ConfirmPersonnelTable from "../components/table/personel_table/ConfirmPersonnelTable";
import { useWindowSizeWidth } from "../config/hooks";
import {
  orangeButtonContent,
  tableContent,
  tableContentHeader,
} from "../style/utils";
import PermitTable from "../components/table/permit_table/PermitTable";
import TeamSlider from "../components/TeamSlider";
import CreateTeamModal from "../components/CreateModals/CreateTeamModal";
import TopImage from "../components/TopImage";

export default function Personnels() {
  const windowScreenWidth = useWindowSizeWidth();
  const [personnelData, setPersonnelData] = useState({});
  const [permitsData, setPermitsData] = useState([]);
  const [waitingPersonnelData, setWaitingPersonnelData] = useState({});
  const [companyData, setCompanyData] = useState({});
  const [teamsData, setTeamsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmationTrigger, setConfirmationTrigger] = useState(false);
  const [isCreateTeamModalOpen, setIsCreateTeamModalOpen] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const company = await getCompanyByManagerId();
        setCompanyData(company);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [confirmationTrigger]);

  useEffect(() => {
    const fetchData = () => {
      getCompanyPersonnels((personnels) => {
        setPersonnelData(personnels || []);
        setLoading(false);
      });
    };

    fetchData();
  }, [confirmationTrigger]);

  useEffect(() => {
    async function fetchData() {
      try {
        const teams = await getCompanyTeams();
        setTeamsData(teams || []);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [confirmationTrigger]);

  useEffect(() => {
    const fetchData = () => {
      getPermitsCompanies((permits) => {
        setPermitsData(permits || []);
        setLoading(false);
      });
    };

    fetchData();
  }, [confirmationTrigger]);

  const handleOpenCreateTeamModal = () => {
    setIsCreateTeamModalOpen(true);
  };

  const handleCloseCreateTeamModal = () => {
    setIsCreateTeamModalOpen(false);
    setConfirmationTrigger((prev) => !prev);
  };

  console.log(permitsData);
  console.log(personnelData);

  return (
    <div>
      {/* top image content */}
      <TopImage imagePath={Background1} companyName={companyData.name} page={"Personeller"} />

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
            mt:"20px",
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
            onClick={() => {}}
            sx={orangeButtonContent}
          >
            Sürücü Ekle
          </Button>
          <Button
            variant="contained"
            onClick={handleOpenCreateTeamModal}
            sx={orangeButtonContent}
          >
            Takım Oluştur
          </Button>
        </Stack>
      </div>

      {/* main content */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-around",
          gap: "20px",
          marginTop: "20px",
          marginBottom: "20px",
        }}
      >
        {/* personnel teams */}
        <TeamSlider cardContent={teamsData} />

        {/* personnels table */}
        <Stack
          sx={{
            ...tableContent,
            width: "100%",
          }}
        >
          <Stack sx={tableContentHeader}>
            <Typography variant="h5" sx={{ color: "#fff" }}>
              Personeller
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
              {personnelData.length > 0 ? (
                <ConfirmPersonnelTable
                  personnels={personnelData}
                  confirmPersonnelTrigger={() => {
                    setConfirmationTrigger((prev) => !prev);
                  }}
                />
              ) : (
                <Typography marginTop={10}>
                  Firmanıza ait mevcut Personeller bulunamadı.
                </Typography>
              )}
            </Stack>
          )}
        </Stack>

        {/* permits table */}
        <Stack
          sx={{
            ...tableContent,
            width: "100%",
          }}
        >
          <Stack sx={tableContentHeader}>
            <Typography variant="h5" sx={{ color: "#fff" }}>
              Personel İzinleri
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
              {permitsData.length > 0 ? (
                <PermitTable
                  permits={permitsData}
                  confirmPermitTrigger={() => {
                    setConfirmationTrigger((prev) => !prev);
                  }}
                />
              ) : (
                <Typography marginTop={10}>
                  Firmanıza ait personel izinleri bulunamadı.
                </Typography>
              )}
            </Stack>
          )}
        </Stack>
      </div>

      {/* team create modal */}
      {isCreateTeamModalOpen && (
        <CreateTeamModal
          isOpen={isCreateTeamModalOpen}
          onClose={handleCloseCreateTeamModal}
        />
      )}
    </div>
  );
}
