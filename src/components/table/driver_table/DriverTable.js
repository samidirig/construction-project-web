import React, { useState } from 'react';
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
} from '@mui/material';

export default function DriversTable({ drivers, companyData }) {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const displayedDrivers = drivers.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    );

    const formatTimestampToDate = (timestamp) => {
        const date = new Date(timestamp.seconds * 1000);
        return date.toLocaleDateString();
    };

    return (
        <div style={{ width: '100%' }}>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>İsim</TableCell>
                            <TableCell>Soyisim</TableCell>
                            <TableCell>Rol</TableCell>
                            <TableCell>E-Posta</TableCell>
                            <TableCell>Personel Statü</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {displayedDrivers.map((personnel, index) => (
                            <TableRow key={index}>
                                <TableCell>{personnel.name}</TableCell>
                                <TableCell>{personnel.surname}</TableCell>
                                <TableCell>{personnel.role === "personnel" ? "Personel" : "Diğer"}</TableCell>
                                <TableCell>{personnel.email}</TableCell>
                                <TableCell>
                                    <Typography style={{ color: personnel.isConfirmedCompany ? 'blue' : 'red' }}>
                                        {personnel.isConfirmedCompany ? 'Onaylandı' : 'Onaylanmadı'}
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[10, 25, 50]}
                component="div"
                count={drivers.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </div>
    );
}
