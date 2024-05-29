import React, { useState } from "react";
import { Card, CardContent, Typography, Stack, Button, Tooltip } from "@mui/material";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { orangeButtonContent, worksiteSliderCardContent } from "../style/utils";
import ViewWorksiteShifts from "./ViewModals/ViewWorksiteShifts";
import ViewWorksitePersonnels from "./ViewModals/ViewWorksitePersonnels";
import ViewWorksiteDetails from "./ViewModals/ViewWorksiteDetails";

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
export default function WorksiteSlider({ cardContent }) {
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

  const [viewSelectedWorksite, setViewSelectedWorksite] = useState(null);
  const [isWorksiteShiftModalOpen, setIsWorksiteShiftModalOpen] =
    useState(false);
  const [isWorksitePersonnelModalOpen, setIsWorksitePersonnelModalOpen] =
    useState(false);
  const [isWorksiteDetailsModalOpen, setIsWorksiteDetailsModalOpen] =
    useState(false);

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

  // view modals
  const handleOpenWorksiteShiftModal = () => {
    setIsWorksiteShiftModalOpen(true);
  };

  const handleOpenWorksitePersonnelModal = () => {
    setIsWorksitePersonnelModalOpen(true);
  };

  const handleOpenWorksiteDetailsModal = () => {
    setIsWorksiteDetailsModalOpen(true);
  };

  const handleCloseWorksitePersonnelModal = () => {
    setIsWorksitePersonnelModalOpen(false);
    setViewSelectedWorksite(null);
  };

  const handleCloseWorksiteShiftModal = () => {
    setIsWorksiteShiftModalOpen(false);
    setViewSelectedWorksite(null);
  };

  const handleCloseWorksiteDetailsModal = () => {
    setIsWorksiteDetailsModalOpen(false);
    setViewSelectedWorksite(null);
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
          {cardContent.map((worksite, index) => (
            <Card
              key={index}
              sx={{
                ...worksiteSliderCardContent,
                maxWidth: "100%",
                backgroundColor: "rgba(255, 152, 67, 0.7)",
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
          {cardContent.map((worksite, index) => (
            <Card
              key={index}
              sx={{
                ...worksiteSliderCardContent,
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
                  <Tooltip title={"Şantiye Vardiyaları"} arrow>
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
                  </Tooltip>
                  <Tooltip title={"Şantiye Personelleri"} arrow>
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
                  </Tooltip>
                  <Tooltip title={"Şantiyeyi Düzenle"} arrow>
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
                  </Tooltip>
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Slider>
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
