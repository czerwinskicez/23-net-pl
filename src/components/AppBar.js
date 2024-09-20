"use client";

import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Menu, MenuItem } from '@mui/material';
import ArrowDropDown from '@mui/icons-material/ArrowDropDown';
import { useRouter } from 'next/navigation';
import { auth, db, doc, getDoc } from '../firebaseConfig';
import { signOut } from 'firebase/auth';

export default function MyAppBar() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [userEmail, setUserEmail] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setUserEmail(user.email);
        try {
          const userDoc = doc(db, 'users', user.uid);
          const userSnapshot = await getDoc(userDoc);
          if (userSnapshot.exists()) {
            setIsAdmin(userSnapshot.data().admin || false);
          } else {
            setIsAdmin(false);
          }
        } catch (error) {
          console.error("Error fetching user data: ", error);
        }
      } else {
        setUserEmail('');
        setIsAdmin(false);
      }
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

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          23.net.pl Forum
        </Typography>
        {userEmail && (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="body1" sx={{ marginRight: 2 }}>
              {userEmail}
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
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </div>
        )}
      </Toolbar>
    </AppBar>
  );
}
