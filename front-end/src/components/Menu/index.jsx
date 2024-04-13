import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import DashboardIcon from '@mui/icons-material/Dashboard';
import DocumentationIcon from '@mui/icons-material/Description';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import MenuIcon from '@mui/icons-material/Menu';
import StorageIcon from '@mui/icons-material/Storage';
import TroubleshootIcon from '@mui/icons-material/Troubleshoot';
import MuiAppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import MuiDrawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { ThemeProvider, createTheme, styled, useTheme } from '@mui/material/styles';
import React from 'react';
import Logo from "../../assets/pandalyze.png";
import GridDashboard from '../GridDashboard';
import Person2Icon from '@mui/icons-material/Person2';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import UserUpdateGrid from '../UserUpdateGrid';
import GridManageAccounts from '../GridManageAccounts';

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
    'My Profile': Person2Icon,
    'Monitoring': TroubleshootIcon,
    'User Management': ManageAccountsIcon,
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
    height: '105px',
}));

const menuItems = ['Data Source', 'Dashboard', 'Documentation', 'My Profile', 'Monitoring', 'User Management', 'Logout'];

export default function Menu() {
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);
    const [clickedIndex, setClickedIndex] = React.useState(1); 
    const [darkMode, setDarkMode] = React.useState(false);
    const [clickedButtons, setClickedButtons] = React.useState([]);


    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const handleItemClick = (index) => {
        if (index === clickedIndex) {
            setOpen(!open);
        } else {
            setClickedIndex(index);
            setOpen(true);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        window.location.href = '/'; 
    };
    

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };

    const handleButtonClick = (text) => {
        if (!clickedButtons.includes(text)) {
            setClickedButtons([...clickedButtons, text]);
        }
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
                            {clickedIndex !== null ? (
                                <>
                                    <ListItemIcon style={{ color: '#11BF4E' }}>
                                        {React.createElement(iconMap[menuItems[clickedIndex]])}
                                    </ListItemIcon>
                                    {menuItems[clickedIndex]}
                                </>
                            ) : (
                                <>
                                    <ListItemIcon style={{ color: '#11BF4E' }}>
                                        {React.createElement(iconMap['Dashboard'])}
                                    </ListItemIcon>
                                    {'Dashboard'}
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
                        {menuItems.slice(0, 4).map((text, index) => (
                            <ListItem key={text} disablePadding>
                                <ListItemButton
                                    onClick={() => handleItemClick(index)}
                                    disabled={text === 'Data Source' || text === 'Documentation'} // Desabilita os itens 'Data Source', 'Monitoring' e 'Documentation'

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
                    {menuItems.slice(4, 6).map((text, index) => (
                        <ListItem key={text} disablePadding>
                            <ListItemButton
                                onClick={() => handleItemClick(index + 4)}
                                disabled={ text === 'Monitoring'} // Desabilita os itens 'Data Source', 'Monitoring' e 'Documentation'

                                sx={{
                                    height: '40px',
                                    borderRadius: clickedIndex === index + 4 ? '10px' : '0',
                                    backgroundColor: clickedIndex === index + 4
                                        ? '#EAEAEA' : 'transparent',
                                }}
                            >
                                <ListItemIcon
                                    sx={{
                                        color: clickedIndex === index + 4 ? '#11BF4E' : undefined,
                                    }}
                                >
                                    {React.createElement(iconMap[text])}
                                </ListItemIcon>
                                <ListItemText
                                    primary={text}
                                    sx={{
                                        opacity: open ? 1 : 0,
                                        color: clickedIndex === index + 4 ? '#11BF4E' : undefined,
                                    }}
                                />
                            </ListItemButton>
                        </ListItem>
                    ))}
                    <Box sx={{ flexGrow: 1 }} />
                    <List>
                        {clickedButtons.map((text) => (
                            <ListItem key={text} disablePadding>
                                <ListItemButton
                                    onClick={() => handleItemClick(text)}
                                    sx={{
                                        height: '40px',
                                        borderRadius: clickedIndex === text ? '10px' : '0',
                                        backgroundColor: clickedIndex === text ? '#EAEAEA' : 'transparent',
                                    }}
                                >
                                    <ListItemIcon
                                        sx={{
                                            color: clickedIndex === text ? '#11BF4E' : undefined,
                                        }}
                                    >
                                        {React.createElement(iconMap[text])}
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={text}
                                        sx={{
                                            opacity: open ? 1 : 0,
                                            color: clickedIndex === text ? '#11BF4E' : undefined,
                                        }}
                                    />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                    <ListItem disablePadding>
                        <ListItemButton
                            onClick={handleLogout}
                            sx={{
                                height: '40px',
                                borderRadius: '10px',
                            }}
                        >
                            <ListItemIcon>
                                <ExitToAppIcon />
                            </ListItemIcon>
                            <ListItemText primary="Logout" />
                        </ListItemButton>
                    </ListItem>
                </Drawer>
                <Box component="main" sx={{ p: 2 }}>
                    {clickedIndex === 1 && <GridDashboard darkMode={darkMode} theme={theme} />}

                    {clickedIndex === 3 && <UserUpdateGrid darkMode={darkMode} theme={theme} />}
                    {clickedIndex === 5 && <GridManageAccounts darkMode={darkMode} theme={theme} />}
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
