import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import Button from '@mui/material/Button';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import New from "../NewUserModal";
import Dialog from '@mui/material/Dialog';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

function createData(id, name, email, creation_date, userRole) {
  return { id, name, email, creation_date, userRole };
}

function EnhancedTable() {
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('name');
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [dense, setDense] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [rows, setRows] = useState([]);
  const [token, setToken] = useState('');
  const [openPopup, setOpenPopup] = useState(false);
  const [editModeRowId, setEditModeRowId] = useState(null);
  const [editedUserRole, setEditedUserRole] = useState('');

  useEffect(() => {
    const tokenFromLocalStorage = sessionStorage.getItem('token');
    if (tokenFromLocalStorage) {
      setToken(tokenFromLocalStorage);
    }
  }, []);

  useEffect(() => {
    if (token) {
      fetchData();
    }
  }, [token]);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:8080/auth/list/user', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const formattedRows = response.data.map(row => createData(row.id, row.name, row.email, row.creation_date, row.userRole));
      setRows(formattedRows);
    } catch (error) {
      console.log("An error occurred:", error);
    }
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = rows.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, id) => {
    event.stopPropagation();
    if (editModeRowId === id) return;

    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }
    setSelected(newSelected);
    setEditModeRowId(id);

    const row = rows.find(row => row.id === id);
    setEditedUserRole(row.userRole);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      alert("Item deleted successfully!");
    }

    try {
      await axios.delete('http://localhost:8080/auth/delete/user/' + selected, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
      });
      const remainingUsers = rows.filter(row => !selected.includes(row.id));
      setRows(remainingUsers);
      setSelected([]);
    } catch (error) {
      console.log("An error occurred while deleting:", error);
    }
  };


  const handleButtonClick = () => {
    setOpenPopup(true);
  };

  const handleClosePopup = () => {
    setOpenPopup(false);
  };

  const handleUserRoleChange = async (event) => {
    if (window.confirm("Are you sure you want to update the role?")) {
      alert("Role updated successfully!");
    }

    try {
      const newRole = event.target.value;

      if (newRole !== 'ADMIN' && newRole !== 'USER') {
        console.log("Invalid value selected for the user role.");
        return;
      }

      await axios.put('http://localhost:8080/auth/update/user/role', {
        id: editModeRowId,
        role: newRole
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const updatedRows = rows.map(row => {
        if (row.id === editModeRowId) {
          return { ...row, userRole: newRole };
        }
        return row;
      });
      setRows(updatedRows);
      setEditModeRowId(null);
    } catch (error) {
      console.log("An error occurred while updating the user role:", error);
    }
  };

  return (
    <Box sx={{ width: '100%', height: '87vh', marginTop: 10, marginLeft: 2, marginRight: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button variant="text" startIcon={<PersonAddAltIcon />} sx={{ color: '#11BF4E', fontWeight: 'bold', textTransform: 'none' }} onClick={handleButtonClick}>
          <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
            New User
          </Typography>
        </Button>
      </Box>
      <Paper sx={{ width: '100%', height: '82vh', mb: 2 }}>
        <TableContainer style={{ overflowX: 'auto' }}>
          <Table
            sx={{ minWidth: "100%" }}
            aria-labelledby="tableTitle"
            size="small"
            style={{ minWidth: '100%' }}
          >
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>
              {stableSort(rows, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const isItemSelected = isSelected(row.id);
                  const labelId = `enhanced-table-checkbox-${index}`;
                  const isEditMode = editModeRowId === row.id;
                  return (
                    <TableRow
                      hover
                      onClick={(event) => handleClick(event, row.id)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.id}
                      selected={isItemSelected}
                      sx={{ cursor: 'pointer' }}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          color="success"
                          checked={isItemSelected}
                          inputProps={{
                            'aria-labelledby': labelId,
                          }}
                        />
                      </TableCell>
                      <TableCell
                        component="th"
                        id={labelId}
                        scope="row"
                        padding="none"
                      >
                        {row.name}
                      </TableCell>
                      <TableCell align="right">{row.email}</TableCell>
                      <TableCell align="right">  {new Date(row.creation_date).toLocaleDateString()}</TableCell>
                      <TableCell align="right">
                        {isEditMode ? (
                          <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                            <InputLabel id="role-select-label">Role</InputLabel>
                            <Select
                              labelId="role-select-label"
                              id="role-select"
                              value={editedUserRole}
                              label="Role"
                              onChange={handleUserRoleChange}
                            >
                              <MenuItem value="ADMIN">ADMIN</MenuItem>
                              <MenuItem value="USER">USER</MenuItem>
                            </Select>
                          </FormControl>
                        ) : (
                          row.userRole
                        )}
                      </TableCell>
                      <TableCell align="right">
                        <IconButton onClick={() => handleDelete([row.id])} disabled={!isItemSelected}>
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[20, 40, 60]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <Dialog
        open={openPopup}
        onClose={handleClosePopup}
      >
        <New token={token} />
      </Dialog>
    </Box>
  );
}

function EnhancedTableHead(props) {
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead >
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="success"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              'aria-label': 'select all desserts',
            }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
            </TableSortLabel>
          </TableCell>
        ))}
        <TableCell />
      </TableRow>
    </TableHead>
  );
}

const headCells = [
  { id: 'name', numeric: false, disablePadding: true, label: 'Name' },
  { id: 'email', numeric: true, disablePadding: false, label: 'Email' },
  { id: 'creation_date', numeric: true, disablePadding: false, label: 'Creation Date' },
  { id: 'userRole', numeric: true, disablePadding: false, label: 'User Role' },
];

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

export default EnhancedTable;
