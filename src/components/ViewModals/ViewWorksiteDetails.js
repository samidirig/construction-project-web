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
import Image1 from "../../assets/images/worksite_background.PNG";
import { useWindowSizeWidth } from "../../config/hooks";
import { deleteWorksite } from "../../config/firebase";
import CreateSpecificDocumentModal from "../CreateModals/CreateSpecificDocumentModal";

export default function ViewWorksiteDetails({
  isOpen,
  onClose,
  viewSelectedWorksite,
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
    await deleteWorksite(viewSelectedWorksite.id);
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
              src={viewSelectedWorksite.worksiteImg || Image1}
              alt="Worksite"
              className="view-modal-image-self"
            />
          </div>

          <div className="view-modal-subcontent">
            <Typography variant="h5" component="h2" sx={{ mt: 2 }}>
              <strong>{viewSelectedWorksite.name} Şantiyesi</strong>
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body1">
                <strong>Proje:</strong>
              </Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body1">
                <strong>Adres:</strong>{" "}
                {`${viewSelectedWorksite.city}, ${viewSelectedWorksite.district}, ${viewSelectedWorksite.neighborhood}`}
              </Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body1">
                <strong>Oluşturulma Tarihi:</strong>{" "}
                {formatTimestampToDate(viewSelectedWorksite.createdTime)}
              </Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body1">
                <strong>Başlangıç Tarihi:</strong>{" "}
                {formatTimestampToDate(viewSelectedWorksite.startDate)}
              </Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body1">
                <strong>Bitiş Tarihi:</strong>{" "}
                {formatTimestampToDate(viewSelectedWorksite.finishDate)}
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
            Şantiye Belgesi Oluştur
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
            Şantiyeyi Sil
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
            Şantiyenizi silerseniz aşağıdaki bilgileri KALICI olarak kaldırmış
            olacaksınız:
            <br />
            1- Bağlı olduğu Proje içerisinden,
            <br />
            2- Bağlı olduğu Takımları,
            <br />
            3- Bağlı olduğu Vardiyaları,
            <br />
            4- Bağlı olduğu tüm Belgelerinizi,
            <br />
            5- Bağlı olduğu Personellerden şantiye ilişiğini,
            <br />
            <br />
            Kabul ediyor musunuz?
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
          documentType={"worksite"}
          selectedProject={null}
          selectedWorksite={viewSelectedWorksite}
          selectedUser={null}
        />
      )}
    </div>
  );
}
