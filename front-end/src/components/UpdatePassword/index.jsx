import CloseIcon from '@mui/icons-material/Close';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Input from '@mui/material/Input';
import InputAdornment from '@mui/material/InputAdornment';
import { ThemeProvider } from '@mui/material/styles';
import * as React from 'react';

export default function SignIn({ token, darkMode }) {
    const [isChecked, setIsChecked] = React.useState(false);
    const [open, setOpen] = React.useState(true);
    const [newPassword, setNewPassword] = React.useState('');
    const [confirmNewPassword, setConfirmNewPassword] = React.useState('');
    const [showNewPassword, setShowNewPassword] = React.useState(false);
    const [showConfirmNewPassword, setShowConfirmNewPassword] = React.useState(false);
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    const handleUpdatePassword = async () => {
        if (isSubmitting) {
            return;
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%?&#])[A-Za-z\d@$!%?&#]{8,}$/;
        if (!passwordRegex.test(newPassword)) {
            console.error('Password must contain at least 8 characters, one uppercase letter, one lowercase letter, and one special character.');
            alert('Password must contain at least 8 characters, one uppercase letter, one lowercase letter, and one special character.');
            return;
        }

        if (newPassword !== confirmNewPassword) {
            alert("New Password and Confirm New Password don't match!");
            return;
        }

        setNewPassword('');
        setConfirmNewPassword('');
        setOpen(false);

        console.log(token)
        try {
            setIsSubmitting(true);
            const response = await fetch('http://localhost:8080/auth/update/pass', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ password: newPassword })
            });

            if (!response.ok) {
                throw new Error('Failed to update password');
            }

            const data = await response.json();
            console.log('Response:', data);

            handleClose();
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCheckboxChange = (event) => {
        setIsChecked(event.target.checked);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handlePasswordChange = (event) => {
        const { name, value } = event.target;

        if (name === 'newPassword') {
            setNewPassword(value);
        } else if (name === 'confirmNewPassword') {
            setConfirmNewPassword(value);
        }
    };

    const togglePasswordVisibility = (field) => {
        switch (field) {
            case 'newPassword':
                setShowNewPassword((prev) => !prev);
                break;
            case 'confirmNewPassword':
                setShowConfirmNewPassword((prev) => !prev);
                break;
            default:
                break;
        }
    };

    return (
        <ThemeProvider theme={darkMode}>
            <Container component="main" maxWidth="sm">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: '10%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth PaperProps={{
                        style: {
                            overflow: 'hidden',
                        },
                    }}>
                        <DialogTitle>Update Password
                            <IconButton
                                edge="end"
                                color="inherit"
                                onClick={handleClose}
                                aria-label="close"
                                sx={{
                                    position: 'absolute',
                                    right: 8,
                                    top: 8,
                                }}
                            >
                                <CloseIcon style={{ marginRight: '10px' }} />
                            </IconButton>
                        </DialogTitle>
                        <DialogContent dividers style={{ overflow: 'hidden' }}>
                            <Grid container spacing={4}>
                                <Grid item xs={6}>
                                    <Input
                                        fullWidth
                                        placeholder="New Password"
                                        name="newPassword"
                                        id="newPassword"
                                        color="success"
                                        type={showNewPassword ? 'text' : 'password'}
                                        value={newPassword}
                                        onChange={handlePasswordChange}
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton onClick={() => togglePasswordVisibility('newPassword')}>
                                                    {showNewPassword ? <Visibility /> : <VisibilityOff />}
                                                </IconButton>
                                            </InputAdornment>
                                        }
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <Input
                                        fullWidth
                                        placeholder="Confirm New Password"
                                        name="confirmNewPassword"
                                        id="confirmNewPassword"
                                        color="success"
                                        type={showConfirmNewPassword ? 'text' : 'password'}
                                        value={confirmNewPassword}
                                        onChange={handlePasswordChange}
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton onClick={() => togglePasswordVisibility('confirmNewPassword')}>
                                                    {showConfirmNewPassword ? <Visibility /> : <VisibilityOff />}
                                                </IconButton>
                                            </InputAdornment>
                                        }
                                    />
                                </Grid>
                            </Grid>
                        </DialogContent>
                        <DialogActions>
                            <Button
                                fullWidth
                                color="success"
                                variant="contained"
                                onClick={handleUpdatePassword}
                                sx={{
                                    borderRadius: 5,
                                    mt: 3,
                                    mb: 2,
                                    width: { xs: '100%', sm: 'auto' },
                                    marginRight: '10px'
                                }}
                                style={{
                                    backgroundColor: '#11BF4E',
                                    color: 'white',
                                }}
                            >
                                Update
                            </Button>
                        </DialogActions>
                    </Dialog>
                </Box>
            </Container>
        </ThemeProvider>
    );
}
