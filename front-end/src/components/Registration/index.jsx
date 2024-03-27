import * as React from 'react';
import Input from '@mui/material/Input';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

const defaultTheme = createTheme();

export default function SignIn() {
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [cellPhone, setCellPhone] = React.useState('');
  const [cpf, setCpf] = React.useState('');

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
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

  const validatePassword = (password) => {
    const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]+$/;
    return regex.test(password);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = data.get('email');
    const password = data.get('password');
    const confirmPassword = data.get('confirmPassword');
    const firstName = data.get('firstName');
    const surname = data.get('surname');

    if (!email || !firstName || !surname || !cellPhone || !cpf || !password || !confirmPassword) {
      alert('There are empty fields!');
      return;
    }

    if (email.indexOf('@') === -1) {
      alert('Invalid email!');
      return;
    }

    if (cellPhone.length != 15) {
      alert('Invalid cell phone number!');
      return;
    }

    if (cpf.length != 14) {
      alert('Invalid CPF!');
      return;
    }

    if (!validatePassword(password)) {
      alert('The password must contain at least one capital letter, one number and one special character!');
      return;
    }

    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    console.log({
      name: firstName + ' ' + surname,
      email: email,
      cellPhone: cellPhone,
      cpf: cpf,
      password: password,
      confirmPassword: confirmPassword
    });
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
          <Card sx={{ width: '100%' }}>
            <CardContent>
              <Typography sx={{ fontSize: '1.4rem', marginBottom: '2%', color: "#5F5F5F" }}>
                We are almost there...
              </Typography>
              <Typography sx={{ fontSize: '0.8rem', marginBottom: '2%', color: "#5F5F5F" }}>
                Complete your registration and accept the privacy terms to have<br /> full access to the platform.
              </Typography>
              <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Input
                      type="text"
                      required
                      fullWidth
                      autoFocus
                      variant="outlined"
                      placeholder="First Name"
                      name="firstName"
                      id="firstName"
                      sx={{ height: '30px' }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Input
                      required
                      variant="outlined"
                      fullWidth
                      placeholder="Surname"
                      name="surname"
                      id="surname"
                      sx={{ height: '30px' }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Input
                      type="email"
                      required
                      fullWidth
                      variant="outlined"
                      placeholder="Email"
                      name="email"
                      id="email"
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
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Input
                      value={cpf}
                      onChange={(e) => formatCPF(e.target.value)}
                      required
                      fullWidth
                      variant="outlined"
                      placeholder="CPF"
                      name="cpf"
                      id="cpf"
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Input
                      required
                      type={showPassword ? "text" : "password"}
                      fullWidth
                      variant="outlined"
                      placeholder="Password"
                      name="password"
                      id="password"
                      endAdornment={
                        <IconButton
                          onClick={togglePasswordVisibility}
                          edge="end"
                          sx={{ p: 1.4 }}
                        >
                          {showPassword ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                        </IconButton>
                      }
                      sx={{ height: '30px' }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Input
                      required
                      type={showConfirmPassword ? "text" : "password"}
                      fullWidth
                      variant="outlined"
                      placeholder="Confirm Password"
                      name="confirmPassword"
                      id="confirmPassword"
                      endAdornment={
                        <IconButton
                          onClick={toggleConfirmPasswordVisibility}
                          edge="end"
                          sx={{ p: 1.4 }}
                        >
                          {showConfirmPassword ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                        </IconButton>
                      }
                      sx={{ height: '30px' }}
                    />
                  </Grid>
                </Grid>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{
                    borderRadius: 10,
                    mt: 2,
                    mb: 1,
                    width: '90%',
                    marginLeft: '5%',
                  }}
                  style={{
                    backgroundColor: '#11BF4E',
                    marginTop: '5%'
                  }}
                >
                  Finalize Registration
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
