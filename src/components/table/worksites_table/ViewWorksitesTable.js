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
} from "@mui/material";
import SortIcon from "@mui/icons-material/Sort";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { formatTimestampToDate } from "../../../common/utils";
import ViewWorksiteDetails from "../../ViewModals/ViewWorksiteDetails";

export default function ViewWorksitesTable({ worksites }) {
  const [viewSelectedWorksite, setViewSelectedWorksite] = useState(null);
  const [isWorksiteDetailsModalOpen, setIsWorksiteDetailsModalOpen] =
    useState(false);
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

  const sortedWorksites = [...worksites].sort((a, b) => {
    let comparison = 0;
    if (sortBy === "startDate" || sortBy === "finishDate") {
      comparison = a[sortBy].seconds - b[sortBy].seconds;
    } else {
      comparison = a[sortBy].localeCompare(b[sortBy]);
    }
    return sortOrder === "asc" ? comparison : -comparison;
  });

  const displayedWorksites = sortedWorksites.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const getAvatarContent = (worksite) => {
    if (worksite.worksiteImage && isValidUrl(worksite.worksiteImage)) {
      return <Avatar src={worksite.worksiteImage} />;
    } else {
      const initials = worksite.name
        .split(" ")
        .map((word) => word[0])
        .join("");
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

  const handleOpenWorksiteDetailsModal = (worksite) => {
    setViewSelectedWorksite(worksite);
    setIsWorksiteDetailsModalOpen(true);
  };

  const handleCloseWorksiteDetailsModal = () => {
    setIsWorksiteDetailsModalOpen(false);
    setViewSelectedWorksite(null);
  };
  return (
    <div style={{ width: "100%" }}>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              <TableCell>
                Şantiye Adı
                <IconButton size="small" onClick={() => handleSort("name")}>
                  <SortIcon />
                </IconButton>
              </TableCell>
              <TableCell>
                Başlangıç Tarihi
                <IconButton
                  size="small"
                  onClick={() => handleSort("startDate")}
                >
                  <SortIcon />
                </IconButton>
              </TableCell>
              <TableCell>
                Bitiş Tarihi
                <IconButton
                  size="small"
                  onClick={() => handleSort("finishDate")}
                >
                  <SortIcon />
                </IconButton>
              </TableCell>
              <TableCell>
                Şehir
                <IconButton size="small" onClick={() => handleSort("city")}>
                  <SortIcon />
                </IconButton>
              </TableCell>
              <TableCell>
                İlçe
                <IconButton size="small" onClick={() => handleSort("district")}>
                  <SortIcon />
                </IconButton>
              </TableCell>
              <TableCell>
                Mevki
                <IconButton
                  size="small"
                  onClick={() => handleSort("neighborhood")}
                >
                  <SortIcon />
                </IconButton>
              </TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayedWorksites.length > 0 ? (
              displayedWorksites.map((worksite, index) => (
                <TableRow key={index}>
                  <TableCell>{getAvatarContent(worksite)}</TableCell>
                  <TableCell>{worksite.name}</TableCell>
                  <TableCell>
                    {formatTimestampToDate(worksite.startDate)}
                  </TableCell>
                  <TableCell>
                    {formatTimestampToDate(worksite.finishDate)}
                  </TableCell>
                  <TableCell>{worksite.city}</TableCell>
                  <TableCell>{worksite.district}</TableCell>
                  <TableCell>{worksite.neighborhood}</TableCell>{" "}
                  <TableCell>
                    <IconButton
                      onClick={() => handleOpenWorksiteDetailsModal(worksite)}
                    >
                      <OpenInNewIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  Projenize ait bir şantiye bulunmamaktadır.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={worksites.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={() => {}}
      />

      {isWorksiteDetailsModalOpen && (
        <ViewWorksiteDetails
          isOpen={isWorksiteDetailsModalOpen}
          onClose={handleCloseWorksiteDetailsModal}
          viewSelectedWorksite={viewSelectedWorksite}
        />
      )}
    </div>
  );
}
