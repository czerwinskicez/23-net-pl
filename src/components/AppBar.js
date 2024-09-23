"use client";

import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Menu, MenuItem } from '@mui/material';
import Divider from '@mui/material/Divider';
import ArrowDropDown from '@mui/icons-material/ArrowDropDown';
import { useRouter } from 'next/navigation';
import { auth, db, doc, getDoc } from '../firebaseConfig';
import { signOut } from 'firebase/auth';
import SetDisplayNameModal from './SetDisplayNameModal';
import RulesModal from './RulesModal';
import SetAvatarModal from './SetAvatarModal'; // Import the SetAvatarModal component

export default function MyAppBar() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [displayName, setDisplayName] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRulesModalOpen, setIsRulesModalOpen] = useState(false);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false); // State for SetAvatarModal
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const userDoc = doc(db, 'public_users', user.uid);
          const userSnapshot = await getDoc(userDoc);
          if (userSnapshot.exists()) {
            const userData = userSnapshot.data();
            setDisplayName(userData.displayName || 'Unnamed');
            setIsAdmin(userData.admin || false);
          } else {
            setDisplayName('');
            setIsAdmin(false);
          }
        } catch (error) {
          console.error("Error fetching user data: ", error);
        }
      } else {
        setDisplayName('');
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        router.push('/');
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleAdmin = () => {
    router.push('/admin');
  };

  const handleTitleClick = () => {
    router.push('/start');
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
    handleClose();
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleOpenRulesModal = () => {
    setIsRulesModalOpen(true);
    handleClose();
  };

  const handleCloseRulesModal = () => {
    setIsRulesModalOpen(false);
  };

  const handleOpenAvatarModal = () => {
    setIsAvatarModalOpen(true);
    handleClose();
  };

  const handleCloseAvatarModal = () => {
    setIsAvatarModalOpen(false);
  };

  const handleSuccess = (newDisplayName) => {
    setDisplayName(newDisplayName);
  };

  const handleAvatarSuccess = (newPhotoURL) => {
    // Optionally update the UI with the new avatar URL
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography
            variant="h6"
            sx={{ flexGrow: 1, color: 'white', cursor: 'pointer' }}
            onClick={handleTitleClick}
          >
            23.net.pl
          </Typography>
          {!loading && displayName && (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="body1" sx={{ marginRight: 2, color: 'white' }}>
                {displayName}
              </Typography>
              <IconButton
                edge="end"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <ArrowDropDown />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                disableScrollLock
              >
                {isAdmin && <MenuItem onClick={handleAdmin}>Admin</MenuItem>}
                {isAdmin && <Divider />}
                <MenuItem onClick={handleOpenModal}>Change Display Name</MenuItem>
                <MenuItem onClick={handleOpenAvatarModal}>Change Avatar</MenuItem>
                <MenuItem onClick={handleOpenRulesModal}>Rules</MenuItem>
                <Divider />
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </div>
          )}
        </Toolbar>
      </AppBar>
      <SetDisplayNameModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSuccess={handleSuccess}
      />
      <RulesModal
        open={isRulesModalOpen}
        handleClose={handleCloseRulesModal}
      />
      <SetAvatarModal
        isOpen={isAvatarModalOpen}
        onClose={handleCloseAvatarModal}
        onSuccess={handleAvatarSuccess}
      />
    </>
  );
}
