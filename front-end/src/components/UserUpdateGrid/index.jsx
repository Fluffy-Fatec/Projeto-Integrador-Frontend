import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Input from '@mui/material/Input';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import DeleteIcon from '@mui/icons-material/Delete';
import UpdatePassword from "../UpdatePassword";
import Dialog from '@mui/material/Dialog';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#ffffff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    overflow: 'auto',
    overflowY: 'auto',
}));

const CustomComponent = () => {
    const [fullName, setFullName] = useState('');
    const [userName, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [cpf, setCpf] = useState('');
    const [cellPhone, setCellPhone] = useState('');
    const [isChecked, setIsChecked] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [token, setToken] = useState('');

    useEffect(() => {
        const tokenFromLocalStorage = sessionStorage.getItem('token');
        if (tokenFromLocalStorage) {
            setToken(tokenFromLocalStorage);
            fetchData(tokenFromLocalStorage);
        }
    }, []);

    const fetchData = async (token) => {
        try {
            const response = await axios.get('http://localhost:8080/auth/list/user/logged', {
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
                    <Item sx={{ height: 'calc(50vh - 64px)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
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
                                    sx={{ height: '30px' }}
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
                                    sx={{ height: '30px' }}
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
                                    sx={{ height: '30px' }}
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
                                    sx={{ height: '30px', fontSize: '0.8rem' }}
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
                                    sx={{ height: '30px', fontSize: '0.8rem' }}
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
                                <UpdatePassword token={token} />
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
                    <Item sx={{ height: 'auto' }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Grid item xs={12}>
                                    <Typography variant="subtitle1" sx={{ marginBottom: 1, textAlign: 'left', margin: '15px', fontWeight: 'bold', fontSize: '1.2rem' }}>
                                        Privacy Policy
                                    </Typography>
                                </Grid>
                            </Grid>
                            <Grid item xs={12} sx={{ textAlign: 'right', marginTop: '-12px', marginRight: '15px' }}>
                                <Typography variant="subtitle1" sx={{ marginBottom: 1, textAlign: 'left', margin: '15px' }}>
                                    <Checkbox
                                        checked={isChecked}
                                        onChange={handleCheckboxChange}
                                        size="small"
                                        color="success"
                                    />
                                    By submitting, I agree to the processing of my personal data by Fluffy Tech in accordance with the
                                    <a href="URL_DO_SEU_PRIVACY_POLICY" style={{ color: '#11BF4E', textDecoration: 'none', marginLeft: '5px', fontWeight: 'bold' }}>
                                        Privacy Policy
                                    </a>.
                                    I understand that I can change my preferences at any time.
                                </Typography>
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
                            >
                                {capitalizeFirstLetter("Save Change")}
                            </Button>
                            </Grid>
                        </Grid>
                    </Item>
                </Grid>
            </Grid>
        </Box>
    );
};

export default CustomComponent;
