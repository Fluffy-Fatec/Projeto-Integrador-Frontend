import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import IconButton from '@mui/material/IconButton';
import Input from '@mui/material/Input';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import axios from 'axios';
import Cookies from 'js-cookie';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from "../../assets/login.png";

const defaultTheme = createTheme();

export default function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [typedText, setTypedText] = useState('');
  const [textIndex, setTextIndex] = useState(0);
  const texts = [
    'FOR YOUR BUSINESS.',
    'FOR YOUR MARKETING.',
    'FOR YOUR PRODUCT.',
    'FOR YOUR CUSTOMER.'
  ];
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%?&##_])[A-Za-z\d@$!%?&##_]{8,20}$/;
    if (!passwordRegex.test(password)) {
      console.error('Password must contain at least 8 characters, one uppercase letter, one lowercase letter, and one special character.');

      alert('Password must contain at least 8 characters, one uppercase letter, one lowercase letter, and one special character.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:8080/auth/login', {
        username: username,
        password: password
      });
      localStorage.setItem('username', username);

      const token = response.data.token;
      Cookies.set('token', token);

      const role = response.data.role;
      Cookies.set('role', role);

      navigate('/dashboard');

    } catch (error) {
      localStorage.setItem('username', username);
      console.error('Login error:', error.response.data.message);
      if (error.response && error.response.data) {
        if (error.response.data.message === "No Accepted") {
          navigate('/privacy');
          localStorage.setItem('loginErrorUsername', username);
          alert("You did not accept the terms of acceptance, so you do not have permission to access the platform.");
        } else if (error.response.data.message === "First time term") {
          alert("This is your first time logging in. Please accept the terms of service.");
          navigate('/privacy');
        } else {
          alert('Error logging in. Please check your credentials and try again.');
        }
      } else {
        alert('Error logging in. Please check your credentials and try again.');
      }
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const currentText = texts[textIndex];
      const nextIndex = (textIndex + 1) % texts.length;
      if (typedText === currentText) {
        clearInterval(interval);
        const deleteInterval = setInterval(() => {
          setTypedText((prevText) => {
            const newText = prevText.slice(0, -1);
            if (newText === '') {
              setTextIndex(nextIndex);
              clearInterval(deleteInterval);
            }
            return newText;
          });
        }, 100);
      } else {
        setTypedText((prevText) => currentText.substring(0, prevText.length + 1));
      }
    }, 300);
    return () => clearInterval(interval);
  }, [textIndex, typedText, texts]);

  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <Container component="main" maxWidth="xs">
        <Box sx={{ marginTop: '20%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography sx={{ fontSize: '0.8rem', textAlign: 'center', color: '#5F5F5F' }}>
            <span style={{ color: '#5F5F5F' }}>WELCOME</span> TO THE IA ANALYSIS  <span style={{ color: '#11BF4E' }}>{typedText}</span>
          </Typography>
          <Card sx={{ width: '100%' }}>
            <CardContent>
              <img src={logo} alt="Logo" style={{ width: '50%', marginBottom: '20px', marginLeft: '25%', marginTop: '12px' }} />
              <Typography sx={{ fontSize: '0.9rem', textAlign: 'center', color: '#5F5F5F' }}>
                Sign in to continue to Pandalyze
              </Typography>
              <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                <Input
                  type="text"
                  id="username"
                  name="username"
                  color='success'
                  required
                  fullWidth
                  autoFocus
                  variant="outlined"
                  placeholder="Username"
                  sx={{ width: '90%', marginLeft: '5%', height: '30px', marginBottom: '10px', marginTop: "5%" }}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <Input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  required
                  color='success'
                  variant="outlined"
                  fullWidth
                  placeholder="Password"
                  endAdornment={
                    <IconButton
                      onClick={togglePasswordVisibility}
                      edge="end"
                      sx={{ p: '4px', marginRight: '5px' }}
                    >
                      {showPassword ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                    </IconButton>
                  }
                  sx={{ width: '90%', marginLeft: '5%', height: '30px', marginBottom: '15%', marginTop: "5%" }}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{
                    borderRadius: 5,
                    mt: 3,
                    mb: 2,
                    width: '90%',
                    margin: '0 auto',
                  }}
                  style={{
                    backgroundColor: '#11BF4E',
                    marginLeft: '5%'
                  }}
                >
                  Login
                </Button>
              </Box>
            </CardContent>
          </Card>
          <Box mt={6} display="flex" justifyContent="space-between">
            <Link href="https://github.com/Fluffy-Fatec/Projeto-Integrador-Imagem" variant="body2" sx={{ marginRight: -1, textDecoration: 'none', color: '#11BF4E' }}>
              Visit the project
            </Link>
            <Box mr={1} />
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
