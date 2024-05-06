import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import React from 'react';
import TableUpdateUser from '../TableUpdateUser';
import UserTable from '../UserTable';

const GridManageAccounts = () => {
    return (
        <Box sx={{ flexGrow: 1, marginTop: '64px' }}>
            <Grid container spacing={2}>
                <Grid item xs={12} sx={{ marginLeft: '25px', marginRight: '25px' }}>
                    <UserTable />
                </Grid>
                <Grid item xs={12} sx={{ marginLeft: '25px', marginRight: '25px' }}>
                    <TableUpdateUser />
                </Grid>
            </Grid>
        </Box>
    );
};

export default GridManageAccounts;