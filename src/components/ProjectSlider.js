import React, { useState } from "react";
import { Card, CardContent, Typography, Stack, Button, Tooltip } from "@mui/material";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { orangeButtonContent, projectSliderCardContent } from "../style/utils";
import ViewProjectWorksites from "./ViewModals/ViewProjectWorksites";
import ViewProjectDocuments from "./ViewModals/ViewProjectDocuments";
import ViewProjectDetails from "./ViewModals/ViewProjectDetails";

const NextArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{
        ...style,
        display: "block",
        background: "lightgray",
        borderRadius: "50%",
      }}
      onClick={onClick}
    />
  );
};

const PrevArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{
        ...style,
        display: "block",
        background: "lightgray",
        borderRadius: "50%",
      }}
      onClick={onClick}
    />
  );
};

const formatTimestampToDate = (timestamp) => {
  const date = new Date(timestamp.seconds * 1000);
  return date.toLocaleDateString();
};
export default function ProjectSlider({ cardContent }) {
  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 1,
        },
      },
    ],
  };

  const [viewSelectedProject, setViewSelectedProject] = useState(null);
  const [isProjectWorksitesModalOpen, setIsProjectWorksitesModalOpen] =
    useState(false);
  const [isProjectPersonnelModalOpen, setIsProjectPersonnelModalOpen] =
    useState(false);
  const [isProjectDetailsModalOpen, setIsProjectDetailsModalOpen] =
    useState(false);

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
  };

  const handleCloseProjectWorksitesModal = () => {
    setIsProjectWorksitesModalOpen(false);
    setViewSelectedProject(null);
  };

  const handleCloseProjectDetailsModal = () => {
    setIsProjectDetailsModalOpen(false);
    setViewSelectedProject(null);
  };

  return (
    <div
      style={{
        width: "100%",
        height: "auto",
        padding: "10px",
        borderRadius: "20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        // boxShadow: "0px 0 10px rgba(52, 104, 192, 0.3)",
      }}
    >
      {cardContent.length === 0 && (
        <Typography variant="h6" color="text.secondary">
          Firmanıza ait mevcut Projeler bulunamadı.
        </Typography>
      )}

      {cardContent.length > 0 && cardContent.length <= 2 && (
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: "50px",
            width: "100%",
            justifyContent: "center",
          }}
        >
          {cardContent.map((project, index) => (
            <Card
              key={index}
              sx={{
                ...projectSliderCardContent,
                width: "420px",
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
          ))}
        </div>
      )}

      {cardContent.length > 2 && (
        <Slider
          {...settings}
          style={{
            width: "90%",
            gap: "10px",
            padding: "0px 15px 0px 15px",
          }}
        >
          {cardContent.map((project, index) => (
            <Card
              key={index}
              sx={{
                ...projectSliderCardContent,
                backgroundColor: "rgba(255, 152, 67, 0.2)",
              }}
            >
              <CardContent>
                <Stack>
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
                  <Tooltip title={"Proje Şantiyeleri"} arrow>
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
                  </Tooltip>
                  <Tooltip title={"Proje Dökümanları"} arrow>
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
                  </Tooltip>
                  <Tooltip title={"Projeyi Düzenle"} arrow>
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
                  </Tooltip>
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Slider>
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
