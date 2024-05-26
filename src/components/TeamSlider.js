import { Card, CardContent, Typography } from "@mui/material";
import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { teamsCardContent } from "../style/utils";

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

export default function TeamSlider({ cardContent }) {
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

  return (
    <div
      style={{
        width: "100%",
        height: "220px",
        padding: "10px",
        borderRadius: "20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0px 0 10px rgba(52, 104, 192, 0.3)",
      }}
    >
      {cardContent.length === 0 && (
        <Typography variant="h6" color="text.secondary">
          Takımınız Bulunmamaktadır
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
          {cardContent.map((content, index) => (
            <Card
              key={index}
              sx={{
                ...teamsCardContent,
                width: "400px",
              }}
            >
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>
                  Takım İsmi: {content.teamName}
                </Typography>
                <Typography variant="subtitle2" gutterBottom>
                  Bağlı Şantiye: {content.worksiteName}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Oluşturulma: {formatTimestampToDate(content.createdTime)}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Personeller: {content.personnels[0].userName}{" "}
                  {content.personnels[0].userSurname}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {cardContent.length > 2 && (
        <Slider
          {...settings}
          style={{
            width: "95%",
            padding: "0px 15px 0px 15px",
          }}
        >
          {cardContent.map((content, index) => (
            <div key={index} style={{ padding: "10px" }}>
              <Card
                sx={{
                  ...teamsCardContent,
                }}
              >
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom>
                    Takım İsmi: {content.teamName}
                  </Typography>
                  <Typography variant="subtitle2" gutterBottom>
                    Bağlı Şantiye: {content.worksiteName}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Oluşturulma: {formatTimestampToDate(content.createdTime)}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Personeller: {content.personnels[0].userName}{" "}
                    {content.personnels[0].userSurname}
                  </Typography>
                </CardContent>
              </Card>
            </div>
          ))}
        </Slider>
      )}
    </div>
  );
}
