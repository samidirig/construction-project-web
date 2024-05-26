import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardContent,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";
import Background1 from "../assets/images/project_background.PNG";
import { useWindowSizeWidth } from "../config/hooks";
import {
  getCompanyByManagerId,
  getCompanyIdByAuthUser,
  getCompanyProjects,
} from "../config/firebase";
import { orangeButtonContent, projectCardContent } from "../style/utils";
import CreateProjectModal from "../components/CreateModals/CreateProjectModal";
import TopImage from "../components/TopImage";
import ViewProjectDocuments from "../components/ViewModals/ViewProjectDocuments";
import ViewProjectDetails from "../components/ViewModals/ViewProjectDetails";
import ViewProjectWorksites from "../components/ViewModals/ViewProjectWorksites";

export default function Projects() {
  const windowScreenWidth = useWindowSizeWidth();
  const [projectsData, setProjectsData] = useState([]);
  const [companyData, setCompanyData] = useState({});
  const [viewSelectedProject, setViewSelectedProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confirmationTrigger, setConfirmationTrigger] = useState(false);
  const [isCreateProjectModalOpen, setIsCreateProjectModalOpen] =
    useState(false);
  const [isProjectWorksitesModalOpen, setIsProjectWorksitesModalOpen] =
    useState(false);
  const [isProjectPersonnelModalOpen, setIsProjectPersonnelModalOpen] =
    useState(false);
  const [isProjectDetailsModalOpen, setIsProjectDetailsModalOpen] =
    useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const company = await getCompanyByManagerId();
        setCompanyData(company || []);
      } catch (error) {
        console.error("Error fetching company:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [confirmationTrigger]);

  useEffect(() => {
    async function fetchData() {
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

  const formatTimestampToDate = (timestamp) => {
    const date = new Date(timestamp.seconds * 1000); // Timestamp saniye cinsinden geldiği için 1000 ile çarpıyoruz
    return date.toLocaleDateString();
  };

  console.log(viewSelectedProject);
  const handleButtonClick = (project, modalType) => {
    if (!viewSelectedProject) {
      setViewSelectedProject(viewSelectedProject === project ? null : project);
      switch (modalType) {
        case "worksites":
          handleOpenProjectWorksitesModal(project);
          console.log(modalType);
          break;
        case "documents":
          handleOpenProjectPersonnelModal(project);
          console.log(modalType);
          break;
        case "details":
          handleOpenProjectDetailsModal(project);
          console.log(modalType);
          break;
        default:
          console.error(`Invalid modal type: ${modalType}`);
      }
    } else {
      setViewSelectedProject(null);
    }
  };

  const handleOpenCreateProjectModal = () => {
    setIsCreateProjectModalOpen(true);
  };

  const handleCloseCreateProjectModal = () => {
    setIsCreateProjectModalOpen(false);
    setConfirmationTrigger(!confirmationTrigger);
  };

  // view modals
  const handleOpenProjectWorksitesModal = () => {
    setIsProjectWorksitesModalOpen(true);
  };

  const handleOpenProjectPersonnelModal = () => {
    setIsProjectPersonnelModalOpen(true);
  };

  const handleOpenProjectDetailsModal = () => {
    setIsProjectDetailsModalOpen(true);
  };

  const handleCloseProjectPersonnelModal = () => {
    setIsProjectPersonnelModalOpen(false);
    setViewSelectedProject(null);
    setConfirmationTrigger(!confirmationTrigger);
  };

  const handleCloseProjectWorksitesModal = () => {
    setIsProjectWorksitesModalOpen(false);
    setViewSelectedProject(null);
    setConfirmationTrigger(!confirmationTrigger);
  };

  const handleCloseProjectDetailsModal = () => {
    setIsProjectDetailsModalOpen(false);
    setViewSelectedProject(null);
    setConfirmationTrigger(!confirmationTrigger);
  };

  return (
    <div>
      {/* top image content */}
      <TopImage
        imagePath={Background1}
        companyName={companyData.name}
        page={"Projeleri"}
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
            onClick={handleOpenCreateProjectModal}
            sx={orangeButtonContent}
          >
            Proje Oluştur
          </Button>
        </Stack>
      </div>

      {/* project card content */}
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
                ...projectCardContent,
                maxWidth: windowScreenWidth > 900 ? "420px" : "100%",
                backgroundColor: "rgba(255, 152, 67, 0.2)",
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
                  }}
                >
                  <Typography variant="h6" gutterBottom>
                    {project.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Şehir: {project.city}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Bütçe: ₺{project.budget}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Başlangıç Tarihi: {formatTimestampToDate(project.startDate)}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Bitiş Tarihi: {formatTimestampToDate(project.finishDate)}
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
                    onClick={() => handleButtonClick(project, "worksites")}
                    sx={{
                      ...orangeButtonContent,
                      width: 110,
                      height: 30,
                      fontSize: "12px",
                    }}
                  >
                    Şantiyeler
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => handleButtonClick(project, "documents")}
                    sx={{
                      ...orangeButtonContent,
                      width: 110,
                      height: 30,
                      fontSize: "12px",
                    }}
                  >
                    Dökümanlar
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => handleButtonClick(project, "details")}
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

      {isProjectWorksitesModalOpen && (
        <ViewProjectWorksites
          isOpen={isProjectWorksitesModalOpen}
          onClose={handleCloseProjectWorksitesModal}
          viewSelectedProject={viewSelectedProject}
        />
      )}

      {isProjectPersonnelModalOpen && (
        <ViewProjectDocuments
          isOpen={isProjectPersonnelModalOpen}
          onClose={handleCloseProjectPersonnelModal}
          viewSelectedProject={viewSelectedProject}
        />
      )}

      {isProjectDetailsModalOpen && (
        <ViewProjectDetails
          isOpen={isProjectDetailsModalOpen}
          onClose={handleCloseProjectDetailsModal}
          viewSelectedProject={viewSelectedProject}
        />
      )}
    </div>
  );
}
