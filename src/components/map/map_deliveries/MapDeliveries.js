import { React, useState, useCallback, useRef } from "react";
import {
  GoogleMap,
  useLoadScript,
  MarkerF,
  InfoWindow,
} from "@react-google-maps/api";
import mapStyle from "../mapStyle";
import DeliveryWait from "../../../assets/images/delivery_1.png";
import DeliveryWorking from "../../../assets/images/delivery_2.png";
import { BiCurrentLocation } from "react-icons/bi";
import { Button, IconButton } from "@mui/material";

const mapDeliveryStyle = {
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

export default function MapDeliveries({ deliveries }) {
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
  // const deliveries = props.deliveryList;
  // deliveries.map((delivery) => {console.log(delivery.receiverLoc.latitude)});
  // console.log(deliveries);

  const [selected, setSelected] = useState(null);
  const [currentPosition, setCurrentPosition] = useState(null);

  const [mapType, setMapType] = useState("roadmap");

  const handleDeliveryClick = (delivery) => {
    setSelected(delivery);
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
        mapContainerStyle={mapDeliveryStyle}
        zoom={13}
        center={center}
        options={options}
        mapTypeId={mapType}
        onLoad={onMapLoad}
      >
        <>
          {deliveries && deliveries.map(
              (delivery) =>
                !delivery.isDone && (
                  <MarkerF
                    key={delivery.id}
                    position={{
                      lat:
                        delivery.receiverLoc && delivery.receiverLoc.latitude,
                      lng:
                        delivery.receiverLoc && delivery.receiverLoc.longitude,
                    }}
                    icon={{
                      url: delivery.isDone ? DeliveryWait : DeliveryWorking,
                      scaledSize: new window.google.maps.Size(30, 30),
                      origin: new window.google.maps.Point(0, 0),
                      anchor: new window.google.maps.Point(15, 15),
                    }}
                    onClick={() => {
                      handleDeliveryClick(delivery);
                    }}
                    visible={delivery.visible}
                  />
                )
            )}

          {selected && selected.id && (
            <InfoWindow
              position={{
                lat: selected.receiverLoc.latitude,
                lng: selected.receiverLoc.longitude,
              }}
              onCloseClick={() => {
                setSelected(null);
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
                  {selected.description}
                </h2>
                <h3
                  style={{ margin: "0px", marginBottom: "5px", color: "#000" }}
                >
                  Alıcı Firma: {selected.receiverName}
                </h3>
                <h3
                  style={{ margin: "0px", marginBottom: "5px", color: "#000" }}
                >
                  Gönderici Firma: {selected.supplierName}
                </h3>
                <h3
                  style={{
                    margin: "0px",
                    marginBottom: "5px",
                    color: "rgba(134, 167, 252, 0.9)",
                  }}
                >
                  Sipariş Tarihi: {formatTimestampToDate(selected.createdTime)}
                </h3>
                <h3
                  style={{
                    margin: "0px",
                    marginBottom: "5px",
                    color: selected.finishTime
                      ? "rgba(134, 167, 252, 0.9)"
                      : "red",
                  }}
                >
                  {selected.finishTime
                    ? `Teslim Edildi: ${formatTimestampToDate(
                        selected.finishTime
                      )}`
                    : "Teslimat Sürüyor"}
                </h3>
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

// const [deliveryType, setDeliveryType] = useState(false);
// const handleDeliveryTypeChange = () => {
//   setDeliveryType(!deliveryType);
// };

// {deliveries.map((delivery) =>
//   // Teslimatın isDone değerine göre filtreleme yapılır
//   (deliveryType === false && !delivery.isDone) ||
//   (deliveryType === true && delivery.isDone) ? (
//     <MarkerF
//       key={delivery.id}
//       position={{
//         lat: delivery.receiverLoc && delivery.receiverLoc.latitude,
//         lng: delivery.receiverLoc && delivery.receiverLoc.longitude,
//       }}
//       icon={{
//         url: delivery.isDone ? DeliveryWait : DeliveryWorking,
//         scaledSize: new window.google.maps.Size(30, 30),
//         origin: new window.google.maps.Point(0, 0),
//         anchor: new window.google.maps.Point(15, 15),
//       }}
//       onClick={() => {
//         handleDeliveryClick(delivery);
//       }}
//       visible={delivery.visible}
//     />
//   ) : null
// )}

{
  /* <div className="maptype-button" onClick={handleDeliveryTypeChange}>
<Button
  style={{
    backgroundColor: "#fff",
    boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.3)",
    position: "absolute",
    top: 220,
    right: 15,
    color: "black",
    //marginRight: '10px'
  }}
>
  {deliveryType === false
    ? "Tamamlanan Teslimatlar"
    : "Bekleyen Teslimatlar"}
</Button>
</div> */
}
