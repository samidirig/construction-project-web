import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { logOut } from "../redux/authSlice";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import {
  getAuthUserInformation,
  getCompanyByManagerId,
  getCompanyTypeDocuments,
  updateCompanyInformation,
  updateUserInformation,
} from "../config/firebase";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Tooltip,
  IconButton,
  Stack,
  Typography,
  TextField,
  Avatar,
  CircularProgress,
} from "@mui/material";
import {
  orangeButtonContent,
  tableContent,
  tableContentHeader,
} from "../style/utils";
import Background1 from "../assets/images/profile_background.PNG";
import { useWindowSizeWidth } from "../config/hooks";
import CreateSpecificDocumentModal from "../components/CreateModals/CreateSpecificDocumentModal";
import ViewCompanyDocumentsTable from "../components/table/documentsTable/ViewCompanyDocumentsTable";

export default function Profile() {
  const dispatch = useDispatch();
  const [userData, setUserData] = useState({});
  const [tempUserData, setTempUserData] = useState({});
  const [companyData, setCompanyData] = useState({});
  const [companyDocuments, setCompanyDocuments] = useState([]);
  const [tempCompanyData, setTempCompanyData] = useState({});
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [confirmationTrigger, setConfirmationTrigger] = useState(false);
  const [confirmSignOutDialogOpen, setConfirmSignOutDialogOpen] =
    useState(false);
  const windowScreenWidth = useWindowSizeWidth();
  const [isCreateDocumentModalOpen, setIsCreateDocumentModalOpen] =
    useState(false);

  const handleLogout = () => {
    setConfirmSignOutDialogOpen(true);
  };
  const handleConfirmLogout = () => {
    localStorage.removeItem("companyId");
    dispatch(logOut());
    setConfirmSignOutDialogOpen(false);
  };

  useEffect(() => {
    async function fetchUserData() {
      try {
        const user = await getAuthUserInformation();
        setUserData(user);
      } catch (error) {
        console.error("Error fetching documents:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchUserData();
  }, []);

  useEffect(() => {
    async function fetchCompanyData() {
      try {
        const company = await getCompanyByManagerId();
        setCompanyData(company);
      } catch (error) {
        console.error("Error fetching documents:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchCompanyData();
  }, []);

  useEffect(() => {
    async function fetchCompanyDocuments() {
      try {
        const documents = await getCompanyTypeDocuments("company");
        const companyDocs = documents.map((doc) => ({
          companyData: companyData,
          documentData: doc,
        }));
        setCompanyDocuments(companyDocs);
      } catch (error) {
        console.error("Error fetching documents:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchCompanyDocuments();
  }, [confirmationTrigger]);

  const handleSaveProfile = async () => {
    try {
      let phone = companyData.phone;
      if (phone && !phone.startsWith("90")) {
        phone = `90${phone}`;
      }
      await updateUserInformation(userData.name, userData.surname, phone);
      await updateCompanyInformation(
        companyData.id,
        companyData.name,
        companyData.email,
        phone
      );
      setIsEditMode(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleEditProfile = () => {
    setTempUserData(userData);
    setTempCompanyData(companyData);
    setIsEditMode(true);
  };

  const handleCancelEditProfile = () => {
    if (tempUserData && tempCompanyData) {
      setUserData(tempUserData);
      setCompanyData(tempCompanyData);
    } else {
      setIsEditMode(false);
      window.location.reload();
    }
    setTempUserData({});
    setIsEditMode(false);
  };

  const handleOpenCreateDocumentModal = () => {
    setIsCreateDocumentModalOpen(true);
  };

  const handleCloseCreateDocumentModal = () => {
    setIsCreateDocumentModalOpen(false);
  };

  return (
    <div>
      <div>
        <div>
          {/* top image content */}
          <div
            style={{
              position: "absolute",
              width: "98%",
              height: 400,
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
                  "linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.8))",
                zIndex: 2,
              }}
            ></div>

            <Stack sx={{ zIndex: 2, paddingLeft: "15%" }}>
              <Typography variant="h3" color={"#fff"}>
                Merhaba {userData && userData.name}
              </Typography>
              <Typography variant="h6" color={"#fff"}>
                Bilgileriniz ve firmanızı buradan düzenleyebilirsiniz.
              </Typography>
              <Stack
                sx={{
                  mt: 5,
                  mb: 2,
                  display: "flex",
                  flexDirection: "row",
                  flexWrap: "wrap",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                {isEditMode ? (
                  <>
                    <Button
                      variant="contained"
                      onClick={handleSaveProfile}
                      sx={{
                        width: 150,
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
                      }}
                    >
                      Bilgileri Kaydet
                    </Button>
                    <Button
                      variant="contained"
                      onClick={handleCancelEditProfile}
                      sx={{
                        width: 150,
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
                      }}
                    >
                      İptal
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="contained"
                    onClick={handleEditProfile}
                    sx={{
                      width: 150,
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
                    }}
                  >
                    Profili Düzenle
                  </Button>
                )}

                <Button
                  variant="contained"
                  onClick={handleOpenCreateDocumentModal}
                  sx={{
                    width: "200px",
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
                  }}
                >
                  Firma Belgesi Oluştur
                </Button>

                <Button
                  variant="contained"
                  onClick={handleLogout}
                  sx={{
                    alignItems: "center",
                    width: 150,
                    height: 40,
                    textAlign: "center",
                    backgroundColor: "rgba(138, 0, 0, 1)",
                    color: "#fff",
                    borderRadius: "50px",
                    fontFamily: "Arial, Helvatica, sans-serif",
                    fontSize: "14px",
                    textTransform: "capitalize",
                    "&:hover": {
                      backgroundColor: "rgba(138, 0, 0, 0.8)",
                      color: "#ffffff",
                      boxShadow: "0px 0 10px rgba(52, 104, 192, 0.7)",
                      transform: "scale(1.05)",
                    },
                  }}
                >
                  <IconButton sx={{ marginRight: 1 }}>
                    <ExitToAppIcon sx={{ color: "#ffffff" }} />
                  </IconButton>
                  Çıkış Yap
                </Button>

                <Dialog
                  open={confirmSignOutDialogOpen}
                  onClose={() => setConfirmSignOutDialogOpen(false)}
                >
                  <DialogContent>
                    Çıkış yapmak istediğinizden emin misiniz?
                  </DialogContent>
                  <DialogActions>
                    <Button
                      sx={{ color: "#8a0000" }}
                      onClick={handleConfirmLogout}
                    >
                      Çıkış Yap
                    </Button>
                    <Button
                      sx={{ color: "#FF9843" }}
                      onClick={() => setConfirmSignOutDialogOpen(false)}
                    >
                      İptal
                    </Button>
                  </DialogActions>
                </Dialog>
              </Stack>
            </Stack>
          </div>

          {/* bottom content */}
          <Stack
            sx={{
              position: "absolute",
              px: "5%",
              pb: 5,
              mt: 40,
              width: "98%",
              height: "auto",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 5,
              zIndex: 3,
            }}
          >
            <Stack
              sx={{
                width: "100%",
                height: windowScreenWidth > 900 ? "50%" : "auto",
                display: "flex",
                flexDirection: "row",
                flexWrap: windowScreenWidth > 900 ? "nowrap" : "wrap",
                alignItems: "center",
                gap: 5,
              }}
            >
              {/* middle company content */}
              <Stack
                sx={{
                  pb: 5,
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                  borderRadius: "20px",
                  backgroundColor: "#fff",
                  width: windowScreenWidth > 900 ? "50%" : "100%",
                  height: "100%",
                  boxShadow: "0px 0 10px rgba(52, 104, 192, 0.5)",
                }}
              >
                <Stack
                  sx={{
                    width: "100%",
                    height: "60px",
                    borderRadius: "20px 20px 0px 0px",
                    px: "30px",
                    mb: 2,
                    backgroundColor: "rgba(255, 152, 67, 0.9)",
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography variant="h5" sx={{ color: "#fff" }}>
                    Firmam
                  </Typography>
                </Stack>

                <Stack
                  sx={{
                    width: "100%",
                    height: "auto",
                    px: "30px",
                    mb: 2,
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Tooltip title={companyData.name} arrow>
                    <Avatar
                      sx={{
                        width: 100,
                        height: 100,
                        backgroundColor: "rgba(52, 104, 192, 0.3)",
                        textTransform: "uppercase",
                        color: "#011e30",
                      }}
                      src={
                        companyData.profileImg &&
                        companyData.profileImg.startsWith("http")
                          ? companyData.profileImg
                          : ""
                      }
                    >
                      {companyData.profileImg &&
                        ((!companyData.profileImg ||
                          !companyData.profileImg.startsWith("http")) &&
                        companyData.name
                          ? companyData.name
                              .split(" ")
                              .map((word) => word[0])
                              .join("")
                          : "A")}
                    </Avatar>
                  </Tooltip>
                  <Stack
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "10px",
                      pl: 5,
                    }}
                  >
                    <Typography variant="h6" sx={{ color: "grey" }}>
                      {companyData.name}
                    </Typography>
                    {isEditMode && (
                      <Button
                        variant="contained"
                        onClick={() => {}}
                        sx={{
                          ...orangeButtonContent,
                          bgcolor: "rgba(134, 167, 252, 0.9)",
                          width: 150,
                          height: 30,
                          fontSize: "12px",
                          "&:hover": {
                            bgcolor: "rgba(134, 167, 252, 0.7)",
                            color: "#ffffff",
                            boxShadow: "0px 0 10px rgba(52, 104, 192, 0.7)",
                          },
                        }}
                      >
                        Fotoğraf Güncelle
                      </Button>
                    )}
                  </Stack>
                </Stack>

                <Typography variant="h6" sx={{ pl: 5, color: "grey" }}>
                  Firma Bilgileri
                </Typography>

                <Stack
                  sx={{
                    width: "100%",
                    height: "auto",
                    display: "flex",
                    flexDirection: "row",
                    gap: "10px",
                    px: 5,
                  }}
                >
                  <TextField
                    label="Firma Email"
                    value={companyData.email || ""}
                    onChange={(e) =>
                      setCompanyData((prevData) => ({
                        ...prevData,
                        email: e.target.value,
                      }))
                    }
                    fullWidth
                    margin="none"
                    disabled={!isEditMode}
                  />
                  <TextField
                    label="Firma Telefon"
                    value={companyData.phone || "Kayıtlı Değil"}
                    onChange={(e) => {
                      let newValue = e.target.value.replace(/\D/g, ""); // Sadece rakam karakterlerini alır
                      if (newValue.startsWith("90")) {
                        newValue = newValue.slice(0, 12); // "90" ile başlıyorsa, 12 karakter kabul eder
                      } else {
                        newValue = newValue.slice(0, 10); // "90" ile başlamıyorsa, 10 karakter kabul eder
                      }
                      setCompanyData((prevData) => ({
                        ...prevData,
                        phone: newValue,
                      }));
                    }}
                    fullWidth
                    margin="none"
                    disabled={!isEditMode}
                  />
                </Stack>

                <Stack
                  sx={{
                    width: "100%",
                    height: "auto",
                    display: "flex",
                    flexDirection: "row",
                    gap: "10px",
                    px: 5,
                  }}
                >
                  <TextField
                    label="Firma İsim"
                    value={companyData.name || ""}
                    onChange={(e) =>
                      setCompanyData((prevData) => ({
                        ...prevData,
                        name: e.target.value,
                      }))
                    }
                    fullWidth
                    margin="normal"
                    disabled={!isEditMode}
                  />
                  <TextField
                    label="Yönetici"
                    value={userData.name + userData.surname || ""}
                    fullWidth
                    margin="normal"
                    disabled
                  />
                </Stack>
              </Stack>

              {/* middle profile content */}
              <Stack
                sx={{
                  pb: 5,
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                  borderRadius: "20px",
                  backgroundColor: "#fff",
                  width: windowScreenWidth > 900 ? "50%" : "100%",
                  height: "100%",
                  boxShadow: "0px 0 10px rgba(52, 104, 192, 0.5)",
                }}
              >
                <Stack
                  sx={{
                    width: "100%",
                    height: "60px",
                    borderRadius: "20px 20px 0px 0px",
                    px: "30px",
                    mb: 2,
                    backgroundColor: "rgba(255, 152, 67, 0.9)",
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography variant="h5" sx={{ color: "#fff" }}>
                    Bilgilerim
                  </Typography>
                </Stack>

                <Stack
                  sx={{
                    width: "100%",
                    height: "auto",
                    px: "30px",
                    mb: 5,
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Tooltip title={userData.name + " " + userData.surname} arrow>
                    <Avatar
                      sx={{
                        width: 100,
                        height: 100,
                        backgroundColor: "rgba(52, 104, 192, 0.3)",
                        textTransform: "uppercase",
                        color: "#011e30",
                      }}
                    >
                      {"A"}
                      {"A"}
                    </Avatar>
                  </Tooltip>

                  <Stack
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "10px",
                      pl: 5,
                    }}
                  >
                    <Typography variant="h6" sx={{ color: "grey" }}>
                      {userData.role === "companyManager"
                        ? "Yönetici"
                        : "Belirsiz"}
                    </Typography>
                    {isEditMode && (
                      <Button
                        variant="contained"
                        onClick={() => {}}
                        sx={{
                          ...orangeButtonContent,
                          bgcolor: "rgba(134, 167, 252, 0.9)",
                          width: 150,
                          height: 30,
                          fontSize: "12px",
                          "&:hover": {
                            bgcolor: "rgba(134, 167, 252, 0.7)",
                            color: "#ffffff",
                            boxShadow: "0px 0 10px rgba(52, 104, 192, 0.7)",
                          },
                        }}
                      >
                        Fotoğraf Güncelle
                      </Button>
                    )}
                  </Stack>
                </Stack>

                <Typography variant="h6" sx={{ pl: 5, color: "grey" }}>
                  Kullanıcı Bilgileri
                </Typography>

                <Stack
                  sx={{
                    width: "100%",
                    height: "auto",
                    display: "flex",
                    flexDirection: "row",
                    gap: "10px",
                    px: 5,
                  }}
                >
                  <TextField
                    label="İsim"
                    value={userData.name || ""}
                    onChange={(e) =>
                      setUserData((prevData) => ({
                        ...prevData,
                        name: e.target.value,
                      }))
                    }
                    fullWidth
                    margin="none"
                    disabled={!isEditMode}
                  />
                  <TextField
                    label="Soyisim"
                    value={userData.surname || ""}
                    onChange={(e) =>
                      setUserData((prevData) => ({
                        ...prevData,
                        surname: e.target.value,
                      }))
                    }
                    fullWidth
                    margin="none"
                    disabled={!isEditMode}
                  />
                </Stack>

                <Stack
                  sx={{
                    width: "100%",
                    height: "auto",
                    display: "flex",
                    flexDirection: "row",
                    gap: "10px",
                    px: 5,
                  }}
                >
                  <TextField
                    label="Telefon Numarası"
                    value={userData.phone || "Kayıtlı Değil"}
                    onChange={(e) => {
                      let newValue = e.target.value.replace(/\D/g, ""); // Sadece rakam karakterlerini alır
                      if (newValue.startsWith("90")) {
                        newValue = newValue.slice(0, 12); // "90" ile başlıyorsa, 12 karakter kabul eder
                      } else {
                        newValue = newValue.slice(0, 10); // "90" ile başlamıyorsa, 10 karakter kabul eder
                      }
                      setUserData((prevData) => ({
                        ...prevData,
                        phone: newValue,
                      }));
                    }}
                    fullWidth
                    margin="none"
                    disabled={!isEditMode}
                  />
                  <TextField
                    label="Email"
                    value={userData.email || ""}
                    fullWidth
                    margin="none"
                    disabled
                  />
                </Stack>
              </Stack>
            </Stack>

            {/* middle table content */}
            <Stack
              sx={{
                ...tableContent,
                width: "100%",
              }}
            >
              <Stack sx={tableContentHeader}>
                <Typography variant="h5" sx={{ color: "#fff" }}>
                  Firma Belgeleri
                </Typography>
              </Stack>

              {loading ? (
                <CircularProgress sx={{ mt: 20 }} size={50} />
              ) : (
                <Stack
                  sx={{
                    position: "relative",
                    alignItems: "center",
                    top: "65px",
                  }}
                >
                  {companyDocuments.length > 0 ? (
                    <ViewCompanyDocumentsTable
                      documents={companyDocuments}
                      confirmDocumentsTrigger={() => {
                        setConfirmationTrigger((prev) => !prev);
                      }}
                    />
                  ) : (
                    <Typography marginTop={10}>
                      Firmanıza ait mevcut Dökümanlar bulunamadı.
                    </Typography>
                  )}
                </Stack>
              )}
            </Stack>
          </Stack>
        </div>
      </div>

      {/* document create modal */}
      {isCreateDocumentModalOpen && (
        <CreateSpecificDocumentModal
          isOpen={isCreateDocumentModalOpen}
          onClose={handleCloseCreateDocumentModal}
          documentType={"company"}
          selectedProject={null}
          selectedWorksite={null}
          selectedUser={null}
        />
      )}
    </div>
  );
}
