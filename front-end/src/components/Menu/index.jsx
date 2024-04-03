import React from 'react';
import { styled, useTheme, ThemeProvider, createTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import Logo from "../../assets/pandalyze.png";
import StorageIcon from '@mui/icons-material/Storage';
import DashboardIcon from '@mui/icons-material/Dashboard';
import DocumentationIcon from '@mui/icons-material/Description';
import SettingsIcon from '@mui/icons-material/Settings';
import TroubleshootIcon from '@mui/icons-material/Troubleshoot';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid'


const drawerWidth = 240;

const openedMixin = (theme) => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
});

const iconMap = {
    'Data Source': StorageIcon,
    'Dashboard': DashboardIcon,
    'Documentation': DocumentationIcon,
    'Monitoring': TroubleshootIcon,
    'Settings': SettingsIcon,
    'Logout': ExitToAppIcon,
};

const closedMixin = (theme) => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
    },
});

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        ...(open && {
            ...openedMixin(theme),
            '& .MuiDrawer-paper': openedMixin(theme),
        }),
        ...(!open && {
            ...closedMixin(theme),
            '& .MuiDrawer-paper': closedMixin(theme),
        }),
    }),
);

const menuItems = [
    'Data Source',
    'Dashboard',
    'Documentation',
    'Monitoring',
    'Settings',
    'Logout',
];

const themeLight = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#FFFFFF',
        },
        secondary: {
            main: '#F5F5F5',
        },
        background: {
            default: '#F5F5F5',
        },
        text: {
            primary: '#5F5F5F',
            secondary: '#757575',
        },
    },
});

const themeDark = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#90caf9',
        },
        secondary: {
            main: '#ff4081',
        },
        background: {
            default: '#121212',
        },
        text: {
            primary: '#ffffff',
            secondary: '#bdbdbd',
        },
    },
});

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    height: '105px', // Defina a altura desejada aqui
}));

export default function Menu() {
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);
    const [clickedIndex, setClickedIndex] = React.useState(null);
    const [darkMode, setDarkMode] = React.useState(false);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const handleItemClick = (index) => {
        setClickedIndex(index);
    };

    const handleLogout = () => {
        console.log('Realizar logout');
    };

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };

    return (
        <ThemeProvider theme={darkMode ? themeDark : themeLight}>
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                <AppBar position="fixed" style={{ boxShadow: 'none' }} open={open}>
                    <Toolbar>
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            onClick={handleDrawerOpen}
                            edge="start"
                            sx={{
                                marginRight: 5,
                                ...(open && { display: 'none' }),
                            }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h6" noWrap component="div" style={{ marginRight: '30%', display: 'flex', alignItems: 'center' }}>
                            {clickedIndex !== null && (
                                <>
                                    <ListItemIcon style={{ color: '#11BF4E' }}>
                                        {React.createElement(iconMap[menuItems[clickedIndex]])}
                                    </ListItemIcon>
                                    {menuItems[clickedIndex]}
                                </>
                            )}
                        </Typography>
                    </Toolbar>
                    <Divider sx={{ borderBlockWidth: 1 }} />
                </AppBar>
                <Drawer variant="permanent" PaperProps={{ sx: { borderRadius: '20px' } }} open={open}>
                    <DrawerHeader sx={{
                        backgroundImage: `url(${Logo})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat'
                    }} >
                        <IconButton onClick={handleDrawerClose}>
                            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                        </IconButton>
                    </DrawerHeader>
                    <Divider />
                    {open && (
                        <>
                            <Divider />
                            <Typography variant="subtitle2" sx={{ ml: 2, mt: 1, mb: 1, color: '#606060' }}>
                                User
                            </Typography>
                            <Divider sx={{ ml: 2, mr: 2, mb: 1, color: '#606060' }} />
                        </>
                    )}
                    <List>
                        {['Data Source', 'Dashboard', 'Documentation'].map((text, index) => (
                            <ListItem key={text} disablePadding>
                                <ListItemButton
                                    onClick={() => handleItemClick(index)}
                                    sx={{
                                        height: '40px',
                                        borderRadius: clickedIndex === index ? '20px' : '0',
                                        backgroundColor: clickedIndex === index
                                            ? '#EAEAEA' : 'transparent',
                                    }}
                                >
                                    <ListItemIcon
                                        sx={{
                                            color: clickedIndex === index ? '#11BF4E' : undefined,
                                        }}
                                    >
                                        {React.createElement(iconMap[text])}
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={text}
                                        sx={{
                                            opacity: open ? 1 : 0,
                                            color: clickedIndex === index ? '#11BF4E' : undefined,
                                        }}
                                    />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                    {open && (
                        <>
                            <Divider />
                            <Typography variant="subtitle2" sx={{ ml: 2, mt: 1, mb: 1, color: '#606060' }}>
                                Administrator
                            </Typography>
                            <Divider sx={{ ml: 2, mr: 2, mb: 1, color: '#606060' }} />
                        </>
                    )}
                    {['Monitoring', 'Settings'].map((text, index) => (
                        <ListItem key={text} disablePadding>
                            <ListItemButton
                                onClick={() => handleItemClick(index + 3)}
                                sx={{
                                    height: '40px',
                                    borderRadius: clickedIndex === index + 3 ? '10px' : '0',
                                    backgroundColor: clickedIndex === index + 3
                                        ? '#EAEAEA' : 'transparent',
                                }}
                            >
                                <ListItemIcon
                                    sx={{
                                        color: clickedIndex === index + 3 ? '#11BF4E' : undefined,
                                    }}
                                >
                                    {React.createElement(iconMap[text])}
                                </ListItemIcon>
                                <ListItemText
                                    primary={text}
                                    sx={{
                                        opacity: open ? 1 : 0,
                                        color: clickedIndex === index + 3 ? '#11BF4E' : undefined,
                                    }}
                                />
                            </ListItemButton>
                        </ListItem>
                    ))}
                    <Box sx={{ flexGrow: 1 }} />
                    <List>
                        <ListItem disablePadding>
                            <ListItemButton
                                onClick={handleLogout}
                                sx={{
                                    height: '40px',
                                    borderRadius: '10px',
                                    backgroundColor: clickedIndex === 'logout' ? '#f0f0f0' : 'transparent',
                                }}
                            >
                                <ListItemIcon sx={{ color: clickedIndex === 'logout' ? '#11BF4E' : undefined }}>
                                    <ExitToAppIcon />
                                </ListItemIcon>
                                <ListItemText
                                    primary="Logout"
                                    sx={{
                                        opacity: 1,
                                        color: clickedIndex === 'logout' ? '#11BF4E' : undefined,
                                    }}
                                />
                            </ListItemButton>
                        </ListItem>
                    </List>
                </Drawer>
                <Box component="main" sx={{ p: 10 }}>
    <Box sx={1}>
        <Box display="grid" gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }} gap={2}>
            <Box>
            <Item sx={{ height: '230px', width: '100px' }}>A</Item>
            </Box>
            <Box>
                <Item sx={{ height: '50px' }}>B</Item>
            </Box>
            <Box>
                <Item sx={{ height: '50px' }}>C</Item>
            </Box>
            <Box>
                <Item sx={{ height: '50px' }}>D</Item>
            </Box>
            <Box>
                <Item sx={{ height: '50px' }}>E</Item>
            </Box>
            <Box>
                <Item sx={{ height: '50px' }}>F</Item>
            </Box>
            <Box>
                <Item sx={{ height: '50px' }}>G</Item>
            </Box>
        </Box>
    </Box>
</Box>



                <IconButton
                    onClick={toggleDarkMode}
                    sx={{
                        position: 'fixed',
                        bottom: '16px',
                        right: '16px',
                        color: darkMode ? 'white' : 'black',
                        backgroundColor: darkMode ? 'black' : 'white',
                    }}
                >
                    {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
                </IconButton>
            </Box>
        </ThemeProvider>
    );
}
