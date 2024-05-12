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
} from "@mui/material";

export default function DeliveryTable({
  deliveries,
  isCompleted,
  companyData,
}) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const displayedDeliveries = deliveries.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const formatTimestampToDate = (timestamp) => {
    const date = new Date(timestamp.seconds * 1000);
    return date.toLocaleDateString();
  };

  const notCompletedDeliveries = (
    <div style={{ width: "100%" }}>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Teslimat</TableCell>
              <TableCell>Alıcı Firma</TableCell>
              <TableCell>Gönderici Firma</TableCell>
              <TableCell>Teslimat Tarihi</TableCell>
              <TableCell>Teslim Durumu</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayedDeliveries.map(
              (delivery, index) =>
                !delivery.isDone && (
                  <TableRow key={index}>
                    <TableCell>{delivery.description}</TableCell>
                    <TableCell>{delivery.receiverName}</TableCell>
                    <TableCell>{delivery.supplierName}</TableCell>
                    <TableCell>
                      {formatTimestampToDate(delivery.deliveryTime)}
                    </TableCell>
                    <TableCell>
                      <span style={{ color: "red" }}>Teslim Edilmedi</span>
                    </TableCell>
                  </TableRow>
                )
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 50]}
        component="div"
        count={deliveries.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </div>
  );

  const completedDeliveries = (
    <div style={{ width: "100%" }}>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Teslimat</TableCell>
              <TableCell>Alıcı Firma</TableCell>
              <TableCell>Gönderici Firma</TableCell>
              <TableCell>Teslimat Tarihi</TableCell>
              <TableCell>Teslim Durumu</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayedDeliveries.map(
              (delivery, index) =>
                delivery.isDone && (
                  <TableRow key={index}>
                    <TableCell>{delivery.description}</TableCell>
                    <TableCell>{delivery.receiverName}</TableCell>
                    <TableCell>{delivery.supplierName}</TableCell>
                    <TableCell>
                      {formatTimestampToDate(delivery.deliveryTime)}
                    </TableCell>
                    <TableCell>
                      <span style={{ color: "green" }}>
                        Teslim Edildi:{" "}
                        {formatTimestampToDate(delivery.finishTime)}
                      </span>
                    </TableCell>
                  </TableRow>
                )
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 50]}
        component="div"
        count={deliveries.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </div>
  );
  return isCompleted ? completedDeliveries : notCompletedDeliveries;
}
