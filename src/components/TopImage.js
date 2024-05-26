import React from "react";
import { orangeButtonContent } from "../style/utils";
import { Stack, Typography } from "@mui/material";

export default function TopImage({ imagePath, companyName, page }) {
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "auto",
        minHeight: 90,
        display: "flex",
        borderRadius: "50px",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "center",
      }}
    >
      <img
        src={imagePath}
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
          background: "linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.8))",
          zIndex: 2,
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
        <Typography variant="h4" fontSize={"30px"} color={"#fff"} gutterBottom>
          {companyName} {page}
        </Typography>
      </Stack>
    </div>
  );
}
