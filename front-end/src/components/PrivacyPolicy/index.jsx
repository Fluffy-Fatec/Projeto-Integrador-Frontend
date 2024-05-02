import { Divider } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Checkbox from '@mui/material/Checkbox';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const defaultTheme = createTheme();

export default function SignIn() {
    const [isChecked, setIsChecked] = useState(false);
    const [terms, setTerms] = useState('');
    const [username, setUsername] = useState('');
    const [acceptanceStatus, setAcceptanceStatus] = useState('');

    useEffect(() => {
        fetchTerms();
    }, []);

    const fetchTerms = async () => {
        try {
            const response = await axios.get('http://localhost:8080/term');
            if (response.data && response.data.termo) {
                setTerms(response.data.termo);
            } else {
                console.error('Invalid term response:', response);
            }
        } catch (error) {
            console.error('Error when searching for terms:', error);
        }
    };

    const handleCheckboxChange = (event) => {
        setIsChecked(event.target.checked);
    };

    const navigate = useNavigate();

    const storedUsername = localStorage.getItem('username');

    const handleAccept = async () => {
        try {
            await axios.post('http://localhost:8080/auth/user/term', {
                username: storedUsername,
                termAccepted: isChecked ? 'accepted' : 'rejected'
            });
            console.log('Terms accepted successfully!');
            navigate('/');
        } catch (error) {
            console.error('Error accepting terms:', error);
        }
    };

    return (
        <ThemeProvider theme={defaultTheme}>
            <Container component="main" maxWidth="md">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: '10%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Card>
                        <CardContent style={{ overflow: 'auto', maxHeight: 500 }}>
                            <Typography variant="h5" component="div">
                                Privacy Policy
                            </Typography>
                            <br />
                            <Divider></Divider>
                            <br />
                            <Typography style={{ fontSize: '1rem', marginBottom: '2%', color: "#5F5F5F", textAlign: 'justify' }}>
                                {terms}
                            </Typography>
                            <Grid item xs={12} style={{ textAlign: 'justify' }}>
                                <Typography variant="subtitle1" style={{ marginBottom: 1, fontSize: '0.8rem' }}>
                                    <Checkbox
                                        color="success"
                                        checked={isChecked}
                                        onChange={handleCheckboxChange}
                                        size="small"
                                    />
                                    <label style={{ fontSize: '1rem', marginBottom: '2%', color: "#5F5F5F", textAlign: 'justify' }}>
                                        By checking this box, I agree to the processing of my personal data by Fluffy Tech in accordance with the Privacy Policy.
                                    </label>
                                </Typography>
                            </Grid>
                            <br></br>
                            <Button onClick={handleAccept}
                                style={{
                                    borderRadius: 5,
                                    marginTop: 3,
                                    marginBottom: 2,
                                    width: '100%',
                                    marginLeft: 'auto',
                                    background: "#11BF4E"
                                }}
                                variant="contained"
                            >Submit</Button>
                        </CardContent>
                    </Card>
                </Box>
            </Container>
        </ThemeProvider>
    );
}
