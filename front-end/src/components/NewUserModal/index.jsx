import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Input from '@mui/material/Input';

const defaultTheme = createTheme();

export default function SignIn({ token }) {
    const [open, setOpen] = React.useState(true);
    const [email, setEmail] = React.useState('');
    const [emailError, setEmailError] = React.useState(false);
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    const handleClose = () => {
        setOpen(false);
    };

    const handleUpdatePassword = async () => {
        if (isSubmitting) {
            return;
        }

        const gmailPattern = /^[a-zA-Z0-9._%+-]+@gmail.com$/;
        if (!gmailPattern.test(email)) {
            setEmailError(true);
            alert('Please enter a valid Gmail address.');
            return;
        }

        try {
            setIsSubmitting(true);
            const response = await fetch('http://localhost:8080/auth/invite', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ email_invited: email })
            });

            if (!response.ok) {
                throw new Error('Failed to send invitation');
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

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
        setEmailError(false);
    };

    return (
        <ThemeProvider theme={defaultTheme}>
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
                    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
                        <DialogTitle>New User</DialogTitle>
                        <DialogContent dividers>
                            <Input
                                color='success'
                                type="email"
                                id="email"
                                name="email"
                                required
                                fullWidth
                                autoFocus
                                variant="outlined"
                                placeholder="E-mail"
                                sx={{ width: '90%', marginLeft: '5%', height: '30px', marginBottom: '10px', marginTop: "10px" }}
                                value={email}
                                onChange={handleEmailChange}
                                error={emailError}
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button
                                fullWidth
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
                                disabled={isSubmitting}
                            >
                                Send
                            </Button>
                            <Button
                                fullWidth
                                variant="outlined"
                                onClick={handleClose}
                                sx={{
                                    borderRadius: 5,
                                    mt: 3,
                                    mb: 2,
                                    width: { xs: '100%', sm: 'auto' },
                                    marginRight: '10px',
                                    color: '#11BF4E',
                                    borderColor: '#11BF4E',
                                }}
                            >
                                Close
                            </Button>
                        </DialogActions>
                    </Dialog>
                </Box>
            </Container>
        </ThemeProvider>
    );
}