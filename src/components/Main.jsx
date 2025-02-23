import { useState } from 'react';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  styled
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import StorageIcon from '@mui/icons-material/Storage';
import CloudQueueIcon from '@mui/icons-material/CloudQueue';
import DynamoTable from './DynamoTable';

const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: 0,
    ...(open && {
      transition: theme.transitions.create('margin', { 
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: drawerWidth,
    }),
  }),
);

const MainLayout = () => {
  const [open, setOpen] = useState(true);
  const [selectedView, setSelectedView] = useState('dynamodb');

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const menuItems = [
    { text: 'DynamoDB Data', icon: <StorageIcon />, value: 'dynamodb' },
    { text: 'Kubernetes Data', icon: <CloudQueueIcon />, value: 'kubernetes' }
  ];

  return (
    <Box sx={{ display: 'flex' }}>
      {/* App Bar */}
      <AppBar 
        position="fixed" 
        sx={{ 
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: '#000'
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="toggle drawer"
            onClick={handleDrawerToggle}
            edge="start"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Dashboard
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Drawer
        variant="persistent"
        anchor="left"
        open={open}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            marginTop: '64px', // height of AppBar
            backgroundColor: '#f5f5f5',
          },
        }}
      >
        <List>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                selected={selectedView === item.value}
                onClick={() => setSelectedView(item.value)}
                sx={{
                  '&.Mui-selected': {
                    backgroundColor: '#e0e0e0',
                  },
                  '&:hover': {
                    backgroundColor: '#e8e8e8',
                  },
                }}
              >
                <ListItemIcon>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>

      {/* Main Content */}
      <Main open={open}>
        <Toolbar /> {/* Spacing for AppBar */}
        <Box sx={{ mt: 2 }}>
          {selectedView === 'dynamodb' ? (
            <DynamoTable />
          ) : (
            <Box sx={{ p: 3 }}>
              <Typography variant="h5">
                Kubernetes Data
              </Typography>
              <Typography variant="body1" sx={{ mt: 2 }}>
                Kubernetes data view will be implemented here.
              </Typography>
            </Box>
          )}
        </Box>
      </Main>
    </Box>
  );
};

export default MainLayout;