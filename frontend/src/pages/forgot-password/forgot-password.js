import { React, useState } from "react";
import {
    Grid,
    TextField,
    Paper,
    Box,
    Button,
    Container,
    Typography,
    Dialog,
    DialogContentText,
    DialogContent,
    DialogActions,
    Alert,
    CircularProgress,
    DialogTitle
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function ForgotPassword() {
    const [open, setOpen] = useState(false);
    const [resetOpen, setResetOpen] = useState(false);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [step, setStep] = useState(1); // 1: email verification, 2: password reset
    const navigate = useNavigate();

    const handleClose = () => {
        setOpen(false);
        if (step === 2) {
            navigate("/login");
        }
    };

    const handleResetClose = () => {
        setResetOpen(false);
        setNewPassword("");
        setConfirmPassword("");
        setErrors({});
    };

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePassword = (password) => {
        return password.length >= 8;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setErrors({});
        setLoading(true);

        const data = new FormData(event.currentTarget);
        const emailValue = data.get("email").toString().trim();

        if (!emailValue) {
            setErrors({ email: "Email is required" });
            setLoading(false);
            return;
        }

        if (!validateEmail(emailValue)) {
            setErrors({ email: "Please enter a valid email address" });
            setLoading(false);
            return;
        }

        try {
            // Check if user exists
            const response = await axios.get(
                `http://localhost:8080/users/fetchUserByEmail?email=${emailValue}`
            );

            if (response.data && response.data.length > 0) {
                setEmail(emailValue);
                setMessage("User found! You can now reset your password.");
                setStep(2);
                setResetOpen(true);
            } else {
                setErrors({ email: "No account found with this email address" });
            }
        } catch (error) {
            console.error("Error checking email:", error);
            setErrors({ email: "Error verifying email. Please try again." });
        }

        setLoading(false);
    };

    const handlePasswordReset = async () => {
        setErrors({});

        if (!newPassword) {
            setErrors({ newPassword: "New password is required" });
            return;
        }

        if (!validatePassword(newPassword)) {
            setErrors({ newPassword: "Password must be at least 8 characters long" });
            return;
        }

        if (newPassword !== confirmPassword) {
            setErrors({ confirmPassword: "Passwords do not match" });
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post(
                `http://localhost:8080/users/forgotPassword?email=${email}`,
                { password: newPassword }
            );

            if (response.status === 200) {
                setMessage("Password reset successfully!");
                setResetOpen(false);
                setOpen(true);
            }
        } catch (error) {
            console.error("Error resetting password:", error);
            setErrors({ general: "Error resetting password. Please try again." });
        }

        setLoading(false);
    };
    return (
        <Container maxWidth='sm' component="main">
            <Grid container spacing={2} style={{ minHeight: "100vh" }} direction={"column"} justifyContent='center'>
                <Paper elevation={3} sx={{ padding: 7 }}>
                    <Box component="form" onSubmit={handleSubmit}>
                        <Grid container spacing={2} direction={"column"} justifyContent={'center'}>
                            <Typography component="h1" variant="h5" align='center' sx={{ color: '#06402B', fontWeight: 'bold' }}>
                                Forgot Your Password?
                            </Typography>
                            <Typography textAlign={"center"} mt={2} color="text.secondary">
                                Enter your email address and we'll help you reset your password
                            </Typography>
                            
                            {errors.general && (
                                <Grid item>
                                    <Alert severity="error">{errors.general}</Alert>
                                </Grid>
                            )}
                            
                            <Grid item>
                                <TextField 
                                    type="email" 
                                    label="Email Address" 
                                    id="email" 
                                    name="email" 
                                    fullWidth 
                                    variant="outlined" 
                                    required 
                                    error={!!errors.email} 
                                    helperText={errors.email}
                                    disabled={loading}
                                />
                            </Grid>

                            <Grid item>
                                <Button 
                                    type="submit" 
                                    fullWidth 
                                    variant="contained" 
                                    disabled={loading}
                                    sx={{
                                        backgroundColor: '#06402B',
                                        '&:hover': {
                                            backgroundColor: '#054A33',
                                        }
                                    }}
                                >
                                    {loading ? <CircularProgress size={24} color="inherit" /> : "Verify Email"}
                                </Button>
                            </Grid>

                            <Grid item sx={{ textAlign: 'center', mt: 2 }}>
                                <Button 
                                    variant="text" 
                                    onClick={() => navigate('/login')}
                                    sx={{ color: '#06402B' }}
                                >
                                    Back to Login
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                </Paper>
            </Grid>

            {/* Password Reset Dialog */}
            <Dialog open={resetOpen} onClose={handleResetClose} maxWidth="sm" fullWidth>
                <DialogTitle>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        Reset Password
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Enter your new password for {email}
                    </Typography>
                </DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        {errors.general && (
                            <Grid item xs={12}>
                                <Alert severity="error">{errors.general}</Alert>
                            </Grid>
                        )}
                        
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="New Password"
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                error={!!errors.newPassword}
                                helperText={errors.newPassword}
                                disabled={loading}
                            />
                        </Grid>
                        
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Confirm New Password"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                error={!!errors.confirmPassword}
                                helperText={errors.confirmPassword}
                                disabled={loading}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={handleResetClose} disabled={loading}>
                        Cancel
                    </Button>
                    <Button 
                        onClick={handlePasswordReset} 
                        variant="contained"
                        disabled={loading}
                        sx={{
                            backgroundColor: '#06402B',
                            '&:hover': {
                                backgroundColor: '#054A33',
                            }
                        }}
                    >
                        {loading ? <CircularProgress size={20} color="inherit" /> : "Reset Password"}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Success Dialog */}
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                        Password Reset Successful!
                    </Typography>
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {message || "Your password has been reset successfully. You can now login with your new password."}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button 
                        autoFocus 
                        onClick={handleClose}
                        variant="contained"
                        sx={{
                            backgroundColor: '#06402B',
                            '&:hover': {
                                backgroundColor: '#054A33',
                            }
                        }}
                    >
                        Go to Login
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};
