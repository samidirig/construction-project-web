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
import { formatTimestampToDate } from '../../../common/utils';

export default function ProjectsTable({ projects }) {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const displayedProjects = projects.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    );

    return (
        <div>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Proje Adı</TableCell>
                            <TableCell>Başlangıç Tarihi</TableCell>
                            <TableCell>Bitiş Tarihi</TableCell>
                            <TableCell>Şehir</TableCell>
                            <TableCell>Bütçe</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {displayedProjects.map((project, index) => (
                            <TableRow key={index}>
                                <TableCell>{project.name}</TableCell>
                                <TableCell>{formatTimestampToDate(project.startDate)}</TableCell>
                                <TableCell>{formatTimestampToDate(project.finishDate)}</TableCell>
                                <TableCell>{project.city ? project.city : '--'}</TableCell>
                                <TableCell>{project.budget ? project.budget : '--$'}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[10, 25, 50]}
                component="div"
                count={projects.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </div>
    );
}
