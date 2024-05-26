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
// import { deleteWorksiteShift } from "../../../config/firebase";

export default function ViewShiftTable({ shifts, worksiteId }) {
  const [shiftsData, setShiftsData] = useState(shifts);
  const [page, setPage] = useState(0);
  const [sortBy, setSortBy] = useState("isFinished");
  const [sortOrder, setSortOrder] = useState("asc");
  const [open, setOpen] = useState(false);
  const [selectedShift, setSelectedShift] = useState(null);
  const rowsPerPage = 5;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleSort = (field) => {
    const isAsc = sortBy === field && sortOrder === "asc";
    setSortOrder(isAsc ? "desc" : "asc");
    setSortBy(field);
  };

  const sortedShifts = [...shiftsData].sort((a, b) => {
    let comparison = 0;
    if (sortBy === "startTime" || sortBy === "finishTime") {
      comparison = a[sortBy].seconds - b[sortBy].seconds;
    } else if (sortBy === "isFinished") {
      comparison = a.isFinished === b.isFinished ? 0 : a.isFinished ? 1 : -1;
    } else {
      comparison = a[sortBy].localeCompare(b[sortBy]);
    }
    return sortOrder === "asc" ? comparison : -comparison;
  });

  const displayedShifts = sortedShifts.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleUpdateShiftDatas = (shiftId) => {
    if (shiftId) {
      const updatedShifts = shiftsData.filter((shift) => shift.id !== shiftId);
      setShiftsData(updatedShifts);
    }
  };

  const handleDeleteWorksiteShift = async (shiftId) => {
    try {
      if (shiftId && worksiteId) {
        // await deleteWorksiteShift(shiftId, worksiteId);
        handleUpdateShiftDatas(shiftId);
        handleClose();
        console.log("Shift silindi " + shiftId + " " + worksiteId);
      }
    } catch (error) {
      console.error(
        "There is an error while deleting worksite shift: " + error
      );
    }
  };

  const handleClickOpen = (shift) => {
    setSelectedShift(shift);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedShift(null);
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

  return (
    <div style={{ width: "100%" }}>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                Başlangıç Zamanı
                <IconButton
                  size="small"
                  onClick={() => handleSort("startTime")}
                >
                  <SortIcon />
                </IconButton>
              </TableCell>
              <TableCell>
                Bitiş Zamanı
                <IconButton
                  size="small"
                  onClick={() => handleSort("finishTime")}
                >
                  <SortIcon />
                </IconButton>
              </TableCell>
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
                Personel Bitiş
                <IconButton
                  size="small"
                  onClick={() => handleSort("isFinished")}
                >
                  <SortIcon />
                </IconButton>
              </TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayedShifts.length > 0 ? (
              displayedShifts.map((shift, index) => (
                <TableRow key={index}>
                  <TableCell>
                    {formatTimestampToDate(shift.startTime)}
                  </TableCell>
                  <TableCell>
                    {formatTimestampToDate(shift.finishTime)}
                  </TableCell>
                  <TableCell>{shift.userName}</TableCell>
                  <TableCell>{shift.userSurname}</TableCell>
                  <TableCell
                    sx={{
                      color: shift.isFinished
                        ? shift.userFinishTime
                          ? "green"
                          : "orange"
                        : "red",
                      fontWeight:
                        shift.isFinished && shift.userFinishTime
                          ? "normal"
                          : "bold",
                    }}
                  >
                    {shift.isFinished
                      ? shift.userFinishTime
                        ? formatTimestampToDate(shift.userFinishTime)
                        : "Zamansız Tamamlandı"
                      : "Tamamlanmadı"}
                  </TableCell>

                  <TableCell>
                    <IconButton onClick={() => handleClickOpen(shift)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  Şantiyenize ait vardiya bulunmamaktadır.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={shiftsData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={() => {}}
      />
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Vardiyayı Kaldır</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {selectedShift
              ? `${selectedShift.userName} ${selectedShift.userSurname} kişisinin vardiyasını kaldırmak istediğinizden emin misiniz?`
              : ""}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Hayır</Button>
          <Button
            onClick={() => handleDeleteWorksiteShift(selectedShift.id)}
            color="primary"
          >
            Evet
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
