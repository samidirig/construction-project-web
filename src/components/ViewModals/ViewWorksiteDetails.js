import React, { useState } from "react";
import "./viewModalStyle.scss";
import { orangeButtonContent, buttonContent } from "../../style/utils";
import {
  Button,
  Typography,
  Box,
  TextField,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import Image1 from "../../assets/images/worksite_background.PNG";
import { useWindowSizeWidth } from "../../config/hooks";
import { deleteWorksite } from "../../config/firebase";
import { Timestamp } from "firebase/firestore";
import CreateSpecificDocumentModal from "../CreateModals/CreateSpecificDocumentModal";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

export default function ViewWorksiteDetails({
  isOpen,
  onClose,
  viewSelectedWorksite,
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [worksiteData, setWorksiteData] = useState(viewSelectedWorksite);
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedFinishDate, setSelectedFinishDate] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [tempWorksiteData, setTempWorksiteData] = useState(null);
  const windowScreenWidth = useWindowSizeWidth();
  const [isStartCalendarVisible, setIsStartCalendarVisible] = useState(false);
  const [isFinishCalendarVisible, setIsFinishCalendarVisible] = useState(false);
  const [isCreateDocumentModalOpen, setIsCreateDocumentModalOpen] =
    useState(false);
  // console.log(selectedStartDate);
  // console.log("Başlangıç: " + worksiteData.startDate);
  // console.log("Bitiş: " + worksiteData.finishDate);

  console.log(worksiteData);

  const formatTimestampToDate = (timestamp) => {
    const date = new Date(timestamp.seconds * 1000);
    return date.toISOString().split("T")[0]; // YYYY-MM-DD format
    // return date.toLocaleDateString();
  };

  const handleSaveWorksite = async () => {
    try {
      // const startDate = Timestamp.fromDate(worksiteData.startDate);
      // const finishDate = Timestamp.fromDate(worksiteData.finishDate);
      // await updateWorksiteInformation(
      //   worksiteData.name,
      //   startDate,
      //   finishDate
      // );
      console.log("yeni: " + worksiteData);
      
      setIsStartCalendarVisible(false);
      setIsFinishCalendarVisible(false);
      setIsEditMode(false);
    } catch (error) {
      console.error("Error updating worksite:", error);
    }
  };

  const handleEditWorksite = () => {
    setTempWorksiteData(worksiteData);
    setSelectedStartDate(formatTimestampToDate(worksiteData.startDate));
    setSelectedFinishDate(formatTimestampToDate(worksiteData.finishDate));
    setIsEditMode(true);
  };

  const handleCancelEditWorksite = () => {
    if (tempWorksiteData) {
      setWorksiteData(tempWorksiteData);
    } else {
      setIsEditMode(false);
      setIsStartCalendarVisible(false);
      setIsFinishCalendarVisible(false);
      window.location.reload();
    }
    setTempWorksiteData({});
    setIsEditMode(false);
  };

  const handleDeleteClick = () => {
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  const handleConfirmDelete = async () => {
    await deleteWorksite(worksiteData.id);
    setIsDialogOpen(false);
    onClose();
  };

  const handleOpenCreateDocumentModal = () => {
    setIsCreateDocumentModalOpen(true);
  };

  const handleCloseCreateDocumentModal = () => {
    setIsCreateDocumentModalOpen(false);
  };

  const toggleStartCalendarVisibility = () => {
    setIsStartCalendarVisible((prev) => !prev);
  };

  const toggleFinishCalendarVisibility = () => {
    setIsFinishCalendarVisible((prev) => !prev);
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
              src={worksiteData.worksiteImg || Image1}
              alt="Worksite"
              className="view-modal-image-self"
            />
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
          </div>

          <div className="view-modal-subcontent">
            {isEditMode ? (
              <TextField
                label="Şantiye İsmi"
                value={worksiteData.name || ""}
                onChange={(e) =>
                  setWorksiteData((prevData) => ({
                    ...prevData,
                    name: e.target.value,
                  }))
                }
                fullWidth
                margin="normal"
                disabled={!isEditMode}
              />
            ) : (
              <Typography variant="h5" component="h2" sx={{ mt: 2 }}>
                <strong>{worksiteData.name} Şantiyesi</strong>
              </Typography>
            )}

            <Box sx={{ mb: 2 }}>
              <Typography variant="body1">
                <strong>Proje:</strong>
              </Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body1">
                <strong>Adres:</strong>{" "}
                {`${worksiteData.city}, ${worksiteData.district}, ${worksiteData.neighborhood}`}
              </Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body1">
                <strong>Oluşturulma Tarihi:</strong>{" "}
                {formatTimestampToDate(worksiteData.createdTime)}
              </Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              {isEditMode ? (
                <>
                  <TextField
                    label="Başlangıç Tarihi"
                    value={formatTimestampToDate(worksiteData.startDate)}
                    fullWidth
                    required
                    margin="normal"
                    // disabled={!isEditMode}
                    onChange={() => {}}
                    InputProps={{
                      startAdornment: (
                        <IconButton onClick={toggleStartCalendarVisibility}>
                          <CalendarMonthIcon
                            sx={{ color: "rgba(255, 152, 67, 0.9)" }}
                          />
                        </IconButton>
                      ),
                    }}
                  />
                  {isStartCalendarVisible && (
                    <>
                      <Calendar
                        sx={{ color: "rgba(255, 152, 67, 0.9)" }}
                        onChange={(e) => {
                          setSelectedStartDate(e);
                          setWorksiteData((prevData) => ({
                            ...prevData,
                            startDate: Timestamp.fromDate(e),
                          }));
                        }}
                        value={
                          selectedStartDate
                            ? selectedStartDate
                            : new Date(worksiteData.startDate.seconds * 1000)
                        }
                      />
                      <Button
                        sx={{ width: "auto", height: "auto" }}
                        onClick={toggleStartCalendarVisibility}
                      >
                        Kapat
                      </Button>
                    </>
                  )}
                </>
              ) : (
                <Typography variant="body1">
                  <strong>Başlangıç Tarihi:</strong>{" "}
                  {formatTimestampToDate(worksiteData.startDate)}
                </Typography>
              )}
            </Box>
            <Box sx={{ mb: 2 }}>
              {isEditMode ? (
                <>
                  <TextField
                    label="Bitiş Tarihi"
                    value={formatTimestampToDate(worksiteData.finishDate)}
                    fullWidth
                    required
                    margin="normal"
                    // disabled={!isEditMode}
                    onChange={() => {}}
                    InputProps={{
                      startAdornment: (
                        <IconButton onClick={toggleFinishCalendarVisibility}>
                          <CalendarMonthIcon
                            sx={{ color: "rgba(255, 152, 67, 0.9)" }}
                          />
                        </IconButton>
                      ),
                    }}
                  />
                  {isFinishCalendarVisible && (
                    <>
                      <Calendar
                        sx={{ color: "rgba(255, 152, 67, 0.9)" }}
                        onChange={(e) => {
                          setSelectedFinishDate(e);
                          setWorksiteData((prevData) => ({
                            ...prevData,
                            finishDate: Timestamp.fromDate(e),
                          }));
                        }}
                        value={
                          selectedFinishDate
                            ? selectedFinishDate
                            : new Date(worksiteData.finishDate.seconds * 1000)
                        }
                      />
                      <Button
                        sx={{ width: "auto", height: "auto" }}
                        onClick={toggleFinishCalendarVisibility}
                      >
                        Kapat
                      </Button>
                    </>
                  )}
                </>
              ) : (
                <Typography variant="body1">
                  <strong>Bitiş Tarihi:</strong>{" "}
                  {formatTimestampToDate(worksiteData.finishDate)}
                </Typography>
              )}
            </Box>
          </div>
        </div>

        <div className="view-modal-button-group">
          {isEditMode ? (
            <>
              <Button
                variant="contained"
                sx={{ ...orangeButtonContent, minWidth: "150px" }}
                onClick={handleSaveWorksite}
              >
                Kaydet
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
                onClick={handleCancelEditWorksite}
              >
                İptal
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="contained"
                sx={{ ...orangeButtonContent, minWidth: "150px" }}
                onClick={handleEditWorksite}
              >
                Düzenle
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
            </>
          )}
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
