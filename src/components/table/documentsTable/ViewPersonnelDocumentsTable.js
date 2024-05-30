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
  Avatar,
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

export default function ViewPersonnelDocumentsTable({
  documents,
  confirmDocumentsTrigger,
}) {
  const [documentsData, setDocumentsData] = useState(documents);
  const [page, setPage] = useState(0);
  const [sortBy, setSortBy] = useState("userName");
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
      comparison = a.userData[sortBy].localeCompare(b.userData[sortBy]);
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
    setOpen(false);
    setSelectedDocument(null);
    confirmDocumentsTrigger();
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

  const getAvatarContent = (user) => {
    if (user.userImage && isValidUrl(user.userImage)) {
      return <Avatar src={user.userImage} />;
    } else {
      const initials = `${user.userName[0]}${user.userSurname[0]}`;
      return <Avatar>{initials}</Avatar>;
    }
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  return (
    <div style={{ width: "100%" }}>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Resim</TableCell>
              <TableCell>
                İsim
                <IconButton size="small" onClick={() => handleSort("userName")}>
                  <SortIcon />
                </IconButton>
              </TableCell>
              <TableCell>
                Soyisim
                <IconButton
                  size="small"
                  onClick={() => handleSort("userSurname")}
                >
                  <SortIcon />
                </IconButton>
              </TableCell>
              <TableCell>
                Döküman İsmi
                <IconButton size="small" onClick={() => handleSort("name")}>
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
                  <TableCell>{getAvatarContent(doc.userData)}</TableCell>
                  <TableCell>{doc.userData.userName}</TableCell>
                  <TableCell>{doc.userData.userSurname}</TableCell>
                  <TableCell>{doc.documentData.name}</TableCell>
                  <TableCell>
                    {formatTimestampToDate(doc.documentData.createdTime)}
                  </TableCell>
                  <TableCell>Personel Belgesi</TableCell>
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
                  Personellerinize ait mevcut Dökümanlar bulunmamaktadır.
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
