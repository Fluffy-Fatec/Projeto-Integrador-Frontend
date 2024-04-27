import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import * as React from 'react';

const defaultTheme = createTheme();

export default function SignIn() {
    const [isChecked, setIsChecked] = React.useState(false);
    const [open, setOpen] = React.useState(false);

    const handleCheckboxChange = (event) => {
        setIsChecked(event.target.checked);
    };

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
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
                    <Button variant="outlined" onClick={handleOpen}>
                        Open Popup
                    </Button>
                    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
                        <DialogTitle>Privacy Policy</DialogTitle>
                        <DialogContent dividers>
                            <Typography sx={{ fontSize: '1rem', marginBottom: '2%', color: "#5F5F5F", textAlign: 'justify' }}>
                                {/* Your privacy policy content here. Add more text or components */}
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus quis felis nec leo accumsan vestibulum. In at augue nec eros scelerisque auctor. Maecenas auctor vestibulum leo, ac convallis velit pulvinar at. Fusce volutpat diam eu neque faucibus, vel pharetra purus consequat. Quisque nec turpis sit amet arcu aliquet eleifend at at nibh. Curabitur nec scelerisque odio. Donec sit amet quam in odio tincidunt placerat. Curabitur nec aliquet urna, non interdum justo. Nulla nec nulla eu lacus laoreet congue.
                            </Typography>
                            <Grid item xs={12} sx={{ textAlign: 'justify' }}>
                                <Typography variant="subtitle1" sx={{ marginBottom: 1, fontSize: '0.8rem' }}>
                                    <Checkbox
                                        color="success"
                                        checked={isChecked}
                                        onChange={handleCheckboxChange}
                                        size="small"
                                    />
                                    <label sx={{ textAlign: 'justify' }}>
                                        By checking this box, I agree to the processing of my personal data by Fluffy Tech in accordance with the Privacy Policy.
                                    </label>
                                </Typography>
                            </Grid>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleClose}>Close</Button>
                        </DialogActions>
                    </Dialog>
                </Box>
            </Container>
        </ThemeProvider>
    );
}
