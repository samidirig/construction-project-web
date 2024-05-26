import React, { useEffect, useState } from "react";
import "./viewModalStyle.scss";
import { orangeButtonContent, buttonContent } from "../../style/utils";
import {
  Button,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import Image1 from "../../assets/images/personnel_background.PNG";
import { useWindowSizeWidth } from "../../config/hooks";
import {
  deletePersonelActiveWorksite,
  getGivenWorksitesInformationByIds,
  getWorksiteInformationById,
  setPersonelActiveWorksite,
  setPersonelRole,
} from "../../config/firebase";
import CreateSpecificDocumentModal from "../CreateModals/CreateSpecificDocumentModal";

export default function ViewPersonnelDetails({
  isOpen,
  onClose,
  viewSelectedPersonnel,
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedWorksite, setSelectedWorksite] = useState(null);
  const [workingWorksite, setWorkingWorksite] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);
  const [selectedViewRole, setSelectedViewRole] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [worksitesData, setWorksitesData] = useState([]);
  const windowScreenWidth = useWindowSizeWidth();
  const [isCreateDocumentModalOpen, setIsCreateDocumentModalOpen] =
    useState(false);

  useEffect(() => {
    if (viewSelectedPersonnel) {
      const unsubscribe = getGivenWorksitesInformationByIds(
        viewSelectedPersonnel.worksiteIds,
        setWorksitesData
      );
      setSelectedViewRole(viewSelectedPersonnel.role);
      return () => unsubscribe && unsubscribe();
    }
  }, [isOpen, viewSelectedPersonnel]);

  const handleDeleteClick = () => {
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  const handleConfirmDelete = async () => {
    // await deletePersonnel(viewSelectedPersonnel.id);
    setIsDialogOpen(false);
    onClose();
  };

  const handleChangeActiveWorksite = async () => {
    if (selectedWorksite && selectedWorksite !== workingWorksite) {
      await setPersonelActiveWorksite(
        viewSelectedPersonnel.id,
        selectedWorksite.id
      );
      setWorkingWorksite(selectedWorksite);
      console.log("yeni activeWorksite:" + selectedWorksite.name);
      setIsEditMode(false);
    }
  };

  const handleChangeRole = async () => {
    if (selectedRole) {
      await setPersonelRole(viewSelectedPersonnel.id, selectedRole);
      console.log("yeni Role:" + selectedRole);
      setSelectedViewRole(selectedRole);
      setSelectedRole(null);
      setIsEditMode(false);
    }
  };

  const handleDeleteActiveWorksite = async () => {
    await deletePersonelActiveWorksite(viewSelectedPersonnel.id);
    setWorkingWorksite(null);
    setIsEditMode(false);
  };

  const handleOpenCreateDocumentModal = () => {
    setIsCreateDocumentModalOpen(true);
  };

  const handleCloseCreateDocumentModal = () => {
    setIsCreateDocumentModalOpen(false);
  };

  if (!isOpen) return null;
  return (
    <div className="view-modal-overlay">
      <div className="view-modal-content">
        <div
          className="view-modal-image"
          style={{
            flexDirection: windowScreenWidth < 900 ? "column" : "row",
          }}
        >
          <div className="view-modal-image-content">
            <img
              src={viewSelectedPersonnel.profileImg || Image1}
              alt="Worksite"
              className="view-modal-image-self"
            />
          </div>

          <div className="view-modal-subcontent">
            <Typography variant="h5" component="h2" sx={{ mt: 2 }}>
              <strong>
                {viewSelectedPersonnel.name} {viewSelectedPersonnel.surname}
              </strong>
            </Typography>
            {isEditMode ? (
              <Box
                sx={{
                  mb: 2,
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                <Typography variant="body1">
                  <strong>Personel Statü Değiştir:</strong>
                </Typography>
                <FormControl fullWidth>
                  <InputLabel id="role-label">
                    Personel Statü Değiştir
                  </InputLabel>
                  <Select
                    labelId="role-label"
                    id="role"
                    label="Aktif Şantiye Değiştir"
                    value={selectedRole || "Seçiniz"}
                    onChange={(event) => setSelectedRole(event.target.value)}
                  >
                    <MenuItem value="Seçiniz" disabled>
                      Seçiniz
                    </MenuItem>
                    <MenuItem value="personnel">Personel</MenuItem>
                    <MenuItem value="driver">Sürücü</MenuItem>
                  </Select>
                </FormControl>{" "}
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "start",
                    gap: "10px",
                  }}
                >
                  <Button
                    variant="contained"
                    sx={{
                      ...buttonContent,
                      width: "auto",
                      height: "30px",
                      fontSize: "11px",
                    }}
                    onClick={() => {
                      setIsEditMode(false);
                      setSelectedRole(null);
                    }}
                  >
                    İptal
                  </Button>{" "}
                  <Button
                    variant="contained"
                    sx={{
                      ...buttonContent,
                      width: "auto",
                      height: "30px",
                      fontSize: "11px",
                    }}
                    onClick={() => handleChangeRole()}
                  >
                    Kaydet
                  </Button>
                </Box>
              </Box>
            ) : (
              <Box sx={{ mb: 2 }}>
                <Typography variant="body1">
                  <strong>Rol:</strong> {selectedViewRole}
                </Typography>
              </Box>
            )}
            <Box sx={{ mb: 2 }}>
              <Typography variant="body1">
                <strong>Email:</strong> {viewSelectedPersonnel.email}
              </Typography>
            </Box>

            {selectedViewRole === "personnel" &&
              (isEditMode ? (
                <Box
                  sx={{
                    mb: 2,
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                  }}
                >
                  <Typography variant="body1">
                    <strong>Aktif Şantiye Değiştir:</strong>
                  </Typography>
                  <FormControl fullWidth>
                    <InputLabel id="worksite-label">
                      Aktif Şantiye Değiştir
                    </InputLabel>
                    <Select
                      labelId="worksite-label"
                      id="worksite"
                      label="Aktif Şantiye Değiştir"
                      value={selectedWorksite || "Seçiniz"}
                      onChange={(event) =>
                        setSelectedWorksite(event.target.value)
                      }
                    >
                      <MenuItem value="Seçiniz" disabled>
                        Seçiniz
                      </MenuItem>
                      {worksitesData.length > 0 &&
                        worksitesData.map((worksite) => (
                          <MenuItem key={worksite.id} value={worksite}>
                            {worksite.name}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>{" "}
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "start",
                      gap: "10px",
                    }}
                  >
                    <Button
                      variant="contained"
                      sx={{
                        ...buttonContent,
                        width: "auto",
                        height: "30px",
                        fontSize: "11px",
                      }}
                      onClick={() => {
                        setIsEditMode(false);
                        setSelectedWorksite(null);
                      }}
                    >
                      İptal
                    </Button>{" "}
                    <Button
                      variant="contained"
                      sx={{
                        ...buttonContent,
                        width: "auto",
                        height: "30px",
                        fontSize: "11px",
                      }}
                      onClick={() => handleChangeActiveWorksite()}
                    >
                      Kaydet
                    </Button>
                    <Button
                      variant="contained"
                      sx={{
                        ...buttonContent,
                        width: "auto",
                        height: "30px",
                        fontSize: "11px",
                        bgcolor: "rgba(199,0,0, 0.8)",
                        "&:hover": {
                          bgcolor: "rgba(199,0,0, 0.7)",
                          color: "#ffffff",
                          boxShadow: "0px 0 10px rgba(52, 104, 192, 0.7)",
                        },
                      }}
                      onClick={() => handleDeleteActiveWorksite()}
                      disabled={!workingWorksite}
                    >
                      Aktif Şantiye Kaldır
                    </Button>
                  </Box>
                </Box>
              ) : (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body1">
                    <strong>Aktif Çalıştığı Şantiye:</strong>{" "}
                    {workingWorksite
                      ? workingWorksite.name
                      : "Aktif Şantiye Bulunmamaktadır."}
                  </Typography>
                </Box>
              ))}
          </div>
        </div>

        <div className="view-modal-button-group">
          <Button
            variant="contained"
            sx={{ ...orangeButtonContent, minWidth: "150px" }}
            onClick={() => setIsEditMode(true)}
          >
            Personel Düzenle
          </Button>
          <Button
            variant="contained"
            sx={{ ...orangeButtonContent, minWidth: "200px" }}
            onClick={handleOpenCreateDocumentModal}
          >
            Personel Belgesi Oluştur
          </Button>
          <Button
            variant="contained"
            sx={{
              ...orangeButtonContent,
              minWidth: "150px",
              bgcolor: "rgba(199,0,0, 0.8)",
              "&:hover": {
                bgcolor: "rgba(199,0,0, 0.7)",
                color: "#ffffff",
                boxShadow: "0px 0 10px rgba(52, 104, 192, 0.7)",
              },
            }}
            onClick={() => {}}
          >
            Personel Sil
          </Button>
          <Button
            variant="contained"
            sx={{
              ...orangeButtonContent,
              bgcolor: "rgba(134, 167, 252, 0.9)",
              "&:hover": {
                bgcolor: "rgba(134, 167, 252, 0.7)",
                color: "#ffffff",
                boxShadow: "0px 0 10px rgba(52, 104, 192, 0.7)",
              },
            }}
            onClick={onClose}
          >
            Kapat
          </Button>
        </div>
      </div>

      <Dialog open={isDialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Şantiyeyi Sil</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Personelinizi silerseniz aşağıdaki bilgileri KALICI olarak kaldırmış
            olacaksınız:
            <br />
            1- Bağlı olduğu Projeler içerisinden,
            <br />
            2- Bağlı olduğu Takımlardan,
            <br />
            3- Bağlı olduğu Vardiyaları,
            <br />
            4- Bağlı olduğu tüm Belgeleri,
            <br />
            5- Bağlı olduğu Şantiyelerden,
            <br />
            <br />
            personel ilişiğini silmeyi Kabul ediyor musunuz?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Hayır
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color="rgba(199,0,0, 0.7)"
            autoFocus
          >
            Evet
          </Button>
        </DialogActions>
      </Dialog>

      {/* document create modal */}
      {isCreateDocumentModalOpen && (
        <CreateSpecificDocumentModal
          isOpen={isCreateDocumentModalOpen}
          onClose={handleCloseCreateDocumentModal}
          documentType={"personnel"}
          selectedProject={null}
          selectedWorksite={null}
          selectedUser={viewSelectedPersonnel}
        />
      )}
    </div>
  );
}
