import React, { useState } from "react";
import {
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Avatar,
  TablePagination,
  Typography,
  Button,
  IconButton,
} from "@mui/material";
import SortIcon from "@mui/icons-material/Sort";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import { isConfirmButton } from "../../../style/utils";
import { setPersonnelStatuConfirm } from "../../../config/firebase";
import ViewPersonnelDetails from "../../ViewModals/ViewPersonnelDetails";

export default function ConfirmPersonnelTable({
  personnels,
  confirmPersonnelTrigger,
}) {
  const [page, setPage] = useState(0);
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [viewSelectedPersonnel, setViewSelectedPersonnel] = useState(null);
  const [isPersonnelDetailsModalOpen, setIsPersonnelDetailsModalOpen] =
    useState(false);
  const rowsPerPage = 5;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleSort = (field) => {
    const isAsc = sortBy === field && sortOrder === "asc";
    setSortOrder(isAsc ? "desc" : "asc");
    setSortBy(field);
  };

  const sortedPersonnels = [...personnels].sort((a, b) => {
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

  const handleSetPersonelConfirm = async (personnelId) => {
    try {
      const success = await setPersonnelStatuConfirm(personnelId);
      if (success) {
        confirmPersonnelTrigger();
        console.log(`Personel (${personnelId}) başarıyla onaylandı.`);
      } else {
        console.error(
          `Personel (${personnelId}) onaylanırken bir hata oluştu.`
        );
      }
    } catch (error) {
      console.error(
        "Personel onaylama işlemi sırasında bir hata oluştu:",
        error
      );
    }
  };

  const handleOpenPersonnelDetailsModal = (personnel) => {
    setViewSelectedPersonnel(personnel);
    setIsPersonnelDetailsModalOpen(true);
  };

  const handleClosePersonnelDetailsModal = () => {
    setIsPersonnelDetailsModalOpen(false);
    setViewSelectedPersonnel(null);
  };

  const getAvatarContent = (personnel) => {
    if (personnel.profileImg && isValidUrl(personnel.profileImg)) {
      return <Avatar src={personnel.profileImg} />;
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
              <TableCell>
                Personel Statü
                <IconButton
                  size="small"
                  onClick={() => handleSort("isConfirmedCompany")}
                >
                  <SortIcon />
                </IconButton>
              </TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayedPersonnels.map((personnel, index) => (
              <TableRow key={index}>
              <TableCell>{getAvatarContent(personnel)}</TableCell>
                <TableCell>{personnel.name}</TableCell>
                <TableCell>{personnel.surname}</TableCell>
                <TableCell>
                  {personnel.role === "personnel"
                    ? "Personel"
                    : personnel.role === "driver"
                    ? "Sürücü"
                    : "Diğer"}
                </TableCell>
                <TableCell>{personnel.email}</TableCell>
                <TableCell>
                  <Typography
                    style={{
                      color: personnel.isConfirmedCompany ? "blue" : "red",
                    }}
                  >
                    {personnel.isConfirmedCompany ? (
                      "Onaylandı"
                    ) : (
                      <Button
                        onClick={() => handleSetPersonelConfirm(personnel.id)}
                        sx={isConfirmButton}
                      >
                        Onayla
                      </Button>
                    )}
                  </Typography>
                </TableCell>
                {personnel.isConfirmedCompany && (
                  <TableCell>
                    <IconButton
                      onClick={() => handleOpenPersonnelDetailsModal(personnel)}
                    >
                      <AssignmentIndIcon
                        sx={{ color: "rgba(134, 167, 252, 1)" }}
                      />
                    </IconButton>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={personnels.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={() => {}}
      />

      {isPersonnelDetailsModalOpen && (
        <ViewPersonnelDetails
          isOpen={isPersonnelDetailsModalOpen}
          onClose={handleClosePersonnelDetailsModal}
          viewSelectedPersonnel={viewSelectedPersonnel}
        />
      )}
    </div>
  );
}
