import React, { useState } from "react";
import "./viewModalStyle.scss";
import { orangeButtonContent } from "../../style/utils";
import {
  Button,
  Typography,
  Box,
  TextField,
  IconButton,
  OutlinedInput,
  InputLabel,
  FormControl,
  InputAdornment,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import Image1 from "../../assets/images/project_background.PNG";
import { useWindowSizeWidth } from "../../config/hooks";
import CreateSpecificDocumentModal from "../CreateModals/CreateSpecificDocumentModal";
import { deleteProject, updateProjectInformation } from "../../config/firebase";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { Timestamp } from "firebase/firestore";

export default function ViewProjectDetails({
  isOpen,
  onClose,
  viewSelectedProject,
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const windowScreenWidth = useWindowSizeWidth();
  const [isCreateDocumentModalOpen, setIsCreateDocumentModalOpen] =
    useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [projectData, setProjectData] = useState(viewSelectedProject);
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedFinishDate, setSelectedFinishDate] = useState(null);
  const [tempProjectData, setTempProjectData] = useState(null);
  const [isStartCalendarVisible, setIsStartCalendarVisible] = useState(false);
  const [isFinishCalendarVisible, setIsFinishCalendarVisible] = useState(false);

  const formatTimestampToDate = (timestamp) => {
    const date = new Date(timestamp.seconds * 1000); // Assuming timestamp is a Firestore timestamp
    return date.toISOString().split("T")[0];
  };

  const handleSaveProject = async () => {
    try {
      const projectId = projectData.id;
      await updateProjectInformation(
        projectId,
        projectData.name,
        projectData.startDate,
        projectData.finishDate,
        projectData.budget
      );

      setIsStartCalendarVisible(false);
      setIsFinishCalendarVisible(false);
      setIsEditMode(false);
    } catch (error) {
      console.error("Error updating project:", error);
    }
  };

  const handleEditProject = () => {
    setTempProjectData(projectData);
    setSelectedStartDate(formatTimestampToDate(projectData.startDate));
    setSelectedFinishDate(formatTimestampToDate(projectData.finishDate));
    setIsEditMode(true);
  };

  const handleCancelEditProject = () => {
    if (tempProjectData) {
      setProjectData(tempProjectData);
    } else {
      setIsEditMode(false);
      setIsStartCalendarVisible(false);
      setIsFinishCalendarVisible(false);
      window.location.reload();
    }
    setTempProjectData({});
    setIsEditMode(false);
  };

  const handleDeleteClick = () => {
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  const handleConfirmDelete = async () => {
    await deleteProject(projectData.id);
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
              src={projectData.projectImage || Image1}
              alt="Project"
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
                label="Proje İsmi"
                value={projectData.name || ""}
                onChange={(e) =>
                  setProjectData((prevData) => ({
                    ...prevData,
                    name: e.target.value,
                  }))
                }
                fullWidth
                margin="normal"
              />
            ) : (
              <Typography variant="h5" component="h2" sx={{ mt: 2 }}>
                <strong>{projectData.name}</strong>
              </Typography>
            )}

            <Box sx={{ mb: 2 }}>
              <Typography variant="body1">
                <strong>Şehir:</strong> {projectData.city}
              </Typography>
            </Box>

            <Box sx={{ mb: 2 }}>
              {isEditMode ? (
                <FormControl fullWidth>
                  <InputLabel htmlFor="outlined-adornment-amount">
                    Bütçe
                  </InputLabel>
                  <OutlinedInput
                    id="outlined-adornment-amount"
                    startAdornment={
                      <InputAdornment position="start">₺</InputAdornment>
                    }
                    value={projectData.budget || ""}
                    onChange={(e) =>
                      setProjectData((prevData) => ({
                        ...prevData,
                        budget: e.target.value
                          .replace(/\D/, "")
                          .substring(0, 9),
                      }))
                    }
                    inputProps={{ inputMode: "numeric", pattern: "[0-5]*" }}
                    label="Bütçe"
                  />
                </FormControl>
              ) : (
                <Typography variant="body1">
                  <strong>Bütçe:</strong> ₺{projectData.budget}
                </Typography>
              )}
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body1">
                <strong>Oluşturulma Tarihi:</strong>{" "}
                {projectData.createdTime
                  ? formatTimestampToDate(projectData.createdTime)
                  : "Belirsiz"}
              </Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              {isEditMode ? (
                <>
                  <TextField
                    label="Başlangıç Tarihi"
                    value={formatTimestampToDate(projectData.startDate)}
                    fullWidth
                    required
                    margin="normal"
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
                          setProjectData((prevData) => ({
                            ...prevData,
                            startDate: Timestamp.fromDate(e),
                          }));
                        }}
                        value={
                          selectedStartDate
                            ? selectedStartDate
                            : new Date(projectData.startDate.seconds * 1000)
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
                  {formatTimestampToDate(projectData.startDate)}
                </Typography>
              )}
            </Box>
            <Box sx={{ mb: 2 }}>
              {isEditMode ? (
                <>
                  <TextField
                    label="Bitiş Tarihi"
                    value={formatTimestampToDate(projectData.finishDate)}
                    fullWidth
                    required
                    margin="normal"
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
                          setProjectData((prevData) => ({
                            ...prevData,
                            finishDate: Timestamp.fromDate(e),
                          }));
                        }}
                        value={
                          selectedFinishDate
                            ? selectedFinishDate
                            : new Date(projectData.finishDate.seconds * 1000)
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
                  {formatTimestampToDate(projectData.finishDate)}
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
                onClick={handleSaveProject}
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
                onClick={handleCancelEditProject}
              >
                İptal
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="contained"
                sx={{ ...orangeButtonContent, minWidth: "150px" }}
                onClick={handleEditProject}
              >
                Düzenle
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
            </>
          )}
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
            6- Bağlı olduğu Personellerden proje ilişiğini,
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
          selectedProject={projectData}
          selectedWorksite={null}
          selectedUser={null}
        />
      )}
    </div>
  );
}
