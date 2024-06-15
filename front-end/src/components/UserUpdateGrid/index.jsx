import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Dialog from '@mui/material/Dialog';
import Grid from '@mui/material/Grid';
import Input from '@mui/material/Input';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import UpdatePassword from "../UpdatePassword";
import { Link } from 'react-router-dom';


const Item = styled(Paper)(({ theme, darkMode }) => ({
    backgroundColor: darkMode,
    overflow: 'auto',
    overflowY: 'auto',
}));

const CustomComponent = ({ darkMode, token }) => {
    const [fullName, setFullName] = useState('');
    const [userName, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [cpf, setCpf] = useState('');
    const [cellPhone, setCellPhone] = useState('');
    const [isChecked, setIsChecked] = useState(false);
    const [openModal, setOpenModal] = useState(false);

    useEffect(() => {
        if (token) {
            fetchData(token);
        }
    }, [token]);

    const fetchData = async (token) => {
        try {
            const response = await axios.get('http://localhost:8080/auth/user/logged', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const userData = response.data;
            setFullName(userData.name);
            setUserName(userData.username);
            setEmail(userData.email);
            setCpf(userData.cpf);
            setCellPhone(userData.celphone);

        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    const handleSubmit = async () => {
        try {
            const response = await axios.put(
                'http://localhost:8080/auth/update/user',
                {
                    username: userName,
                    email: email,
                    name: fullName,
                    celphone: cellPhone,
                    cpf: cpf
                },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            console.log('Update successful:', response.data);
            alert('User information updated successfully!');
        } catch (error) {
            console.error('Error updating user:', error);
            alert('Error updating user. Please try again.');
        }
    };


    const handleCheckboxChange = (event) => {
        setIsChecked(event.target.checked);
    };

    const capitalizeFirstLetter = (string) => {
        return string.replace(/\b\w/g, (match) => match.toUpperCase());
    };

    const handleOpenModal = () => {
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    const formatPhoneNumber = (input) => {
        const phoneNumber = input.replace(/\D/g, '');
        const formattedPhoneNumber = phoneNumber.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
        setCellPhone(formattedPhoneNumber);
    };

    const formatCPF = (input) => {
        const cpfNumber = input.replace(/\D/g, '');
        const formattedCPF = cpfNumber.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
        setCpf(formattedCPF);
    };

    return (
        <Box sx={{ flexGrow: 1, marginTop: '64px' }}>
            <Grid container spacing={2}>
                <Grid item xs={12} sx={{ marginLeft: '25px', marginRight: '25px' }}>
                    <Item sx={{ height: 'calc(50vh - 64px)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }} darkMode={darkMode}>
                        <Grid container spacing={2} sx={{ padding: "15px" }}>
                            <Grid item xs={12}>
                                <Typography variant="subtitle1" sx={{ marginBottom: 1, textAlign: 'left', fontWeight: 'bold', fontSize: '1.2rem' }}>
                                    Personal Information
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Input
                                    type="text"
                                    required
                                    fullWidth
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    variant="outlined"
                                    placeholder="Full Name"
                                    name="fullName"
                                    id="fullName"
                                    color='success'
                                    sx={{ height: '30px', fontSize: '14px' }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Input
                                    required
                                    fullWidth
                                    value={userName}
                                    onChange={(e) => setUserName(e.target.value)}
                                    variant="outlined"
                                    placeholder="User Name"
                                    name="userName"
                                    id="userName"
                                    color='success'
                                    sx={{ height: '30px', fontSize: '14px' }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Input
                                    type="text"
                                    required
                                    fullWidth
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    variant="outlined"
                                    placeholder="E-mail"
                                    name="email"
                                    id="email"
                                    color='success'
                                    sx={{ height: '30px', fontSize: '14px' }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Input
                                    value={cpf}
                                    onChange={(e) => formatCPF(e.target.value)}
                                    required
                                    fullWidth
                                    variant="outlined"
                                    placeholder="CPF"
                                    name="cpf"
                                    id="cpf"
                                    inputProps={{ maxLength: 14 }}
                                    color='success'
                                    sx={{ height: '30px', fontSize: '14px' }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Input
                                    value={cellPhone}
                                    onChange={(e) => formatPhoneNumber(e.target.value)}
                                    required
                                    fullWidth
                                    variant="outlined"
                                    placeholder="Cell Phone"
                                    name="cellPhone"
                                    id="cellPhone"
                                    inputProps={{ maxLength: 15 }}
                                    color='success'
                                    sx={{ height: '30px', fontSize: '14px' }}
                                />
                            </Grid>
                        </Grid>
                        <Grid item xs={12} sx={{ textAlign: 'right', marginTop: '-12px', marginRight: '15px' }}>
                            <Button
                                variant="outlined"
                                color='success'
                                sx={{
                                    borderRadius: 5,
                                    mt: 3,
                                    mb: 2,
                                    width: { xs: '100%', sm: 'auto' },
                                    marginRight: '10px',
                                }}
                                style={{
                                    borderWidth: '2px',
                                    textTransform: 'none'
                                }}
                                onClick={handleOpenModal}
                            >
                                Update Password
                            </Button>
                            <Dialog open={openModal} onClose={handleCloseModal}>
                                <UpdatePassword token={token} darkMode={darkMode} />
                            </Dialog>
                            <Button
                                type="submit"
                                fullWidth
                                variant="outlined"
                                sx={{
                                    borderRadius: 5,
                                    mt: 3,
                                    mb: 2,
                                    width: { xs: '100%', sm: 'auto' },
                                }}
                                style={{
                                    backgroundColor: '#11BF4E',
                                    color: 'white',
                                    textTransform: 'none',
                                }}
                                onClick={handleSubmit}
                            >
                                {capitalizeFirstLetter("Save Change")}
                            </Button>
                        </Grid>
                    </Item>
                </Grid>
                <Grid item xs={12} sx={{ marginLeft: '25px', marginRight: '25px' }}>
                    <Item sx={{ height: 'auto' }} darkMode={darkMode}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Grid item xs={12}>
                                    <Typography variant="subtitle1" sx={{ marginBottom: 1, textAlign: 'left', margin: '15px', fontWeight: 'bold', fontSize: '1.2rem' }}>
                                        Term of Acceptance
                                    </Typography>
                                </Grid>
                            </Grid>
                            <Grid item xs={12} sx={{ textAlign: 'right', marginTop: '-12px', marginRight: '15px' }}>
                                <Typography variant="subtitle1" sx={{ marginBottom: 1, textAlign: 'left', margin: '15px' }}> By using Fluffy Tech's services, I express my consent to the processing of my personal data as described. I understand that I can change my <Link to="/privacy" style={{ color: '#11BF4E', textDecoration: 'none', marginLeft: '5px', fontWeight: 'bold' }}> Term of Acceptance </Link> preferences at any time.
                                </Typography>
                                <br />
                                <br />
                                <br />
                            </Grid>
                        </Grid>
                    </Item>
                </Grid>
            </Grid>
        </Box>
    );
};

export default CustomComponent;
