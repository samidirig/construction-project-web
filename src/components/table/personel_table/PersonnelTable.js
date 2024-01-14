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
} from '@mui/material';

export default function PersonnelsTable({ personnels }) {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const displayedPersonnels = worksites.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    );

    const formatTimestampToDate = (timestamp) => {
        const date = new Date(timestamp.seconds * 1000); // Timestamp saniye cinsinden geldiği için 1000 ile çarpıyoruz
        return date.toLocaleDateString();
    };


    return (
        <div>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>İsim</TableCell>
                            <TableCell>Başlangıç Tarihi</TableCell>
                            <TableCell>Bitiş Tarihi</TableCell>
                            <TableCell>Şehir</TableCell>
                            <TableCell>İlçe</TableCell>
                            <TableCell>Mevki</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {displayedWorksites.map((worksite, index) => (
                            <TableRow key={index}>
                                <TableCell>{worksite.name}</TableCell>
                                <TableCell>{formatTimestampToDate(worksite.startDate)}</TableCell>
                                <TableCell>{formatTimestampToDate(worksite.finishDate)}</TableCell>
                                <TableCell>{worksite.city}</TableCell>
                                <TableCell>{worksite.district}</TableCell>
                                <TableCell>{worksite.neighborhood}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[10, 25, 50]}
                component="div"
                count={worksites.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </div>
    );
}
