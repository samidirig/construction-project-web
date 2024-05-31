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
} from "@mui/material";
import SortIcon from "@mui/icons-material/Sort";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

export default function ViewVisorCompanyDocumentsTable({
  documents,
}) {
  const [documentsData, setDocumentsData] = useState(documents);
  const [page, setPage] = useState(0);
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
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
        a.createdTime.seconds - b.createdTime.seconds;
    } else {
      comparison = a[sortBy].localeCompare(b[sortBy]);
    }
    return sortOrder === "asc" ? comparison : -comparison;
  });

  const displayedDocuments = sortedDocuments.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

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
            {displayedDocuments && displayedDocuments.length > 0 ? (
              displayedDocuments.map((doc, index) => (
                <TableRow key={index}>
                  <TableCell>{doc.name}</TableCell>
                  <TableCell>
                    {formatTimestampToDate(doc.createdTime)}
                  </TableCell>
                  <TableCell>Firma Belgesi</TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => openDocument(doc.documentURL)}
                    >
                      <OpenInNewIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  Firmanıza ait mevcut Dökümanlar bulunamadı.
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
    </div>
  );
}
