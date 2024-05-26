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
import { deleteWorksitePersonnel } from "../../../config/firebase";

export default function ViewPersonnelTable({ personnels, worksiteId }) {
  const [personnelsData, setPersonnelsData] = useState(personnels);
  const [page, setPage] = useState(0);
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [open, setOpen] = useState(false);
  const [selectedPersonnel, setSelectedPersonnel] = useState(null);
  const rowsPerPage = 5;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleSort = (field) => {
    const isAsc = sortBy === field && sortOrder === "asc";
    setSortOrder(isAsc ? "desc" : "asc");
    setSortBy(field);
  };

  const sortedPersonnels = [...personnelsData].sort((a, b) => {
    let comparison = 0;
    if (
      sortBy === "name" ||
      sortBy === "surname" ||
      sortBy === "email" ||
      sortBy === "role"
    ) {
      comparison = a[sortBy].localeCompare(b[sortBy]);
    } else if (sortBy === "isConfirmedCompany") {
      comparison = a[sortBy] === b[sortBy] ? 0 : a[sortBy] ? -1 : 1;
    }
    return sortOrder === "asc" ? comparison : -comparison;
  });

  const displayedPersonnels = sortedPersonnels.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleUpdatePersonnelDatas = (personnelId) => {
    if (personnelId) {
      const updatedPersonnels = personnelsData.filter(
        (personnel) => personnel.userId !== personnelId
      );
      setPersonnelsData(updatedPersonnels);
    }
  };

  const handleDeleteWorksitePersonnel = async (personnelId) => {
    try {
      if (personnelId && worksiteId) {
        await deleteWorksitePersonnel(personnelId, worksiteId);
        handleUpdatePersonnelDatas(personnelId);
        handleClose();
        console.log("personnel silindi " + personnelId + " " + worksiteId);
      }
    } catch (error) {
      console.error(
        "There is an error while deleting worksite personnel: " + error
      );
    }
  };

  const handleClickOpen = (personnel) => {
    setSelectedPersonnel(personnel);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedPersonnel(null);
  };

  const getAvatarContent = (personnel) => {
    if (personnel.userImage && isValidUrl(personnel.userImage)) {
      return <Avatar src={personnel.userImage} />;
    } else {
      const initials = `${personnel.userName[0]}${personnel.userSurname[0]}`;
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
              <TableCell></TableCell>
              <TableCell>
                İsim
                <IconButton size="small" onClick={() => handleSort("name")}>
                  <SortIcon />
                </IconButton>
              </TableCell>
              <TableCell>
                Soyisim
                <IconButton size="small" onClick={() => handleSort("surname")}>
                  <SortIcon />
                </IconButton>
              </TableCell>
              <TableCell>
                Rol
                <IconButton size="small" onClick={() => handleSort("role")}>
                  <SortIcon />
                </IconButton>
              </TableCell>
              <TableCell>
                E-Posta
                <IconButton size="small" onClick={() => handleSort("email")}>
                  <SortIcon />
                </IconButton>
              </TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayedPersonnels.length > 0 ? (
              displayedPersonnels.map((personnel, index) => (
                <TableRow key={index}>
                  <TableCell>{getAvatarContent(personnel)}</TableCell>
                  <TableCell>{personnel.userName}</TableCell>
                  <TableCell>{personnel.userSurname}</TableCell>
                  <TableCell>
                    {personnel.userRole === "personnel"
                      ? "Personel"
                      : personnel.userRole === "driver"
                      ? "Sürücü"
                      : "Diğer"}
                  </TableCell>
                  <TableCell>{personnel.userEmail}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleClickOpen(personnel)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  Şantiyenize ait personel bulunmamaktadır.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={personnelsData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={() => {}}
      />
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Personeli Kaldır</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {selectedPersonnel
              ? `${selectedPersonnel.userName} ${selectedPersonnel.userSurname} kişisini şantiyenizden kaldırmak istediğinizden emin misiniz?`
              : ""}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Hayır</Button>
          <Button
            onClick={() =>
              handleDeleteWorksitePersonnel(selectedPersonnel.userId)
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
