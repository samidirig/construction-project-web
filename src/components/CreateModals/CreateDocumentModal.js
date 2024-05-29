import React, { useEffect, useState } from "react";
import "./createModalStyle.scss";
import {
  Autocomplete,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { buttonContent, orangeButtonContent } from "../../style/utils";
import {
  createNewDocument,
  getCompanyByManagerId,
  getCompanyProjects,
  getCompanyWorksites,
  getDocumentType,
  getGivenUsersInformationByIds,
  uploadFileToFirebaseStorage,
} from "../../config/firebase";

export default function CreateDocumentModal({
  isOpen,
  onClose,
  confirmDocumentsTrigger,
}) {
  const [documentTypes, setDocumentTypes] = useState([
    { key: "project", value: "Proje Belgesi" },
    { key: "worksite", value: "Şantiye Belgesi" },
    { key: "user", value: "Personel Belgesi" },
    { key: "company", value: "Firma Belgesi" },
  ]);
  const [companyData, setCompanyData] = useState([]);
  const [worksitesData, setWorksitesData] = useState([]);
  const [projectsData, setProjectsData] = useState([]);
  const [usersData, setUsersData] = useState([]);

  const [selectedType, setSelectedType] = useState(null);
  const [selectedTypeId, setSelectedTypeId] = useState(null);
  const [selectedName, setSelectedName] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedWorksite, setSelectedWorksite] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const company = await getCompanyByManagerId();
        setCompanyData(company);
      } catch (error) {
        console.error("Error fetching suppliers:", error);
      }
    }
    fetchData();
  }, [isOpen]);

  useEffect(() => {
    async function fetchData() {
      try {
        if (selectedType === "user") {
          const personnels = await getGivenUsersInformationByIds(
            companyData.personnels
          );
          setUsersData(personnels || []);
        } else if (selectedType === "project") {
          const projects = await getCompanyProjects();
          setProjectsData(projects || []);
        } else if (selectedType === "worksite") {
          const worksites = await getCompanyWorksites();
          setWorksitesData(worksites || []);
        }
        setSelectedName(null);
        setSelectedProject(null);
        setSelectedWorksite(null);
        setSelectedUser(null);
        setSelectedFile(null);

        const documentTypeId = await getDocumentType(selectedType);
        setSelectedTypeId(documentTypeId);
      } catch (error) {
        console.error("Error fetching worksites:", error);
      }
    }

    fetchData();
  }, [selectedType]);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleCreateNewDocument = async () => {
    try {
      if (
        selectedTypeId &&
        (companyData || selectedProject || selectedWorksite || selectedUser)
      ) {
        const documentData = {
          companyId: companyData.id,
          createdTime: new Date(),
          documentType: selectedTypeId,
          documentURL: null,
          name: selectedName,
          projectId: selectedProject ? selectedProject.id : null,
          userId: selectedUser ? selectedUser.id : null,
          worksiteId: selectedWorksite ? selectedWorksite.id : null,
        };

        // Dosya yüklemesi
        if (selectedFile) {
          const filePath = `documents/${selectedTypeId}/${
            selectedProject?.id ||
            selectedWorksite?.id ||
            selectedUser?.id ||
            companyData?.id
          }/${selectedFile.name}`;
          const fileURL = await uploadFileToFirebaseStorage(
            selectedFile,
            filePath
          );
          documentData.documentURL = fileURL;
        }

        await createNewDocument(documentData);
        confirmDocumentsTrigger();
        onClose();
      }
    } catch (error) {
      console.error("Error creating a new document:", error);
    }
  };

  const documentData = {
    companyId: companyData.id,
    createdTime: new Date(),
    documentType: selectedTypeId,
    documentURL: null,
    name: selectedName,
    projectId: selectedProject ? selectedProject.id : null,
    userId: selectedUser ? selectedUser.id : null,
    worksiteId: selectedWorksite ? selectedWorksite.id : null,
  };

  console.log(documentData);
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-input-group">
          {/* documentType select */}
          <div className="modal-input-content">
            <FormControl fullWidth>
              <InputLabel id="type-label">Belge Tipi</InputLabel>
              <Select
                labelId="type-label"
                id="type"
                label="Belge Tipi"
                value={selectedType || "Seçiniz"}
                onChange={(event) => setSelectedType(event.target.value)}
              >
                <MenuItem value="Seçiniz" disabled>
                  Seçiniz
                </MenuItem>
                {documentTypes.length > 0 &&
                  documentTypes.map((document, index) => (
                    <MenuItem key={index} value={document.key}>
                      {document.value}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </div>

          {selectedType && selectedType === "company" && (
            <>
              {/* worksite select */}
              <div className="modal-input-content">
                <Typography>Firmanız: {companyData.name}</Typography>
              </div>
            </>
          )}

          {selectedType && selectedType === "project" && (
            <>
              {/* project select */}
              <div className="modal-input-content">
                <FormControl fullWidth>
                  <InputLabel id="project-label">Döküman Projesi</InputLabel>
                  <Select
                    labelId="project-label"
                    id="project"
                    label="Döküman Projesi"
                    value={selectedProject || "Seçiniz"}
                    onChange={(event) => setSelectedProject(event.target.value)}
                  >
                    <MenuItem value="Seçiniz" disabled>
                      Seçiniz
                    </MenuItem>
                    {projectsData.length === 0 ? (
                      <MenuItem disabled>
                        Projeniz yok Döküman ekleyemezsiniz!
                      </MenuItem>
                    ) : (
                      projectsData &&
                      projectsData.length > 0 &&
                      projectsData.map((project) => (
                        <MenuItem key={project.id} value={project}>
                          {project.name}
                        </MenuItem>
                      ))
                    )}
                  </Select>
                </FormControl>
              </div>
            </>
          )}

          {selectedType && selectedType === "worksite" && (
            <>
              {/* worksite select */}
              <div className="modal-input-content">
                <FormControl fullWidth>
                  <InputLabel id="worksite-label">Döküman Şantiyesi</InputLabel>
                  <Select
                    labelId="worksite-label"
                    id="worksite"
                    label="Döküman Şantiyesi"
                    value={selectedWorksite || "Seçiniz"}
                    onChange={(event) =>
                      setSelectedWorksite(event.target.value)
                    }
                  >
                    <MenuItem value="Seçiniz" disabled>
                      Seçiniz
                    </MenuItem>
                    {worksitesData.length === 0 ? (
                      <MenuItem disabled>
                        Şantiyeniz yok Döküman ekleyemezsiniz!
                      </MenuItem>
                    ) : (
                      worksitesData &&
                      worksitesData.length > 0 &&
                      worksitesData.map((worksite) => (
                        <MenuItem key={worksite.id} value={worksite}>
                          {worksite.name}
                        </MenuItem>
                      ))
                    )}
                  </Select>
                </FormControl>
              </div>
            </>
          )}

          {selectedType && selectedType === "user" && (
            <>
              {/* personnel select */}
              <div className="modal-input-content">
                <FormControl fullWidth>
                  <InputLabel id="personnel-label">
                    Döküman Personeli
                  </InputLabel>
                  <Select
                    labelId="personnel-label"
                    id="personnel"
                    label="Döküman Personeli"
                    value={selectedUser || "Seçiniz"}
                    onChange={(event) => setSelectedUser(event.target.value)}
                  >
                    <MenuItem value="Seçiniz" disabled>
                      Seçiniz
                    </MenuItem>
                    {usersData.length === 0 ? (
                      <MenuItem disabled>
                        Personeliniz yok Döküman ekleyemezsiniz!
                      </MenuItem>
                    ) : (
                      usersData &&
                      usersData.length > 0 &&
                      usersData.map((user) => (
                        <MenuItem key={user.id} value={user}>
                          {user.name}
                        </MenuItem>
                      ))
                    )}
                  </Select>
                </FormControl>
              </div>
            </>
          )}

          {selectedType && (
            <>
              {/* documment name */}
              <div className="modal-input-content">
                <TextField
                  id="name-detail"
                  label="Döküman İsmi"
                  variant="outlined"
                  required
                  fullWidth
                  helperText="Maksimum 30 Karakter."
                  inputProps={{ maxLength: 30 }}
                  value={selectedName || ""}
                  onChange={(event) => setSelectedName(event.target.value)}
                />
              </div>
              {/* file upload */}
              <div className="modal-input-content">
                <Button
                  variant="contained"
                  component="label"
                  sx={{
                    ...orangeButtonContent,
                    bgcolor: "rgba(134, 167, 252, 0.9)",
                    width: 100,
                    height: 30,
                    fontSize: "12px",
                    "&:hover": {
                      bgcolor: "rgba(134, 167, 252, 0.7)",
                      color: "#ffffff",
                      boxShadow: "0px 0 10px rgba(52, 104, 192, 0.7)",
                    },
                  }}
                >
                  PDF Yükle
                  <input
                    type="file"
                    accept="application/pdf"
                    hidden
                    onChange={handleFileChange}
                  />
                </Button>
                {selectedFile && <Typography>{selectedFile.name}</Typography>}
              </div>
            </>
          )}
        </div>

        <div className="modal-button-group">
          <Button
            variant="contained"
            onClick={onClose}
            sx={orangeButtonContent}
          >
            Kapat
          </Button>
          <Button
            variant="contained"
            onClick={handleCreateNewDocument}
            sx={{
              ...buttonContent,
              width: "150px",
            }}
            disabled={
              !(
                (selectedType === "project" &&
                  companyData.id &&
                  selectedFile &&
                  selectedProject &&
                  !selectedWorksite &&
                  !selectedUser) ||
                (selectedType === "company" &&
                  companyData.id &&
                  selectedFile &&
                  !selectedProject &&
                  !selectedWorksite &&
                  !selectedUser) ||
                (selectedType === "worksite" &&
                  companyData.id &&
                  selectedFile &&
                  selectedWorksite &&
                  !selectedProject &&
                  !selectedUser) ||
                (selectedType === "user" &&
                  companyData.id &&
                  selectedFile &&
                  selectedUser &&
                  !selectedProject &&
                  !selectedWorksite)
              )
            }
          >
            Döküman Oluştur
          </Button>
        </div>
      </div>
    </div>
  );
}
