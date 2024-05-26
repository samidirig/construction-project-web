import React, { useEffect, useState } from "react";
import {
  getCompanyAllDocuments,
  getCompanyByManagerId,
} from "../config/firebase";
import { Button, CircularProgress, Stack, Typography } from "@mui/material";
import Background1 from "../assets/images/document_background.PNG";
import { useWindowSizeWidth } from "../config/hooks";
import {
  orangeButtonContent,
  tableContent,
  tableContentHeader,
} from "../style/utils";
import ViewCompanyDocumentsTable from "../components/table/documentsTable/ViewCompanyDocumentsTable";
import ViewProjectDocumentsTable from "../components/table/documentsTable/ViewProjectDocumentsTable";
import ViewWorksiteDocumentsTable from "../components/table/documentsTable/ViewWorksiteDocumentsTable";
import ViewPersonnelDocumentsTable from "../components/table/documentsTable/ViewPersonnelDocumentsTable";
import CreateDocumentModal from "../components/CreateModals/CreateDocumentModal";
import TopImage from "../components/TopImage";

export default function Documents() {
  const windowScreenWidth = useWindowSizeWidth();
  const [documentsData, setDocumentsData] = useState([]);
  const [companyDocuments, setCompanyDocuments] = useState([]);
  const [projectDocuments, setProjectDocuments] = useState([]);
  const [worksiteDocuments, setWorksiteDocuments] = useState([]);
  const [personnelDocuments, setPersonnelDocuments] = useState([]);
  const [companyData, setCompanyData] = useState({});
  const [loading, setLoading] = useState(true);
  const [confirmationTrigger, setConfirmationTrigger] = useState(false);
  const [isCreateDocumentModalOpen, setIsCreateDocumentModalOpen] =
    useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const company = await getCompanyByManagerId();
        setCompanyData(company || []);
      } catch (error) {
        console.error("Error fetching documents:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = () => {
      getCompanyAllDocuments((documents) => {
        if (documents) {
          setDocumentsData(documents);

          // Filtreleme işlemi
          const companyDocs = documents
            .filter(
              (doc) =>
                doc.companyData &&
                !doc.projectData &&
                !doc.worksiteData &&
                !doc.userData
            )
            .map((doc) => ({
              companyData: doc.companyData,
              documentData: doc.documentData,
            }));

          const projectDocs = documents
            .filter((doc) => doc.projectData)
            .map((doc) => ({
              projectData: doc.projectData,
              documentData: doc.documentData,
            }));

          const worksiteDocs = documents
            .filter((doc) => doc.worksiteData)
            .map((doc) => ({
              worksiteData: doc.worksiteData,
              documentData: doc.documentData,
            }));

          const personnelDocs = documents
            .filter((doc) => doc.userData)
            .map((doc) => ({
              userData: doc.userData,
              documentData: doc.documentData,
            }));

          setCompanyDocuments(companyDocs);
          setProjectDocuments(projectDocs);
          setWorksiteDocuments(worksiteDocs);
          setPersonnelDocuments(personnelDocs);
        }
        setLoading(false);
      });
    };

    fetchData();
  }, [confirmationTrigger]);

  const handleOpenCreateDocumentModal = () => {
    setIsCreateDocumentModalOpen(true);
  };

  const handleCloseCreateDocumentModal = () => {
    setIsCreateDocumentModalOpen(false);
    setConfirmationTrigger((prev) => !prev);
  };

  return (
    <div>
      {/* top image content */}
      <TopImage
        imagePath={Background1}
        companyName={companyData.name}
        page={"Belge Yönetim"}
      />
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "auto",
          minHeight: 50,
          borderRadius: "50px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Stack
          sx={{
            zIndex: 2,
            mt: "20px",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            flexWrap: "wrap",
            gap: "50px",
          }}
        >
          <Button
            variant="contained"
            onClick={handleOpenCreateDocumentModal}
            sx={{ ...orangeButtonContent, minWidth: "150px" }}
          >
            Döküman Oluştur
          </Button>
        </Stack>
      </div>

      {/* main content */}
      <div
        style={{
          display: "flex",
          height: "100%",
          flexDirection: "column",
          justifyContent: "space-around",
          gap: "20px",
          marginTop: "20px",
          paddingBottom: "50px",
        }}
      >
        {/* company documents table */}
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

        {/* project documents table */}
        <Stack
          sx={{
            ...tableContent,
            width: "100%",
          }}
        >
          <Stack sx={tableContentHeader}>
            <Typography variant="h5" sx={{ color: "#fff" }}>
              Proje Belgeleri
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
              {projectDocuments.length > 0 ? (
                <ViewProjectDocumentsTable
                  documents={projectDocuments}
                  confirmDocumentsTrigger={() => {
                    setConfirmationTrigger((prev) => !prev);
                  }}
                />
              ) : (
                <Typography marginTop={10}>
                  Projelerinize ait mevcut Dökümanlar bulunamadı.
                </Typography>
              )}
            </Stack>
          )}
        </Stack>

        {/* worksite documents table */}
        <Stack
          sx={{
            ...tableContent,
            width: "100%",
          }}
        >
          <Stack sx={tableContentHeader}>
            <Typography variant="h5" sx={{ color: "#fff" }}>
              Şantiye Belgeleri
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
              {worksiteDocuments.length > 0 ? (
                <ViewWorksiteDocumentsTable
                  documents={worksiteDocuments}
                  confirmDocumentsTrigger={() => {
                    setConfirmationTrigger((prev) => !prev);
                  }}
                />
              ) : (
                <Typography marginTop={10}>
                  Şantiyelerinize ait mevcut Dökümanlar bulunamadı.
                </Typography>
              )}
            </Stack>
          )}
        </Stack>

        {/* personnel documents table */}
        <Stack
          sx={{
            ...tableContent,
            width: "100%",
          }}
        >
          <Stack sx={tableContentHeader}>
            <Typography variant="h5" sx={{ color: "#fff" }}>
              Personel Belgeleri
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
              {personnelDocuments.length > 0 ? (
                <ViewPersonnelDocumentsTable
                  documents={personnelDocuments}
                  confirmDocumentsTrigger={() => {
                    setConfirmationTrigger((prev) => !prev);
                  }}
                />
              ) : (
                <Typography marginTop={10}>
                  Personellerinize ait mevcut Dökümanlar bulunamadı.
                </Typography>
              )}
            </Stack>
          )}
        </Stack>
      </div>

      {/* team create modal */}
      {isCreateDocumentModalOpen && (
        <CreateDocumentModal
          isOpen={isCreateDocumentModalOpen}
          onClose={handleCloseCreateDocumentModal}
          confirmDocumentsTrigger={() => {
            setConfirmationTrigger((prev) => !prev);
          }}
        />
      )}
    </div>
  );
}
