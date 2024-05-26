import React, { useEffect, useState } from "react";
import "./viewModalStyle.scss";
import { orangeButtonContent } from "../../style/utils";
import { Button, CircularProgress, Stack, Typography } from "@mui/material";
import {
  getProjectInformationById,
  getCompanyTypeDocuments,
} from "../../config/firebase";
import ViewProjectDocumentsTable from "../table/documentsTable/ViewProjectDocumentsTable";

export default function ViewProjectDocuments({
  isOpen,
  onClose,
  viewSelectedProject,
}) {
  const [projectDocuments, setProjectDocuments] = useState([]);
  const [confirmationTrigger, setConfirmationTrigger] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProjectDocuments() {
      try {
        const documents = await getCompanyTypeDocuments("project");
        const filteredDocuments = documents.filter(
          (doc) => doc.projectId === viewSelectedProject.id
        );
        const projectDocs = filteredDocuments.map((doc) => ({
          projectData: {
            projectId: viewSelectedProject.id,
            projectCity: viewSelectedProject.city,
            projectName: viewSelectedProject.name,
            projectStartDate: viewSelectedProject.startDate,
            projectFinishDate: viewSelectedProject.finishDate,
          },
          documentData: doc,
        }));
        setProjectDocuments(projectDocs);
      } catch (error) {
        console.error("Error fetching documents:", error);
      } finally {
        setLoading(false);
      }
    }
    if (isOpen) {
      fetchProjectDocuments();
    }
  }, [isOpen]);

  console.log(projectDocuments);

  return (
    <div className="view-modal-overlay">
      <div className="view-modal-content">
        <div className="view-modal-subcontent">
          {loading ? (
            <Stack
              sx={{
                width: "100%",
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
              }}
            >
              <CircularProgress size={50} />
            </Stack>
          ) : (
            <Stack
              sx={{
                position: "relative",
                alignItems: "center",
              }}
            >
              {projectDocuments.length > 0 ? (
                <ViewProjectDocumentsTable
                  documents={projectDocuments}
                  confirmDocumentsTrigger={() => {
                    setConfirmationTrigger((prev) => !prev);
                  }}
                />
              ) : (
                <Typography marginTop={10}>
                  Projenize ait döküman bulunmamaktadır.
                </Typography>
              )}
            </Stack>
          )}
        </div>
        {/* close button */}
        <div className="view-modal-button-group">
          <Button
            variant="contained"
            onClick={onClose}
            sx={orangeButtonContent}
          >
            Kapat
          </Button>
        </div>
      </div>
    </div>
  );
}
