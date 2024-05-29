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
  paddingBottom: 10,
  height: "auto",
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
    transform: "scale(1.01)",
  },
};

export const clickButtonWhite = {
  boxShadow: "0px 0px 10px rgba(1, 30, 48, 0.4)",
  mb: 5,
  width: "45%",
  minHeight: "40px",
  height: "auto",
  textAlign: "center",
  bgcolor: "#ffffff",
  color: "#000000",
  borderRadius: "8px",
  fontFamily:
    "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif",
  fontSize: "auto",
  fontWeight: "600",
  zIndex: "100",
  "&:hover": {
    bgcolor: "#ceeafc",
    color: "#000000",
  },
};

export const isConfirmButton = {
  width: 100,
  height: 30,
  textAlign: "center",
  bgcolor: "rgba(134, 167, 252, 0.9)",
  color: "#fff",
  borderRadius: "50px",
  fontFamily: "Arial, Helvatica, sans-serif",
  fontSize: "14px",
  cursor: "pointer",
  textTransform: "inherit",
  "&:hover": {
    marginTop: "5px",
    bgcolor: "rgba(134, 167, 252, 0.9)",
    color: "#ffffff",
    boxShadow: "0px 0 10px rgba(52, 104, 192, 0.7)",
    transform: "scale(1.05)",
  },
};

export const isConfirmCard = {
  mb: 2,
  p: 1,
  width: "80%",
  maxWidth: "80%",
  height: "auto",
  backgroundColor: "rgba(255, 152, 67, 0.2)",
  borderRadius: "20px",
  boxShadow: "0px 0 10px rgba(52, 104, 192, 0.3)",
  transition: "transform 0.3s",
  overflow: "auto",
  "&:hover": {
    transform: "scale(1.05)",
  },
};

export const projectCardContent = {
  mb: 2,
  p: 1,
  width: "100%",
  height: "auto",
  backgroundColor: "rgba(255, 152, 67, 0.2)",
  borderRadius: "20px",
  boxShadow: "0px 0 10px rgba(52, 104, 192, 0.3)",
  transition: "transform 0.3s",
  "&:hover": {
    transform: "scale(1.03)",
  },
};

export const projectSliderCardContent = {
  minWidth: "250px",
  maxWidth: "90%",
  minHeight: "220px",
  height: "auto",
  backgroundColor: "rgba(255, 152, 67, 0.2)",
  borderRadius: "20px",
  boxShadow: "0px 0 10px rgba(52, 104, 192, 0.3)",
  transition: "transform 0.3s",
  "&:hover": {
    transform: "scale(1.01)",
  },
};

export const worksiteCardContent = {
  pl: 1,
  width: "100%",
  height: "180px",
  borderRadius: "20px",
  boxShadow: "0px 0 10px rgba(52, 104, 192, 0.3)",
  transition: "transform 0.3s",
  "&:hover": {
    transform: "scale(1.01)",
  },
};

export const worksiteSliderCardContent = {
  minWidth: "220px",
  maxWidth: "90%",
  minHeight: "150px",
  height: "auto",
  backgroundColor: "rgba(255, 152, 67, 0.2)",
  borderRadius: "20px",
  boxShadow: "0px 0 10px rgba(52, 104, 192, 0.3)",
  transition: "transform 0.3s",
  "&:hover": {
    transform: "scale(1.01)",
  },
};

export const teamsCardContent = {
  minWidth: "220px",
  maxWidth: "90%",
  minHeight: "150px",
  height: "150px",
  backgroundColor: "rgba(255, 152, 67, 0.2)",
  borderRadius: "20px",
  boxShadow: "0px 0 10px rgba(52, 104, 192, 0.3)",
  transition: "transform 0.3s",
  "&:hover": {
    transform: "scale(1.01)",
  },
};

export const companyCardContent = {
  mb: 2,
  p: 1,
  width: "100%",
  height: "auto",
  backgroundColor: "rgba(255, 152, 67, 0.2)",
  borderRadius: "20px",
  boxShadow: "0px 0 10px rgba(52, 104, 192, 0.3)",
  transition: "transform 0.3s",
  "&:hover": {
    transform: "scale(1.03)",
  },
};