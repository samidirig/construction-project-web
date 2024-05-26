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
  Typography,
  Button,
  IconButton,
} from "@mui/material";
import SortIcon from "@mui/icons-material/Sort";
import { setPersonnelPermitConfirm } from "../../../config/firebase";
import { isConfirmButton } from "../../../style/utils";

export default function PermitTable({ permits, confirmPermitTrigger }) {
  const [page, setPage] = useState(0);
  const [sortBy, setSortBy] = useState("isApproved");
  const [sortOrder, setSortOrder] = useState("asc");
  const rowsPerPage = 4;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleSort = (field) => {
    const isAsc = sortBy === field && sortOrder === "asc";
    setSortOrder(isAsc ? "desc" : "asc");
    setSortBy(field);
  };

  const sortedPermits = [...permits].sort((a, b) => {
    let comparison = 0;
    if (sortBy === "startTime" || sortBy === "finishTime") {
      comparison = a[sortBy].seconds - b[sortBy].seconds;
    } else if (sortBy === "isApproved") {
      comparison = a[sortBy] === b[sortBy] ? 0 : a[sortBy] ? 1 : -1;
    } else {
      comparison = a[sortBy].localeCompare(b[sortBy]);
    }
    return sortOrder === "asc" ? comparison : -comparison;
  });

  const displayedPermits = sortedPermits.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleSetPersonelPermit = async (permitId) => {
    try {
      const success = await setPersonnelPermitConfirm(permitId);
      if (success) {
        confirmPermitTrigger();
        console.log(`İzin (${permitId}) başarıyla onaylandı.`);
      } else {
        console.error(`İzin (${permitId}) onaylanırken bir hata oluştu.`);
      }
    } catch (error) {
      console.error("İzin onaylama işlemi sırasında bir hata oluştu:", error);
    }
  };

  const formatTimestampToDate = (timestamp) => {
    const date = new Date(timestamp.seconds * 1000);
    return date.toLocaleDateString();
  };

  return (
    <div style={{ width: "100%" }}>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
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
            <TableCell>Açıklama</TableCell>
            <TableCell>
              İzin Başlangıç
              <IconButton size="small" onClick={() => handleSort("startTime")}>
                <SortIcon />
              </IconButton>
            </TableCell>
            <TableCell>
              İzin Bitiş
              <IconButton size="small" onClick={() => handleSort("finishTime")}>
                <SortIcon />
              </IconButton>
            </TableCell>
            <TableCell>
              Onay Durumu
              <IconButton size="small" onClick={() => handleSort("isApproved")}>
                <SortIcon />
              </IconButton>
            </TableCell>
          </TableHead>
          <TableBody>
            {displayedPermits.map((permit, index) => (
              <TableRow key={index}>
                <TableCell>{permit.userName}</TableCell>
                <TableCell>{permit.userSurname}</TableCell>
                <TableCell>{permit.type}</TableCell>
                <TableCell>{formatTimestampToDate(permit.startTime)}</TableCell>
                <TableCell>
                  {formatTimestampToDate(permit.finishTime)}
                </TableCell>
                <TableCell>
                  <Typography
                    style={{ color: permit.isApproved ? "blue" : "red" }}
                  >
                    {permit.isApproved ? (
                      "Onaylandı"
                    ) : (
                      <Button
                        onClick={() => handleSetPersonelPermit(permit.id)}
                        sx={isConfirmButton}
                      >
                        Onayla
                      </Button>
                    )}
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={permits.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={() => {}}
      />
    </div>
  );
}
