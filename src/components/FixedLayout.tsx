import React from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import { useLocation } from 'react-router-dom';

import { MdDashboard, MdInventory2, MdPalette, MdLayers, MdMenu } from 'react-icons/md';
import { LuLogOut } from 'react-icons/lu';
import type { RootState } from '../store/store';


const drawerWidth = 260;

const adminNavItems = [
  { id: 'dashboard', label: 'Dashboard', href: '/', icon: MdDashboard },
  { id: 'add-stock', label: 'Add Stock', href: '/add-stock', icon: MdInventory2 },
  { id: 'add-design', label: 'Add Design', href: '/add-design', icon: MdPalette },
  { id: 'add-varient', label: 'Add Varient', href: '/add-varient', icon: MdLayers },
  { id:'users', label: 'Users', href: '/users', icon: MdLayers },
];

const userNavItems = [
  { id: 'dashboard', label: 'Dashboard', href: '/', icon: MdDashboard },
  { id: 'my-work', label: 'My Work', href: '/my-work', icon: MdLayers },
];

interface FixedLayoutProps {
  children: React.ReactNode;
  user?: {
    name?: string;
    role?: string;
    address?: string;
    mobile?: number;
    email?: string;
  };
}

export default function FixedLayout({ children }: FixedLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const { user } = useSelector((state: RootState) => state.auth);
  
  
  const handleDrawerToggle = () => {
    setMobileOpen((prev) => !prev);
  };

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  console.log(location);

  const path = location.pathname;
  console.log(path);
  
  
  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const initials = getInitials(user);

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: 'var(--color-card-bg)', color: 'var(--color-text)' }}>
      {/* Header in sidebar (only for desktop) */}
      
      
      {/* User profile section */}
      <Box sx={{ p: 2, display: 'flex', gap: 2, alignItems: 'center', borderBottom: '1px solid var(--color-border)' }}>
        <Avatar sx={{ bgcolor: 'var(--color-primary)', width: 56, height: 56 }}>{initials}</Avatar>
        <Box>
          <Typography variant="subtitle1" fontWeight={700}>{user.name || 'User Name'}</Typography>
          <Typography variant="body2" color="text.secondary">{user.role || 'Admin'}</Typography>
        </Box>
      </Box>

      <Divider />

      <Box sx={{ flex: 1, overflow: 'auto' }}>
        <List disablePadding sx={{ pt: 1 }}>
          {(user?.role === 'admin' ? adminNavItems : userNavItems).map((item) => {
            const Icon = item.icon;
            return (
              <ListItemButton
                key={item.id}
                component={RouterLink}
                to={item.href}
                selected={path === item.href}
                onClick={() => setMobileOpen(false)}
                sx={{
                  px: 2,
                  py: 1.25,
                  transition: 'all 0.2s ease',
                  '&.Mui-selected': {
                    backgroundColor: 'rgba(var(--color-primary-rgb), 0.08)',
                    color: 'var(--color-primary)',
                    borderLeft: '4px solid var(--color-primary)',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                    '& .MuiListItemIcon-root': {
                      color: 'var(--color-primary)',
                      transform: 'scale(1.1)',
                      transition: 'transform 0.2s ease',
                    },
                    '& .MuiListItemText-primary': {
                      fontWeight: 600,
                    },
                  },
                  '&:hover': {
                    backgroundColor: 'var(--color-primary-50)',
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <Icon size={20} />
                </ListItemIcon>
                <ListItemText 
                  primary={item.label} 
                  primaryTypographyProps={{ 
                    fontWeight: 600,
                    sx: {
                      '&.Mui-selected': {
                        color: 'var(--color-primary)',
                      },
                    },
                  }} 
                />
              </ListItemButton>
            );
          })}
        </List>
      </Box>

      <Box sx={{ mt: 'auto', borderTop: '1px solid var(--color-border)' }}>
        <Button
          onClick={handleLogout}
          startIcon={<LuLogOut />}
          fullWidth
          sx={{
            color: 'var(--color-error)',
            justifyContent: 'flex-start',
            px: 3,
            py: 1.5,
            textTransform: 'none',
            '&:hover': {
              bgcolor: 'var(--color-error-50)',
            },
          }}
        >
          Logout
        </Button>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'var(--color-background)', color: 'var(--color-text)', overflow: 'hidden' }}>

      {/* Sidebar Navigation */}
      <Box component="nav" sx={{ width: { xs: 0, md: drawerWidth }, flexShrink: 0, zIndex: 1200 }} aria-label="main navigation">
        {/* Mobile Drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              border: 'none',
              bgcolor: 'var(--color-card-bg)',
              position: 'fixed',
              top: 0,
              left: 0,
              height: '100%',
              zIndex: 1300
            },
          }}
        >
          {drawer}
        </Drawer>

        {/* Desktop Sidebar */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              border: 'none',
              bgcolor: 'var(--color-card-bg)',
              position: 'fixed',
              top: 0,
              left: 0,
              height: '100%',
              zIndex: 1200
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: '100%',
          bgcolor: 'var(--color-background)',
          minHeight: '100vh',
          overflow: 'auto',
          p: { xs: 2, md: 3 },
          position: 'relative',
          zIndex: 1
        }}
      >
        {/* Mobile header */}
        <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center' }}>
          <IconButton onClick={handleDrawerToggle} sx={{ mr: 2 }}>
            <MdMenu />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Duppta Management
          </Typography>
        </Box>
        
        {/* Main content */}
        <Box sx={{ width: '100%', maxWidth: 1200, mx: 'auto' }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}

// Props are now type-checked with TypeScript interface

function getInitials(user:any) {
  const name = user?.name || '';
  if (!name) return 'U';
  return name
    .split(' ')
    .map((n:string) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}
