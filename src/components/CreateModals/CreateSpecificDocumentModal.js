import React, { useEffect, useState } from "react";
import "./createModalStyle.scss";
import {
  Button,
  TextField,
  Typography,
} from "@mui/material";
import { buttonContent, orangeButtonContent } from "../../style/utils";
import {
  createNewDocument,
  getCompanyByManagerId,
  getDocumentType,
  uploadFileToFirebaseStorage,
} from "../../config/firebase";

export default function CreateSpecificDocumentModal({
  isOpen,
  onClose,
  documentType,
  selectedProject,
  selectedWorksite,
  selectedUser,
}) {
  const [companyData, setCompanyData] = useState([]);

  const [selectedTypeId, setSelectedTypeId] = useState(null);
  const [selectedName, setSelectedName] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const company = await getCompanyByManagerId();
        setCompanyData(company);
      } catch (error) {
        console.error("Error fetching CompanyData:", error);
      }
    }
    fetchData();
  }, [isOpen]);

  useEffect(() => {
    async function fetchData() {
      try {
        if (documentType) {
          setSelectedFile(null);
          const documentTypeId = await getDocumentType(documentType);
          setSelectedTypeId(documentTypeId);
        }
      } catch (error) {
        console.error("Error fetching worksites:", error);
      }
    }

    fetchData();
  }, [isOpen]);

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
          {documentType && documentType === "company" && (
            <>
              {/* worksite select */}
              <div className="modal-input-content">
                <Typography>Firmanız: {companyData.name}</Typography>
              </div>
            </>
          )}

          {documentType && (
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
                <Button variant="contained" component="label">
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
                (documentType === "project" &&
                  companyData.id &&
                  selectedFile &&
                  selectedProject &&
                  !selectedWorksite &&
                  !selectedUser) ||
                (documentType === "company" &&
                  companyData.id &&
                  selectedFile &&
                  !selectedProject &&
                  !selectedWorksite &&
                  !selectedUser) ||
                (documentType === "worksite" &&
                  companyData.id &&
                  selectedFile &&
                  selectedWorksite &&
                  !selectedProject &&
                  !selectedUser) ||
                (documentType === "personnel" &&
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
