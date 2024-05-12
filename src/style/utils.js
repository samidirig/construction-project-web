export const mainContent = {
  mt: 2,
  position: "relative",
  width: "100%",
  display: "flex",
  borderRadius: "20px",
  flexDirection: "row",
  alignItems: "flex-start",
  gap: "10px",
};

export const tableContent = {
  position: "relative",
  height: "auto",
  minHeight: 400,
  display: "flex",
  borderRadius: "20px",
  flexDirection: "column",
  alignItems: "center",
  boxShadow: "0px 0 10px rgba(52, 104, 192, 0.3)",
  "& > *": {
    width: "100%",
  },
};

export const tableContentHeader = {
  width: "100%",
  height: "60px",
  position: "absolute",
  top: 0,
  borderRadius: "20px 20px 0px 0px",
  px: "30px",
  mb: 2,
  backgroundColor: "rgba(255, 152, 67, 0.7)",
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
};

export const buttonContent = {
  width: 120,
  height: 40,
  textAlign: "center",
  bgcolor: "rgba(134, 167, 252, 0.9)",
  color: "#fff",
  borderRadius: "50px",
  fontFamily: "Arial, Helvatica, sans-serif",
  fontSize: "14px",
  cursor: "pointer",
  textTransform: "inherit",
  "&:hover": {
    bgcolor: "rgba(134, 167, 252, 0.7)",
    color: "#ffffff",
    boxShadow: "0px 0 10px rgba(52, 104, 192, 0.7)",
  },
};

export const orangeButtonContent = {
  width: 140,
  height: 40,
  textAlign: "center",
  bgcolor: "rgba(255, 152, 67, 0.9)",
  color: "#fff",
  borderRadius: "50px",
  fontFamily: "Arial, Helvatica, sans-serif",
  fontSize: "14px",
  cursor: "pointer",
  textTransform: "inherit",
  "&:hover": {
    bgcolor: "#FF9843",
    color: "#ffffff",
    boxShadow: "0px 0 10px rgba(52, 104, 192, 0.7)",
    transform: "scale(1.05)",
  },
};
