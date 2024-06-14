import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Grid, Paper, Typography, useMediaQuery, CircularProgress } from '@mui/material';
import axios from 'axios';
import PlatformAccesses from '../PlatformAccesses';
import NewRegistrationUsers from '../NewRegistrationUsers';
import QuantityAiReview from '../QuantityAiReview';
import AiAccuracy from '../AiAccuracy';

const BASE_URL = 'http://localhost:8080';

const fetchData = async (endpoint, token) => {
    try {
        const response = await axios.get(`${BASE_URL}/${endpoint}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error(`Error fetching data from endpoint ${endpoint}:`, error);
        throw error;
    }
};

const GridMonitoring = ({ token }) => {
    const isMobile = useMediaQuery('(max-width:600px)');
    const [userData, setUserData] = useState(null);
    const [platformAccessData, setPlatformAccessData] = useState(null);
    const [logsOfTheDayData, setLogsOfTheDayData] = useState(null);
    const [accuracy, setAccuracy] = useState(null);
    const [review, setReview] = useState(null);
    const [loading, setLoading] = useState(true);
    const [dateAccuracy, setDateAccuracy] = useState(null);

    useEffect(() => {
        const fetchDataFromApi = async () => {
            try {
                const userData = await fetchData('auth/list/count/user', token);
                setUserData(userData);

                const platformAccessData = await fetchData('auth/logged/all', token);
                setPlatformAccessData(platformAccessData.length);

                const logsOfTheDayData = await fetchData('auth/log/count', token);
                setLogsOfTheDayData(logsOfTheDayData);

                const accuracyData = await fetchData('ia/accuracy', token);
                setAccuracy(accuracyData);

                if (accuracyData.iaDatetimeDeploy) {
                    const formattedDateTime = formatDateTime(accuracyData.iaDatetimeDeploy);
                    setDateAccuracy(formattedDateTime);
                }

                const reviewData = await fetchData('ia/count/review', token);
                setReview(reviewData);
                setLoading(false);

            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false);
            }
        };

        fetchDataFromApi();
    }, [token]);

    const formatDateTime = (iaDatetimeDeploy) => {
        const year = iaDatetimeDeploy[0];
        const month = iaDatetimeDeploy[1];
        const day = iaDatetimeDeploy[2];
        const hours = iaDatetimeDeploy[3];
        const minutes = iaDatetimeDeploy[4];
        const seconds = iaDatetimeDeploy[5];
        const dateObj = new Date(year, month - 1, day, hours, minutes, seconds);
        const formattedDateTime = dateObj.toLocaleString();

        return formattedDateTime;
    };

    const renderData = (data) => {
        if (loading) {
            return <CircularProgress />;
        }
        return data !== null && data !== undefined ? data : '-';
    };

    return (
        <Grid container spacing={2} >
            <Grid item xs={12} sm={6} >
                <Typography variant="h5">Users</Typography>
                <Paper style={{ height: "80%", padding: 20 }}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={4}>
                            <Typography variant={isMobile ? "h6" : "h4"}>
                                {renderData(userData)}
                            </Typography>
                            <Typography>Total Active Users</Typography>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Typography variant={isMobile ? "h6" : "h4"}>
                                {renderData(logsOfTheDayData)}
                            </Typography>
                            <Typography>Logs of the Day</Typography>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Typography variant={isMobile ? "h6" : "h4"}>
                                {renderData(platformAccessData)}
                            </Typography>
                            <Typography>Platform Access</Typography>
                        </Grid>
                    </Grid>
                </Paper>
            </Grid>
            <Grid item xs={12} sm={6} >
                <Typography variant="h5">AI Health</Typography>
                <Paper style={{ height: "80%", padding: 20 }}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={4}>
                            <Typography variant={isMobile ? "h6" : "h4"}>
                                {renderData(accuracy?.iaScore) !== '-' ? `${renderData(accuracy?.iaScore)}%` : '-'}
                            </Typography>

                            <Typography>Accuracy</Typography>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Typography variant={isMobile ? "h6" : "h4"}>
                                {renderData(accuracy?.idQuantitySentiment)}
                            </Typography>
                            <Typography>Quantity Sentimental</Typography>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Typography variant={isMobile ? "h6" : "h4"}>
                                {renderData(review)}
                            </Typography>
                            <Typography>AI Reviews</Typography>
                        </Grid>
                    </Grid>
                </Paper>
            </Grid>
            <Grid item xs={12} sm={6}>
                <Paper style={{ height: 300, padding: 20 }}>
                    <NewRegistrationUsers token={token} />
                </Paper>
            </Grid>
            <Grid item xs={12} sm={6}>
                <Paper style={{ height: 300, padding: 20 }}>
                    <QuantityAiReview token={token} />
                </Paper>
            </Grid>
            <Grid item xs={12} sm={6}>
                <Paper style={{ height: 300, padding: 20 }}>
                    <PlatformAccesses token={token} />
                </Paper>
            </Grid>
            <Grid item xs={12} sm={6}>
                <Paper style={{ height: 300, padding: 20 }}>
                    <AiAccuracy token={token} />
                </Paper>
            </Grid>
            {dateAccuracy && (
                <Grid item xs={12}>
                    <Typography>Data de Deploy do AI: {dateAccuracy}</Typography>
                </Grid>
            )}
        </Grid>
    );
};

GridMonitoring.propTypes = {
    token: PropTypes.string.isRequired,
};

export default GridMonitoring;
