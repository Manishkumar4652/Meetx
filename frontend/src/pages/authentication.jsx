import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { AuthContext } from '../contexts/AuthContext';
import { Snackbar } from '@mui/material';



// TODO remove, this demo shouldn't need to reset the theme.

const defaultTheme = createTheme();

export default function Authentication() {

    

    const [username, setUsername] = React.useState();
    const [password, setPassword] = React.useState();
    const [name, setName] = React.useState();
    const [error, setError] = React.useState();
    const [message, setMessage] = React.useState();


    const [formState, setFormState] = React.useState(0);

    const [open, setOpen] = React.useState(false)


    const { handleRegister, handleLogin } = React.useContext(AuthContext);

    let handleAuth = async () => {
        try {
            if (formState === 0) {

                let result = await handleLogin(username, password)


            }
            if (formState === 1) {
                let result = await handleRegister(name, username, password);
                console.log(result);
                setUsername("");
                setMessage(result);
                setOpen(true);
                setError("")
                setFormState(0)
                setPassword("")
            }
        } catch (err) {

            console.log(err);
            let message = (err.response.data.message);
            setError(message);
        }
    }


    return (
        <ThemeProvider theme={defaultTheme}>
            <Box
                sx={{
                    position: 'relative',
                    width: '100vw',
                    height: '100vh',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    overflow: 'hidden',
                    fontFamily: "'Inter', sans-serif"
                }}
            >
                <CssBaseline />
                
                {/* Background Video */}
                <video 
                    autoPlay 
                    loop 
                    muted 
                    playsInline 
                    src="/signup_video.mp4" 
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        zIndex: -2
                    }}
                />
                
                {/* Overlay layer */}
                <div 
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        background: 'linear-gradient(135deg, rgba(10, 10, 15, 0.7) 0%, rgba(10, 10, 15, 0.85) 100%)',
                        zIndex: -1
                    }}
                />

                {/* Form Card */}
                <Box
                    sx={{
                        background: 'rgba(20, 20, 30, 0.55)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: '24px',
                        padding: { xs: '2.5rem 2rem', sm: '3rem 3rem' },
                        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
                        width: '90%',
                        maxWidth: '440px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        zIndex: 1,
                        color: 'white',
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: '#FF9839' }}>
                        <LockOutlinedIcon />
                    </Avatar>

                    <Typography component="h1" variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
                        {formState === 0 ? "Welcome Back" : "Create Account"}
                    </Typography>

                    {/* Toggle Tabs */}
                    <Box sx={{ display: 'flex', gap: '15px', mb: 3 }}>
                        <Button 
                            variant={formState === 0 ? "contained" : "outlined"} 
                            onClick={() => { setFormState(0) }}
                            sx={{
                                borderRadius: '8px',
                                textTransform: 'none',
                                fontWeight: 600,
                                borderColor: '#FF9839',
                                color: formState === 0 ? 'white' : '#FF9839',
                                backgroundColor: formState === 0 ? '#FF9839' : 'transparent',
                                '&:hover': {
                                    backgroundColor: formState === 0 ? '#D97500' : 'rgba(255, 152, 57, 0.1)',
                                    borderColor: '#FF9839'
                                }
                            }}
                        >
                            Sign In
                        </Button>
                        <Button 
                            variant={formState === 1 ? "contained" : "outlined"} 
                            onClick={() => { setFormState(1) }}
                            sx={{
                                borderRadius: '8px',
                                textTransform: 'none',
                                fontWeight: 600,
                                borderColor: '#FF9839',
                                color: formState === 1 ? 'white' : '#FF9839',
                                backgroundColor: formState === 1 ? '#FF9839' : 'transparent',
                                '&:hover': {
                                    backgroundColor: formState === 1 ? '#D97500' : 'rgba(255, 152, 57, 0.1)',
                                    borderColor: '#FF9839'
                                }
                            }}
                        >
                            Sign Up
                        </Button>
                    </Box>

                    <Box component="form" noValidate sx={{ mt: 1, width: '100%' }}>
                        {formState === 1 && (
                            <TextField
                                size="small"
                                margin="normal"
                                required
                                fullWidth
                                id="name"
                                label="Full Name"
                                name="name"
                                value={name}
                                autoFocus
                                onChange={(e) => setName(e.target.value)}
                                InputLabelProps={{ style: { color: 'rgba(255, 255, 255, 0.6)' } }}
                                inputProps={{ style: { color: 'white' } }}
                                sx={{
                                    backgroundColor: '#000000',
                                    borderRadius: '8px',
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': {
                                            borderColor: 'rgba(255, 255, 255, 0.2)',
                                            borderRadius: '8px',
                                        },
                                        '&:hover fieldset': {
                                            borderColor: '#FF9839',
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: '#FF9839',
                                        },
                                    },
                                    '& .MuiInputLabel-root.Mui-focused': {
                                        color: '#FF9839',
                                    }
                                }}
                            />
                        )}

                        <TextField
                            size="small"
                            margin="normal"
                            required
                            fullWidth
                            id="username"
                            label="Username"
                            name="username"
                            autoFocus
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            InputLabelProps={{ style: { color: 'rgba(255, 255, 255, 0.6)' } }}
                            inputProps={{ style: { color: 'white' } }}
                            sx={{
                                backgroundColor: '#000000',
                                borderRadius: '8px',
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        borderColor: 'rgba(255, 255, 255, 0.2)',
                                        borderRadius: '8px',
                                    },
                                    '&:hover fieldset': {
                                        borderColor: '#FF9839',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#FF9839',
                                    },
                                },
                                '& .MuiInputLabel-root.Mui-focused': {
                                    color: '#FF9839',
                                }
                            }}
                        />
                        <TextField
                            size="small"
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            value={password}
                            type="password"
                            onChange={(e) => setPassword(e.target.value)}
                            id="password"
                            InputLabelProps={{ style: { color: 'rgba(255, 255, 255, 0.6)' } }}
                            inputProps={{ style: { color: 'white' } }}
                            sx={{
                                backgroundColor: '#000000',
                                borderRadius: '8px',
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        borderColor: 'rgba(255, 255, 255, 0.2)',
                                        borderRadius: '8px',
                                    },
                                    '&:hover fieldset': {
                                        borderColor: '#FF9839',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#FF9839',
                                    },
                                },
                                '& .MuiInputLabel-root.Mui-focused': {
                                    color: '#FF9839',
                                }
                            }}
                        />

                        {error && (
                            <Typography sx={{ color: '#FF3B30', fontSize: '0.875rem', mt: 1, textAlign: 'center' }}>
                                {error}
                            </Typography>
                        )}

                        <Button
                            type="button"
                            fullWidth
                            variant="contained"
                            onClick={handleAuth}
                            sx={{
                                mt: 4,
                                mb: 2,
                                background: 'linear-gradient(135deg, #FF9839 0%, #D97500 100%)',
                                color: 'white',
                                fontWeight: 'bold',
                                borderRadius: '10px',
                                padding: '12px',
                                textTransform: 'none',
                                fontSize: '1rem',
                                boxShadow: '0 4px 15px rgba(255, 152, 57, 0.3)',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #FFaa55 0%, #E08510 100%)',
                                    boxShadow: '0 6px 20px rgba(255, 152, 57, 0.5)',
                                }
                            }}
                        >
                            {formState === 0 ? "Login" : "Register"}
                        </Button>
                    </Box>
                </Box>
            </Box>

            <Snackbar
                open={open}
                autoHideDuration={4000}
                message={message}
            />
        </ThemeProvider>
    );
}