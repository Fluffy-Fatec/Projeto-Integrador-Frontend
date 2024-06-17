import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { AppBar, Box, Tab, Tabs, Typography, useTheme, Grid } from '@mui/material';
import SwipeableViews from 'react-swipeable-views';
import Monitoring from '../Monitoring';
import Log from '../Log';

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`full-width-tabpanel-${index}`}
            aria-labelledby={`full-width-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `full-width-tab-${index}`,
        'aria-controls': `full-width-tabpanel-${index}`,
    };
}

export default function FullWidthTabs({ token }) {
    const theme = useTheme();
    const [value, setValue] = useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleChangeIndex = (index) => {
        setValue(index);
    };

    return (
        <Box sx={{ width: "100%", marginTop: "60px" }}>
            <AppBar position="static">
                <Tabs
                    value={value}
                    onChange={handleChange}
                    indicatorColor="secondary"
                    variant="fullWidth"
                    aria-label="full width tabs example"
                >
                    <Tab style={{ color: '#11BF4E' }} label="Control Panel" {...a11yProps(0)} />
                    <Tab style={{ color: '#11BF4E' }} label="Audit" {...a11yProps(1)} />
                </Tabs>
            </AppBar>
            <SwipeableViews
                axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                index={value}
                onChangeIndex={handleChangeIndex}
            >
                <TabPanel value={value} index={0} dir={theme.direction}>
                    <Monitoring token={token} />
                </TabPanel>
                <TabPanel value={value} index={1} dir={theme.direction}>
                    <Grid container spacing={1}>
                        <Grid item xs={12} sm={12}>
                            <Log token={token} />
                        </Grid>
                    </Grid>
                </TabPanel>
            </SwipeableViews>
        </Box>
    );
}
