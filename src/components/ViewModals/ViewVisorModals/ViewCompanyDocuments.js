import React, { useEffect, useState } from "react";
import "../viewModalStyle.scss";
import { orangeButtonContent } from "../../../style/utils";
import { Button, CircularProgress, Stack, Typography } from "@mui/material";
import { getCompanyDocuments } from "../../../config/firebase";
import ViewVisorCompanyDocumentsTable from "../../table/visor_table/ViewVisorCompanyDocumentsTable";

export default function ViewCompanyDocuments({
  isOpen,
  onClose,
  viewSelectedCompany,
}) {
  const [companyDocuments, setCompanyDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCompanyDocuments() {
      try {
        const documents = await getCompanyDocuments(viewSelectedCompany.id);
        setCompanyDocuments(documents);
      } catch (error) {
        console.error("Error fetching documents:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchCompanyDocuments();
  }, [isOpen]);

  console.log(viewSelectedCompany);
  console.log(companyDocuments);

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
              {companyDocuments && companyDocuments.length > 0 ? (
                <ViewVisorCompanyDocumentsTable documents={companyDocuments} />
              ) : (
                <Typography marginTop={10}>
                  Firmaya ait döküman bulunmamaktadır.
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
