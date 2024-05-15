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
  getCompanyByManagerId,
  getCompanyIdByAuthUser,
  getCompanyProjects,
} from "../config/firebase";
import { orangeButtonContent } from "../style/utils";
import CreateProjectModal from "../components/modal/CreateProjectModal";

export default function Projects() {
  const windowScreenWidth = useWindowSizeWidth();
  const [projectsData, setProjectsData] = useState([]);
  const [companyData, setCompanyData] = useState({});
  const [loading, setLoading] = useState(true);
  const [confirmationTrigger, setConfirmationTrigger] = useState(false);
  const [isCreateProjectModalOpen, setIsCreateProjectModalOpen] =
    useState(false);

  useEffect(() => {
    async function fetchData() {
      const company = await getCompanyByManagerId();
      setCompanyData(company);

      try {
        const projects = await getCompanyProjects();
        setProjectsData(projects || []);
      } catch (error) {
        console.error("Error fetching projects:", error);
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

  console.log(companyData);
  console.log(projectsData);
  const formatTimestampToDate = (timestamp) => {
    const date = new Date(timestamp.seconds * 1000); // Timestamp saniye cinsinden geldiği için 1000 ile çarpıyoruz
    return date.toLocaleDateString();
  };

  const handleOpenCreateProjectModal = () => {
    setIsCreateProjectModalOpen(true);
  };

  const handleCloseCreateProjectModal = () => {
    setIsCreateProjectModalOpen(false);
    setConfirmationTrigger(!confirmationTrigger);
  };
  return (
    <div>
      {/* top image content */}
      <div
        style={{
          position: "relative",
          width: "100%",
          height: 250,
          display: "flex",
          borderRadius: "50px",
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
            borderRadius: "50px",
            objectFit: "cover",
            zIndex: 1,
          }}
        />
        <div
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            borderRadius: "50px",
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
            gap: "50px",
          }}
        >
          <Typography variant="h4" color={"#fff"} gutterBottom>
            {companyData.name} Projeleri
          </Typography>
          <Button
            variant="contained"
            onClick={handleOpenCreateProjectModal}
            sx={orangeButtonContent}
          >
            Proje Oluştur
          </Button>
        </Stack>
      </div>

      <Stack
        sx={{
          mt: 3,
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
        ) : projectsData && projectsData.length > 0 ? (
          projectsData.map((project, index) => (
            <Card
              key={index}
              sx={{
                mb: 2,
                p: 1,
                width: "100%",
                maxWidth: windowScreenWidth > 900 ? "400px" : "100%",
                height: "200px",
                backgroundColor: "rgba(255, 152, 67, 0.2)",
                borderRadius: "20px",
                boxShadow: "0px 0 10px rgba(52, 104, 192, 0.3)",
                transition: "transform 0.3s",
                "&:hover": {
                  transform: "scale(1.05)",
                },
              }}
            >
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Proje İsmi: {project.name}
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  Firma İsmi: {companyData.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Başlangıç Tarihi: {formatTimestampToDate(project.startDate)}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Bitiş Tarihi: {formatTimestampToDate(project.finishDate)}
                </Typography>
              </CardContent>
            </Card>
          ))
        ) : (
          <Typography variant="body1">
            Kayıtlı bir proje bulunmamaktadır.
          </Typography>
        )}
      </Stack>

      {/* Project create modal */}
      {isCreateProjectModalOpen && (
        <CreateProjectModal
          isOpen={isCreateProjectModalOpen}
          onClose={handleCloseCreateProjectModal}
        />
      )}
    </div>
  );
}
