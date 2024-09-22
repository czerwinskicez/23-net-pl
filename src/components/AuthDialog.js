import React, { useState, useEffect } from 'react';
import {
    TextField,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Alert,
} from '@mui/material';

const LoginRegisterDialog = ({ open, onClose, setIsRegister, onLoginSuccess }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [isRegister, setIsRegisterLocal] = useState(false);

    useEffect(() => {
        setIsRegisterLocal(setIsRegister);
    }, [setIsRegister]);

    const handleLogin = () => {
        // Implement your login logic using `signInWithEmailAndPassword`
        // ...
    };

    const handleRegister = () => {
        // Implement your register logic using `createUserWithEmailAndPassword`
        // ...
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        setError('');

        if (isRegister) {
            handleRegister();
        } else {
            handleLogin();
        }
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>{isRegister ? 'Register' : 'Login'}</DialogTitle>
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
                {error && (
                    <Alert severity="error" sx={{ mt: 2 }}>
                        {error}
                    </Alert>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    Cancel
                </Button>
                <Button onClick={handleSubmit} color="primary">
                    {isRegister ? 'Register' : 'Login'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default LoginRegisterDialog;