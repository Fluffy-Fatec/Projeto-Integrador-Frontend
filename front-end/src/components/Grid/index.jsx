import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid'

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  height: '105px', // Defina a altura desejada aqui
}));

export default function CSSGrid() {
  return (
    <Box sx={1}>

      <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gap={2}>

        <Box gridColumn="span 4" gridRow="1 / span 2"> {/* Defina gridRow para ocupar duas linhas */}
          <Item sx={{ height: '230px' }}>A</Item> {/* Aumenta a altura do primeiro item */}
        </Box>

        <Box gridColumn="span 4">
        <Item>B</Item>
        </Box>

        <Box gridColumn="span 4">
          <Item>C</Item>
        </Box>

        <Box gridColumn="span 4">
          <Item>D</Item>
        </Box>

        <Box gridColumn="span 4">
          <Item>E</Item>
        </Box>

        <Box gridColumn="span 4">
          <Item sx={{ height: '230px' }}>F</Item>
        </Box>

        <Box gridColumn="span 8">
          <Item sx={{ height: '230px' }}>G</Item>
        </Box>

      </Box>

    </Box>
  );
}