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

export default function DeliveryTable({
  deliveries,
  isCompleted,
  companyData,
}) {
  const [page, setPage] = useState(0);
  const [sortBy, setSortBy] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const rowsPerPage = 3;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleSort = (field) => {
    const isAsc = sortBy === field && sortOrder === "asc";
    setSortOrder(isAsc ? "desc" : "asc");
    setSortBy(field);
  };

  const sortedDeliveries = [...deliveries].sort((a, b) => {
    let comparison = 0;
    if (
      sortBy === "description" ||
      sortBy === "receiverName" ||
      sortBy === "supplierName"
    ) {
      comparison = a[sortBy].localeCompare(b[sortBy]);
    } else if (sortBy === "deliveryTime" || sortBy === "finishTime") {
      comparison = a[sortBy].seconds - b[sortBy].seconds;
    }
    return sortOrder === "asc" ? comparison : -comparison;
  });

  const notCompletedDeliveriesList = sortedDeliveries.filter(
    (delivery) => !delivery.isDone
  );

  const completedDeliveriesList = sortedDeliveries.filter(
    (delivery) => delivery.isDone
  );

  const displayedDeliveries = isCompleted
    ? completedDeliveriesList.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      )
    : notCompletedDeliveriesList.slice(
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
              <TableCell>
                Teslimat
                <IconButton
                  size="small"
                  onClick={() => handleSort("description")}
                >
                  <SortIcon />
                </IconButton>
              </TableCell>
              <TableCell>
                Alıcı Firma
                <IconButton
                  size="small"
                  onClick={() => handleSort("receiverName")}
                >
                  <SortIcon />
                </IconButton>
              </TableCell>
              <TableCell>
                Gönderici Firma
                <IconButton
                  size="small"
                  onClick={() => handleSort("supplierName")}
                >
                  <SortIcon />
                </IconButton>
              </TableCell>
              <TableCell>
                Teslimat Tarihi
                <IconButton
                  size="small"
                  onClick={() => handleSort("deliveryTime")}
                >
                  <SortIcon />
                </IconButton>
              </TableCell>
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
        component="div"
        count={notCompletedDeliveriesList.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={() => {}}
      />
    </div>
  );

  const completedDeliveries = (
    <div style={{ width: "100%" }}>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                Teslimat
                <IconButton
                  size="small"
                  onClick={() => handleSort("description")}
                >
                  <SortIcon />
                </IconButton>
              </TableCell>
              <TableCell>
                Alıcı Firma
                <IconButton
                  size="small"
                  onClick={() => handleSort("receiverName")}
                >
                  <SortIcon />
                </IconButton>
              </TableCell>
              <TableCell>
                Gönderici Firma
                <IconButton
                  size="small"
                  onClick={() => handleSort("supplierName")}
                >
                  <SortIcon />
                </IconButton>
              </TableCell>
              <TableCell>
                Teslimat Tarihi
                <IconButton
                  size="small"
                  onClick={() => handleSort("deliveryTime")}
                >
                  <SortIcon />
                </IconButton>
              </TableCell>
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
        component="div"
        count={completedDeliveriesList.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={() => {}}
      />
    </div>
  );

  return isCompleted ? completedDeliveries : notCompletedDeliveries;
}
