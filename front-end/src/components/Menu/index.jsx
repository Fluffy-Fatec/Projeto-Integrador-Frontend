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
import Modal from '@mui/material/Modal';
import Paper from '@mui/material/Paper';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Logo from "../../assets/pandalyze.png";
// About
import EmailIcon from '@mui/icons-material/Email';
import GitHubIcon from '@mui/icons-material/GitHub';
import InfoIcon from '@mui/icons-material/Info';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Person2Icon from '@mui/icons-material/Person2';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import Badge from '@mui/material/Badge';
import { ThemeProvider, createTheme, styled, useTheme } from '@mui/material/styles';
import Cookies from 'js-cookie';
import AppDataSource from '../DataSource';
import GridDashboard from '../GridDashboard';
import GridManageAccounts from '../GridManageAccounts';
import UserUpdateGrid from '../UserUpdateGrid';
import Tab from '../Tab';

const drawerWidth = 240;

const openedMixin = (theme) => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
});
const useAdmin = () => {
    const [admin, setAdmin] = useState(false);

    useEffect(() => {

        const role = Cookies.get("role");
        if (role === "admin") {
            setAdmin(true);
        } else {
            setAdmin(false);
        }
    }, []);

    return admin;
};

const iconMap = {
    'Data Source': StorageIcon,
    'Dashboard': DashboardIcon,
    'Documentation': DocumentationIcon,
    'My Profile': Person2Icon,
    'Monitoring': TroubleshootIcon,
    'User Management': ManageAccountsIcon,
    'Logout': ExitToAppIcon,
    'About': InfoIcon,
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
        overflowX: 'auto',
        '-webkit-overflow-scrolling': 'touch',
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
            main: '#888888',
        },
        secondary: {
            main: '#888888',
        },
        background: {
            default: '#121212',
        },
        text: {
            primary: '#888888',
            secondary: '#888888',
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

const menuItems = ['Data Source', 'Dashboard', 'Documentation', 'My Profile', 'Monitoring', 'User Management', 'About', 'Logout'];

function AboutModal({ open, onClose, darkMode }) {
    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '500px',
                borderRadius: 5,
                bgcolor: 'background.paper',
                boxShadow: 24,
                p: 4,
            }}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    <strong>About</strong>
                </Typography>
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                    @Pandalyze is a platform that, with data, returns valuable insights for your company.
                    <br /><br />
                    @Fluffy is a university project group that developed the entire platform.
                    <br /><br />
                    <strong>Version Application:</strong> 3.0.0
                    <br />
                    <strong>Version IA:</strong> 3.0.0
                    <br /><br />
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <a href="https://github.com/Fluffy-Fatec/Projeto-Integrador-Imagem" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
                            <GitHubIcon sx={{ marginRight: '5px', color: '#3c3c3c' }} />
                        </a>
                        <a href="mailto:fluffyfatec@gmail.com" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', color: 'black' }}>
                            <EmailIcon sx={{ marginRight: '5px', color: '#db4a39' }} />
                        </a>
                    </div>
                </Typography>
            </Box>
        </Modal>
    );
}
function NotificationMenu({ open, onClose, notifications, markNotificationsAsRead }) {

    const handleClose = () => {
        markNotificationsAsRead();
        onClose();
    };

    return (
        <>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="notification-menu-title"
                aria-describedby="notification-menu-description"
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        maxWidth: '90%',
                        width: 'auto',
                        minWidth: '800px',
                        bgcolor: 'background.paper',
                        p: 4,
                        borderRadius: '10px',
                    }}
                >
                    <Typography variant="h6" component="h2" gutterBottom>
                        Notifications
                    </Typography>
                    {notifications.length === 0 ? (
                        <Typography variant="body1" gutterBottom>
                            There are no notifications
                        </Typography>
                    ) : (
                        <List>
                            {notifications.map((notification, index) => (
                                <div key={index}>
                                    <ListItem>
                                        <ListItemText primary={notification.mensagem} />
                                        <div style={{ width: 24 }} />
                                        {notification.flag_notificacao === "1" ? (
                                            <ListItemIcon>
                                                <VisibilityIcon />
                                            </ListItemIcon>
                                        ) : (
                                            <ListItemIcon>
                                                <VisibilityOffIcon />
                                            </ListItemIcon>
                                        )}
                                    </ListItem>
                                    <Divider />
                                </div>
                            ))}
                        </List>
                    )}
                </Box>
            </Modal>
        </>
    );
}


export default function Menu() {
    const theme = useTheme();
    const [open, setOpen] = useState(false);
    const [clickedIndex, setClickedIndex] = useState(1);
    const [darkMode, setDarkMode] = useState(false);
    const [clickedButtons, setClickedButtons] = useState([]);
    const [openAboutModal, setOpenAboutModal] = useState(false);
    const [openNotifications, setOpenNotifications] = useState(false);
    const isAdmin = useAdmin();
    const token = Cookies.get("token");
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await axios.get('http://localhost:8080/auth/field/notification', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                if (response && response.data && Array.isArray(response.data)) {
                    setNotifications(response.data);
                } else {
                    console.error('Empty or invalid format notification data:', response);
                }
            } catch (error) {
                console.error('Error fetching notifications:', error);
            }
        };

        fetchNotifications();
    }, [token]);

    const markNotificationsAsRead = async () => {
        try {
            const updatedNotifications = [];

            for (const notification of notifications) {
                if (notification.flag_notificacao === "0") {
                    await axios.put(`http://localhost:8080/auth/notification/update/${notification.id}`, {}, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                    notification.flag_notificacao = "1";
                    updatedNotifications.push(notification);
                } else {
                    updatedNotifications.push(notification);
                }
            }
            setNotifications(updatedNotifications);
        } catch (error) {
            console.error('Error marking notifications as read:', error);
        }
    };

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const handleItemClick = (index) => {
        setClickedIndex(index);
        setOpen(true);
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

    const handleOpenAboutModal = () => {
        setOpenAboutModal(true);
    };

    const handleCloseAboutModal = () => {
        setOpenAboutModal(false);
    };

    const toggleNotifications = () => {
        setOpenNotifications(!openNotifications);
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
                        <Typography variant="h6" noWrap component="div" style={{ marginRight: 'auto', display: 'flex', alignItems: 'center' }}>
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
                        <Box sx={{ marginLeft: 'auto' }}> {/* Adicionando espaçamento entre os elementos */}
                            <IconButton
                                onClick={toggleNotifications}
                                size="large"
                                aria-label="show notifications"
                                color="inherit"
                            >
                                <Badge badgeContent={notifications.filter(notification => notification.flag_notificacao === "0").length} color="error">
                                    <NotificationsIcon />
                                </Badge>
                            </IconButton>
                        </Box>
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
                                    disabled={text === 'Documentation'}
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
                    {isAdmin && open && (
                        <>
                            <Divider />
                            <Typography variant="subtitle2" sx={{ ml: 2, mt: 1, mb: 1, color: '#606060' }}>
                                Administrator
                            </Typography>
                            <Divider sx={{ ml: 2, mr: 2, mb: 1, color: '#606060' }} />
                        </>
                    )}
                    {isAdmin && menuItems.slice(4, 6).map((text, index) => (
                        <ListItem key={text} disablePadding>
                            <ListItemButton
                                onClick={() => handleItemClick(index + 4)}
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
                    <Divider sx={{ mt: 2, mb: 1 }} />
                    <ListItem disablePadding>
                        <ListItemButton
                            onClick={handleOpenAboutModal}
                            sx={{
                                height: '40px',
                                borderRadius: '10px',
                            }}
                        >
                            <ListItemIcon>
                                <InfoIcon />
                            </ListItemIcon>
                            <ListItemText primary="About" />
                        </ListItemButton>
                    </ListItem>
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
                <Box component="main" sx={{ p: 3 }}>
                    {clickedIndex === 0 && <AppDataSource darkMode={darkMode} token={token} theme={theme} />}
                    {clickedIndex === 1 && <GridDashboard darkMode={darkMode} token={token} theme={theme} />}
                    {clickedIndex === 3 && <UserUpdateGrid darkMode={darkMode} token={token} theme={theme} />}
                    {isAdmin && clickedIndex === 4 && <Tab token={token} darkMode={darkMode} theme={theme} />}

                    {isAdmin && clickedIndex === 5 && <GridManageAccounts token={token} darkMode={darkMode} theme={theme} />}
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
            <AboutModal open={openAboutModal} onClose={handleCloseAboutModal} />
            <NotificationMenu
                open={openNotifications}
                onClose={() => setOpenNotifications(false)}
                notifications={notifications}
                markNotificationsAsRead={markNotificationsAsRead}
            />
        </ThemeProvider>
    );
}