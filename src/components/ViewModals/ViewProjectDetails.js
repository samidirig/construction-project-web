import React, { useState } from "react";
import "./viewModalStyle.scss";
import { orangeButtonContent } from "../../style/utils";
import {
  Button,
  Typography,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import Image1 from "../../assets/images/project_background.PNG";
import { useWindowSizeWidth } from "../../config/hooks";
import CreateSpecificDocumentModal from "../CreateModals/CreateSpecificDocumentModal";

export default function ViewProjectDetails({
  isOpen,
  onClose,
  viewSelectedProject,
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const windowScreenWidth = useWindowSizeWidth();
  const [isCreateDocumentModalOpen, setIsCreateDocumentModalOpen] =
    useState(false);

  const formatTimestampToDate = (timestamp) => {
    const date = new Date(timestamp.seconds * 1000); // Assuming timestamp is a Firestore timestamp
    return date.toLocaleDateString();
  };

  const handleDeleteClick = () => {
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  const handleConfirmDelete = async () => {
    // await deleteProject(viewSelectedProject.id);
    setIsDialogOpen(false);
    onClose();
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
              src={viewSelectedProject.projectImg || Image1}
              alt="Worksite"
              className="view-modal-image-self"
            />
          </div>

          <div className="view-modal-subcontent">
            <Typography variant="h5" component="h2" sx={{ mt: 2 }}>
              <strong>{viewSelectedProject.name}</strong>
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body1">
                <strong>Şehir:</strong> {viewSelectedProject.city}
              </Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body1">
                <strong>Bütçe:</strong> ₺{viewSelectedProject.budget}
              </Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body1">
                <strong>Oluşturulma Tarihi:</strong>{" "}
                {viewSelectedProject.createdTime
                  ? formatTimestampToDate(viewSelectedProject.createdTime)
                  : "Belirsiz"}
              </Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body1">
                <strong>Başlangıç Tarihi:</strong>{" "}
                {viewSelectedProject.startDate
                  ? formatTimestampToDate(viewSelectedProject.startDate)
                  : "Belirsiz"}
              </Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body1">
                <strong>Bitiş Tarihi:</strong>{" "}
                {viewSelectedProject.finishDate
                  ? formatTimestampToDate(viewSelectedProject.finishDate)
                  : "Belirsiz"}
              </Typography>
            </Box>
          </div>
        </div>

        <div className="view-modal-button-group">
          <Button
            variant="contained"
            sx={{ ...orangeButtonContent, minWidth: "150px" }}
            onClick={() => console.log("Fotoğraf Düzenle clicked")}
          >
            Fotoğraf Düzenle
          </Button>
          <Button
            variant="contained"
            sx={{ ...orangeButtonContent, minWidth: "200px" }}
            onClick={handleOpenCreateDocumentModal}
          >
            Proje Belgesi Oluştur
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
            onClick={handleDeleteClick}
          >
            Projeyi Sil
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
        <DialogTitle>Projeyi Sil</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Projeinizi silerseniz aşağıdaki bilgileri KALICI olarak kaldırmış
            olacaksınız:
            <br />
            1- Bağlı olduğu Firmanız içerisinden,
            <br />
            2- Bağlı olduğu Şantiyeleri,
            <br />
            3- Bağlı olduğu Takımları,
            <br />
            4- Bağlı olduğu Vardiyaları,
            <br />
            5- Bağlı olduğu Proje Belgelerinizi,
            <br />
            6- Bağlı olduğu Proje Teslimatlarınızı,
            <br />
            7- Bağlı olduğu Personellerden proje ilişiğini,
            <br />
            <br />
            silmiş olursunuz kabul ediyor musunuz?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Hayır
          </Button>
          <Button onClick={handleConfirmDelete} color="primary" autoFocus>
            Evet
          </Button>
        </DialogActions>
      </Dialog>

      {/* document create modal */}
      {isCreateDocumentModalOpen && (
        <CreateSpecificDocumentModal
          isOpen={isCreateDocumentModalOpen}
          onClose={handleCloseCreateDocumentModal}
          documentType={"project"}
          selectedProject={viewSelectedProject}
          selectedWorksite={null}
          selectedUser={null}
        />
      )}
    </div>
  );
}
