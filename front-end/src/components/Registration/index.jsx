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
import axios from 'axios';

const defaultTheme = createTheme();

export default function SignIn() {
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [cellPhone, setCellPhone] = React.useState('');
  const [cpf, setCpf] = React.useState('');
  const [codigo, setCodigo] = React.useState('');

  React.useEffect(() => {
    const urlAtual = window.location.href;
    const partesDaURL = urlAtual.split('/');
    const parteFinalDaURL = partesDaURL[partesDaURL.length - 1];
    setCodigo(parteFinalDaURL);
  }, []);

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
    const regex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/;
    return regex.test(password);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = data.get('email');
    const password = data.get('password');
    const confirmPassword = data.get('confirmPassword');
    const fullName = data.get('fullName');
    const username = data.get('username');

    if (!email || !fullName || !username || !cellPhone || !cpf || !password || !confirmPassword) {
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
      alert('The password must contain at least 8 characters, a lowercase letter, an uppercase letter, a number and a special character!');
      return;
    }

    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    console.log({
      fullName: fullName,
      username: username,
      email: email,
      cellPhone: cellPhone,
      cpf: cpf,
      password: password,
      confirmPassword: confirmPassword
    });

    try {
      const response = await axios.post('http://localhost:8080/auth/register/' + codigo, {
        username: username,
        password: password,
        name: fullName,
        celphone: cellPhone,
        cpf: cpf
      });

      window.location.href = "http://localhost:5173/";

    } catch (error) {
      console.error('Registration error:', error);
      alert('Error when registering. Please check your information and try again.');
    }
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
          <Card sx={{ width: '100%', padding: '15px', }}>
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
                      placeholder="Full Name"
                      name="fullName"
                      id="fullName"
                      sx={{ height: '30px', fontSize: '0.8rem' }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Input
                      required
                      variant="outlined"
                      fullWidth
                      placeholder="Username"
                      name="username"
                      id="username"
                      sx={{ height: '30px', fontSize: '0.8rem' }}
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
                      inputProps={{ maxLength: 14 }}
                      sx={{ height: '30px', fontSize: '0.8rem' }}
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
                      inputProps={{ maxLength: 20 }}
                      endAdornment={
                        <IconButton
                          onClick={togglePasswordVisibility}
                          edge="end"
                          sx={{ p: 1.4 }}
                        >
                          {showPassword ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                        </IconButton>
                      }
                      sx={{ height: '30px', fontSize: '0.8rem' }}
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
                      inputProps={{ maxLength: 20 }}
                      endAdornment={
                        <IconButton
                          onClick={toggleConfirmPasswordVisibility}
                          edge="end"
                          sx={{ p: 1.4 }}
                        >
                          {showConfirmPassword ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                        </IconButton>
                      }
                      sx={{ height: '30px', fontSize: '0.8rem' }}
                    />
                  </Grid>
                </Grid>
                <Box mt={2}>
                  <Typography sx={{ fontSize: '0.73rem', marginBottom: '2%', color: "#5F5F5F" }}>
                    By submitting, I agree to the processing of my personal data by Fluffy Tech in accordance with the
                    <a href="#" style={{ color: '#11BF4E' }}> Privacy Policy</a>.
                    I understand that I can change my preferences at any time.
                  </Typography>
                </Box>
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
