import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import Cookies from 'js-cookie'; // Importe a biblioteca js-cookie
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';

function Row({ row, onApprove }) {
  const [open, setOpen] = useState(false);

  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {row.user.nome}
        </TableCell>
        <TableCell align="right">{row.user.email}</TableCell>
        <TableCell align="right">{row.user.celular}</TableCell>
        <TableCell align="right">{row.user.cpf}</TableCell>
        <TableCell align="right">{row.status}</TableCell>
        <TableCell align="right">
          {row.status === 'Pendente' && (
            <React.Fragment>
              <Button
                variant="contained"
                onClick={() => onApprove(row.id, 'aprovado')}
                sx={{
                  borderRadius: 5,
                  mt: 3,
                  mb: 2,
                  width: { xs: '100%', sm: 'auto' },
                  marginRight: '10px',
                  color: 'white',
                  backgroundColor: '#11BF4E',
                  '&:hover': {
                    backgroundColor: '#34d165',
                  },
                }}
              >
                Approve
              </Button>
              <Button
                variant="contained"
                onClick={() => onApprove(row.id, 'rejeitado')}
                sx={{
                  borderRadius: 5,
                  mt: 3,
                  mb: 2,
                  width: { xs: '100%', sm: 'auto' },
                  marginRight: '10px',
                  color: 'white',
                  backgroundColor: '#f25774',
                  '&:hover': {
                    backgroundColor: '#ff8c9a',
                  },
                }}
              >
                Reject
              </Button>
            </React.Fragment>
          )}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Data to be approved:
              </Typography>
              <Table size="small" aria-label="update-details">
                <TableBody>
                  <TableRow>
                    <TableCell>Username</TableCell>
                    <TableCell>{row.novo_username}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>{row.novo_nome}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>E-mail</TableCell>
                    <TableCell>{row.novo_email}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Cellphone</TableCell>
                    <TableCell>{row.novo_celular}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>CPF</TableCell>
                    <TableCell>{row.novo_cpf}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

Row.propTypes = {
  row: PropTypes.shape({
    user: PropTypes.shape({
      nome: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      celular: PropTypes.string.isRequired,
      cpf: PropTypes.string.isRequired,
    }).isRequired,
    novo_username: PropTypes.string.isRequired,
    novo_nome: PropTypes.string.isRequired,
    novo_email: PropTypes.string.isRequired,
    novo_celular: PropTypes.string.isRequired,
    novo_cpf: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    id: PropTypes.number.isRequired,
  }).isRequired,
  onApprove: PropTypes.func.isRequired,
};

function TableUserUpdate() {
  const [userData, setUserData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    fetchData();
  }, [page, rowsPerPage]);

  const fetchData = async () => {
    try {
      const token = Cookies.get("token");
      if (!token) {
        console.error('Token not found in session storage');
        return;
      }
      const response = await axios.get('http://localhost:8080/auth/update/user/list', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          page: page + 1,
          per_page: rowsPerPage,
        },
      });
      setUserData(response.data);
    } catch (error) {
      console.error('Error fetching data from server:', error);
    }
  };

  const handleApprove = async (userId, status) => {
    try {
      const token = Cookies.get("token");
      if (!token) {
        console.error('Token not found in session storage');
        return;
      }
      await approveUser(userId, status, token);
    } catch (error) {
      console.error('Error approving user:', error);
    }
  };

  const approveUser = async (userId, status, token) => {
    try {
      await axios.put(
        'http://localhost:8080/auth/update/user/approve',
        {
          approve: status,
          id: userId,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchData();
    } catch (error) {
      console.error('Error approving user:', error);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <TableContainer component={Paper}>
      <Typography variant="h6" component="div" sx={{ p: 2 }}>
        Change Request
      </Typography>
      <TableContainer style={{ overflowX: 'auto' }}>
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>Name</TableCell>
              <TableCell align="right">E-mail</TableCell>
              <TableCell align="right">Cellphone</TableCell>
              <TableCell align="right">CPF</TableCell>
              <TableCell align="right">Status</TableCell>
              {userData.some((row) => row.status === 'Pendente') && (
                <TableCell align="right">Actions</TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {userData.map((row) => (
              <Row key={row.id} row={row} onApprove={handleApprove} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[4]}
        component="div"
        count={userData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </TableContainer>
  );
}

export default TableUserUpdate;
