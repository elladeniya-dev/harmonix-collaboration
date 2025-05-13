import React from 'react';
import {
  Box,
  IconButton,
  Avatar,
  Typography,
  Stack,
  Tooltip,
} from '@mui/material';
import {
  Home as HomeIcon,
  Search as SearchIcon,
  Add as AddIcon,
  Message as MessageIcon,
  MenuBook as CourseIcon,
  Group as CollabIcon,
  Menu as MenuIcon,
} from '@mui/icons-material';
import { useUser } from '../context/UserContext';

const navItems = [
  { label: 'Home', icon: <HomeIcon /> },
  { label: 'Search', icon: <SearchIcon /> },
  { label: 'Create', icon: <AddIcon /> },
  { label: 'Message', icon: <MessageIcon /> },
  { label: 'Course', icon: <CourseIcon /> },
  { label: 'Collab', icon: <CollabIcon /> },
];

const Sidebar = ({ isCollapsed, toggleSidebar }) => {
  const { user } = useUser();

  return (
    <Box
      sx={{
        width: isCollapsed ? '80px' : '220px',
        transition: 'width 0.3s ease',
        height: '100vh',
        bgcolor: '#FAF2FF',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        py: 2,
        px: 1,
        boxShadow: '2px 0 6px rgba(0,0,0,0.05)',
        position: 'sticky',
        top: 0,
      }}
    >
      {/* Top Section: Toggle + Menu */}
      <Box sx={{ width: '100%' }}>
        <Stack spacing={1} alignItems="center" width="100%">
          {/* Toggle */}
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              px: 1,
              py: 1,
              borderRadius: 2,
              cursor: 'pointer',
              justifyContent: isCollapsed ? 'center' : 'flex-start',
              transition: 'background 0.2s',
              '&:hover': {
                bgcolor: '#e8dffd',
              },
            }}
            onClick={toggleSidebar}
          >
            <IconButton sx={{ color: '#3E3E3E' }}>
              <MenuIcon />
            </IconButton>
            {!isCollapsed && (
              <Typography variant="body2" fontWeight={500}>
                Menu
              </Typography>
            )}
          </Box>

          {/* Navigation Items */}
          {navItems.map((item, index) => (
            <Box
              key={index}
              sx={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                px: 1,
                py: 1,
                borderRadius: 2,
                cursor: 'pointer',
                justifyContent: isCollapsed ? 'center' : 'flex-start',
                transition: 'background 0.2s',
                '&:hover': {
                  bgcolor: '#e8dffd',
                },
              }}
            >
              <Tooltip title={item.label} placement="right" disableHoverListener={!isCollapsed}>
                <IconButton sx={{ color: '#3E3E3E' }}>
                  {item.icon}
                </IconButton>
              </Tooltip>
              {!isCollapsed && (
                <Typography variant="body2" fontWeight={500}>
                  {item.label}
                </Typography>
              )}
            </Box>
          ))}
        </Stack>
      </Box>

      {/* Bottom Section: User Avatar */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-start',
          alignItems: 'center',
          width: '100%',
          px: 1,
          py: 1,
          borderRadius: 2,
          mb: 2,
          cursor: 'pointer',
          bgcolor: isCollapsed ? 'transparent' : '#FAF2FF',
          '&:hover': {
            bgcolor: '#d0c4e8',
          },
          transition: 'background 0.2s',
        }}
      >
        <Tooltip title="Profile" placement="right" disableHoverListener={!isCollapsed}>
          <Avatar
            src={user?.profileImage || undefined}
            sx={{ width: 36, height: 36 }}
          >
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </Avatar>
        </Tooltip>
        {!isCollapsed && (
          <Typography variant="body2" sx={{ ml: 2 }}>
            {user?.name || 'Guest'}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default Sidebar;
