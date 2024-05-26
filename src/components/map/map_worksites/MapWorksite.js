import { React, useState, useCallback, useRef, useEffect } from "react";
import {
  GoogleMap,
  useLoadScript,
  MarkerF,
  InfoWindow,
} from "@react-google-maps/api";
import mapStyle from "../mapStyle";
import "./MapWorksite.scss";
import { orangeButtonContent } from "../../../style/utils";
import WorksiteIcon from "../../../assets/images/worksite_1.png";
import { BiCurrentLocation } from "react-icons/bi";
import { Button, IconButton, Stack } from "@mui/material";

const mapWorksiteStyle = {
  position: "absolute",
  left: 0,
  right: 0,
  bottom: 0,
  top: 0,
  // height: '60vh',
  borderRadius: "20px",
  // boxShadow: "0px 0px 10px rgba(1, 30, 48, 0.4)"
};

const center = {
  lat: 41.037419,
  lng: 28.951967,
};

export default function MapWorksite(props) {
  //check maps api load
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  });
  const options = isLoaded
    ? {
        styles: mapStyle,
        disableDefaultUI: true,
        zoomControl: true,
        zoomControlOptions: {
          position: window.google.maps.ControlPosition.TOP_RIGHT,
          style: {
            marginTop: "10px",
            marginRight: "10px",
            borderRadius: "8px",
            backgroundColor: "#fff",
            boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.3)",
          },
        },
      }
    : {};
  //object Lists
  const worksites = props.worksiteList;
  const selectedWorksite = props.selectedWorksite;

  const [selected, setSelected] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [currentPosition, setCurrentPosition] = useState(null);

  const [mapType, setMapType] = useState("roadmap");

  useEffect(() => {
    if (selectedWorksite && selectedWorksite !== selected) {
      setSelected(selectedWorksite);
      setSelectedType("worksite");
    } else {
      setSelected(null);
    }
  }, [selectedWorksite]);

  const handleWorksiteClick = (worksite) => {
    setSelected(worksite);
    setSelectedType("worksite");
    props.getSelectedWorkSite(worksite);
  };

  const handleMapTypeChange = () => {
    setMapType(mapType === "roadmap" ? "satellite" : "roadmap");
  };

  //get map object ref
  const mapRef = useRef(null);
  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);

  //get location position
  const success = (position) => {
    const { latitude, longitude } = position.coords;
    setCurrentPosition({ lat: latitude, lng: longitude });
    panTo({ lat: latitude, lng: longitude });
  };

  //zoom and set lat lng to map for any event
  const panTo = useCallback(({ lat, lng }) => {
    mapRef.current.panTo({ lat, lng });
    mapRef.current.setZoom(14);
  }, []);

  const formatTimestampToDate = (timestamp) => {
    const date = new Date(timestamp.seconds * 1000); // Timestamp saniye cinsinden geldiği için 1000 ile çarpıyoruz
    return date.toLocaleDateString();
  };

  if (loadError) return "Error Loading Maps";
  if (!isLoaded) return "Loading Maps";
  return (
    <div
      style={{
        position: "absolute",
        width: "100%",
        height: "calc(100% - 1px)",
        borderRadius: "20px",
      }}
    >
      <GoogleMap
        mapContainerStyle={mapWorksiteStyle}
        zoom={13}
        center={center}
        options={options}
        mapTypeId={mapType}
        onLoad={onMapLoad}
      >
        <>
          {worksites.map((worksite) => (
            <MarkerF
              key={worksite.id}
              position={{
                lat: worksite.geopoint && worksite.geopoint.latitude,
                lng: worksite.geopoint && worksite.geopoint.longitude,
              }}
              icon={{
                url: WorksiteIcon,
                scaledSize: new window.google.maps.Size(30, 30),
                origin: new window.google.maps.Point(0, 0),
                anchor: new window.google.maps.Point(15, 15),
              }}
              onClick={() => {
                handleWorksiteClick(worksite);
              }}
              visible={worksite.visible}
            />
          ))}

          {selected && selectedType === "worksite" && selected.id && (
            <InfoWindow
              position={{
                lat: selected.geopoint.latitude,
                lng: selected.geopoint.longitude,
              }}
              onCloseClick={() => {
                setSelected(null);
                setSelectedType(null);
                props.getSelectedWorkSite(null);
              }}
              style={{ boxShadow: "-5px 0 10px rgba(0, 0, 0, 0.4)" }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <h2
                  style={{
                    margin: "0px",
                    marginBottom: "5px",
                    color: "#ff9843",
                  }}
                >
                  {" "}
                  {selected.name}
                </h2>
                <h3
                  style={{ margin: "0px", marginBottom: "5px", color: "#000" }}
                >
                  {" "}
                  Başlangıç Tarihi: {formatTimestampToDate(selected.startDate)}
                </h3>
                <h3
                  style={{ margin: "0px", marginBottom: "5px", color: "#000" }}
                >
                  {" "}
                  Bitiş Tarihi: {formatTimestampToDate(selected.finishDate)}
                </h3>
                <Stack
                  sx={{
                    width: "100%",
                    pb: 2,
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "10px",
                  }}
                >
                  <Button
                    variant="contained"
                    onClick={() => props.getSelectedModal(selected, "shifts")}
                    sx={{
                      ...orangeButtonContent,
                      width: 100,
                      height: 30,
                      fontSize: "10px",
                    }}
                  >
                    Vardiyalar
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() =>
                      props.getSelectedModal(selected, "personnels")
                    }
                    sx={{
                      ...orangeButtonContent,
                      width: 100,
                      height: 30,
                      fontSize: "10px",
                    }}
                  >
                    Personeller
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => props.getSelectedModal(selected, "details")}
                    sx={{
                      ...orangeButtonContent,
                      bgcolor: "rgba(134, 167, 252, 0.9)",
                      width: 100,
                      height: 30,
                      fontSize: "10px",
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
              </div>
            </InfoWindow>
          )}
          {currentPosition && (
            <MarkerF color={"#011e30"} position={currentPosition} />
          )}
        </>
        <div
          className="location-button"
          onClick={() => navigator.geolocation.getCurrentPosition(success)}
        >
          <IconButton
            style={{
              backgroundColor: "#fff",
              boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.3)",
              marginRight: "10px",
              position: "absolute",
              top: 110,
              right: 5,
            }}
          >
            <BiCurrentLocation size={24} color="#011e30" />
          </IconButton>
        </div>
        <div className="maptype-button" onClick={handleMapTypeChange}>
          <Button
            style={{
              backgroundColor: "#fff",
              boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.3)",
              position: "absolute",
              top: 170,
              right: 15,
              color: "black",
              //marginRight: '10px'
            }}
          >
            {mapType === "roadmap" ? "Uydu Görünümü" : "Normal Harita"}
          </Button>
        </div>
      </GoogleMap>
    </div>
  );
}
