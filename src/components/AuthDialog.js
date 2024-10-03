import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Alert, Checkbox, FormControlLabel } from '@mui/material';
import { auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail } from '../firebaseConfig';
import { useRouter } from 'next/navigation';
import RulesModal from './RulesModal';

const AuthDialog = ({ open, handleClose, isRegister }) => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [acceptedRules, setAcceptedRules] = useState(false);
  const [rulesModalOpen, setRulesModalOpen] = useState(false);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleRegister = () => {
    if (!validateEmail(email)) {
      setError('Invalid email address.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (!acceptedRules) {
      setError('You must accept the rules.');
      return;
    }
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        router.push('/start');
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  const handlePasswordLogin = () => {
    if (!validateEmail(email)) {
      setError('Invalid email address.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        router.push('/start');
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  const handlePasswordReset = () => {
    if (!validateEmail(email)) {
      setError('Invalid email address.');
      return;
    }
    sendPasswordResetEmail(auth, email)
      .then(() => {
        setInfo('Password reset email sent.');
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isRegister) {
      handleRegister();
    } else {
      handlePasswordLogin();
    }
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{isRegister ? 'Register' : 'Login'}</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              label="Password"
              type="password"
              variant="outlined"
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {isRegister && (
              <TextField
                label="Confirm Password"
                type="password"
                variant="outlined"
                fullWidth
                margin="normal"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            )}
            {isRegister && (
              <FormControlLabel
                control={
                  <Checkbox
                    checked={acceptedRules}
                    onChange={(e) => setAcceptedRules(e.target.checked)}
                    name="acceptedRules"
                    color="primary"
                  />
                }
                label={
                  <span>
                    I am human or robot and I accept the{' '}
                    <Button onClick={() => setRulesModalOpen(true)} color="primary">
                      rules
                    </Button>
                  </span>
                }
              />
            )}
            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}
            {info && (
              <Alert severity="info" sx={{ mt: 2 }}>
                {info}
              </Alert>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
            {!isRegister && (
              <Button onClick={handlePasswordReset} color="primary" variant="outlined">
                Forgot Password?
              </Button>
            )}
            <Button type="submit" color="primary" variant="contained">
              {isRegister ? 'Register' : 'Login'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
      <RulesModal open={rulesModalOpen} handleClose={() => setRulesModalOpen(false)} />
    </>
  );
};

export default AuthDialog;
