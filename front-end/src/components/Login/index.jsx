import React, { useState, useEffect } from 'react';
import Input from '@mui/material/Input';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import logo from "../../assets/login.png";

const defaultTheme = createTheme();

export default function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const [typedText, setTypedText] = useState('');
  const [textIndex, setTextIndex] = useState(0);
  const texts = [
    'FOR YOUR BUSINESS.',
    'FOR YOUR MARKETING.',
    'FOR YOUR PRODUCT.',
    'FOR YOUR CUSTOMER.'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      const currentText = texts[textIndex];
      if (typedText === currentText) {
        clearInterval(interval);
        const deleteInterval = setInterval(() => {
          setTypedText((prevText) => {
            const newText = prevText.slice(0, -1);
            if (newText === '') {
              setTextIndex((prevIndex) => (prevIndex + 1) % texts.length);
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

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = data.get('email');
    const password = data.get('password');

    if (!validatePassword(password)) {
      alert('A senha deve conter pelo menos uma letra maiúscula, um número e um caractere especial.');
      return;
    }
    console.log({
      email: email,
      password: password,
    });
  };

  const validatePassword = (password) => {
    const uppercaseRegex = /[A-Z]/;
    const numberRegex = /\d/;
    const specialCharRegex = /[@$!%*?&]/;

    const containsUppercase = uppercaseRegex.test(password);
    const containsNumber = numberRegex.test(password);
    const containsSpecialChar = specialCharRegex.test(password);

    return containsUppercase && containsNumber && containsSpecialChar && password.length >= 8;
  };

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
                Sign in to continue to Panda Analysis
              </Typography>
              <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  color='success'
                  required
                  fullWidth
                  autoFocus
                  variant="outlined"
                  placeholder="Email Address"
                  sx={{ width: '90%', marginLeft: '5%', height: '30px', marginBottom: '10px', marginTop: "5%" }}
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
            <Link href="https://github.com/Fluffy-Fatec/Projeto-Integrador-Imagem" variant="body2" sx={{ marginRight: 12, textDecoration: 'none', color: '#11BF4E' }}>
              Visit the project
            </Link>
            <Box mr={1} />
            <Link href="/privacypolicy" variant="body2" sx={{ textDecoration: 'none', color: '#11BF4E' }}>
              Privacy terms
            </Link>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
