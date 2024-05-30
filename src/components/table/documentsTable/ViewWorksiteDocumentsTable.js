import React, { useState } from "react";
import {
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  TablePagination,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";
import SortIcon from "@mui/icons-material/Sort";
import DeleteIcon from "@mui/icons-material/Delete";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { deleteCompanyDocument } from "../../../config/firebase";

export default function ViewWorksiteDocumentsTable({
  documents,
  confirmDocumentsTrigger,
}) {
  const [documentsData, setDocumentsData] = useState(documents);
  const [page, setPage] = useState(0);
  const [sortBy, setSortBy] = useState("worksiteName");
  const [sortOrder, setSortOrder] = useState("asc");
  const [open, setOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const rowsPerPage = 5;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleSort = (field) => {
    const isAsc = sortBy === field && sortOrder === "asc";
    setSortOrder(isAsc ? "desc" : "asc");
    setSortBy(field);
  };

  const sortedDocuments = [...documentsData].sort((a, b) => {
    let comparison = 0;
    if (sortBy === "createdTime") {
      comparison =
        a.documentData.createdTime.seconds - b.documentData.createdTime.seconds;
    } else {
      comparison = a.worksiteData[sortBy].localeCompare(b.worksiteData[sortBy]);
    }
    return sortOrder === "asc" ? comparison : -comparison;
  });

  const displayedDocuments = sortedDocuments.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleDeleteDocument = async (documentId, documentURL) => {
    try {
      if (documentId) {
        await deleteCompanyDocument(documentId, documentURL);
        handleUpdateDocumentDatas(documentId);
        handleClose();
        console.log("Document silindi " + documentId);
      }
    } catch (error) {
      console.error("There is an error while deleting document: " + error);
    }
  };

  const handleUpdateDocumentDatas = (documentId) => {
    if (documentId) {
      const updatedDocuments = documentsData.filter(
        (doc) => doc.documentData.id !== documentId
      );
      setDocumentsData(updatedDocuments);
    }
  };

  const handleClickOpen = (document) => {
    setSelectedDocument(document);
    setOpen(true);
  };

  const handleClose = () => {
    setSelectedDocument(null);
    confirmDocumentsTrigger();
    setOpen(false);
  };

  const formatTimestampToDate = (timestamp) => {
    const date = new Date(timestamp.seconds * 1000);
    return date.toLocaleString("tr-TR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const openDocument = (url) => {
    window.open(url, "_blank");
  };

  return (
    <div style={{ width: "100%" }}>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                Döküman İsmi
                <IconButton size="small" onClick={() => handleSort("name")}>
                  <SortIcon />
                </IconButton>
              </TableCell>
              <TableCell>
                Şantiye İsmi
                <IconButton
                  size="small"
                  onClick={() => handleSort("worksiteName")}
                >
                  <SortIcon />
                </IconButton>
              </TableCell>
              <TableCell>
                Şehir
                <IconButton
                  size="small"
                  onClick={() => handleSort("worksiteCity")}
                >
                  <SortIcon />
                </IconButton>
              </TableCell>
              <TableCell>
                Mevkii
                <IconButton
                  size="small"
                  onClick={() => handleSort("worksiteNeighborhood")}
                >
                  <SortIcon />
                </IconButton>
              </TableCell>
              <TableCell>
                Oluşturulma Tarihi
                <IconButton
                  size="small"
                  onClick={() => handleSort("createdTime")}
                >
                  <SortIcon />
                </IconButton>
              </TableCell>
              <TableCell>Belge Tipi</TableCell>
              <TableCell>Detay</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayedDocuments.length > 0 ? (
              displayedDocuments.map((doc, index) => (
                <TableRow key={index}>
                  <TableCell>{doc.documentData.name}</TableCell>
                  <TableCell>{doc.worksiteData.worksiteName}</TableCell>
                  <TableCell>{doc.worksiteData.worksiteCity}</TableCell>
                  <TableCell>{doc.worksiteData.worksiteNeighborhood}</TableCell>
                  <TableCell>
                    {formatTimestampToDate(doc.documentData.createdTime)}
                  </TableCell>
                  <TableCell>Şantiye Belgesi</TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => openDocument(doc.documentData.documentURL)}
                    >
                      <OpenInNewIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleClickOpen(doc.documentData)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  Şantiyelerinize ait mevcut Dökümanlar bulunmamaktadır.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={documentsData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={() => {}}
      />
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Dökümanı Kaldır</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {selectedDocument
              ? `${selectedDocument.name} dökümanını kaldırmak istediğinizden emin misiniz?`
              : ""}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Hayır</Button>
          <Button
            onClick={() =>
              handleDeleteDocument(
                selectedDocument.id,
                selectedDocument.documentURL
              )
            }
            color="primary"
          >
            Evet
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
