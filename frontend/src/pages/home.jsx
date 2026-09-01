import React, { useContext, useState } from 'react'
import withAuth from '../utils/withAuth'
import { useNavigate } from 'react-router-dom'
import "../App.css";
import { Button, IconButton, TextField } from '@mui/material';
import RestoreIcon from '@mui/icons-material/Restore';
import { AuthContext } from '../contexts/AuthContext';

function HomeComponent() {


    let navigate = useNavigate();
    const [meetingCode, setMeetingCode] = useState("");


    const {addToUserHistory} = useContext(AuthContext);
    let handleJoinVideoCall = async () => {
        await addToUserHistory(meetingCode)
        navigate(`/${meetingCode}`)
    }

    return (
        <div className="homeContainer">
            <div className="navBar">
                <div style={{ display: "flex", alignItems: "center" }}>
                    <h2>MeetX Video Call</h2>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                    <div onClick={() => navigate("/history")} className="historySection" style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
                        <IconButton style={{ color: 'inherit' }}>
                            <RestoreIcon />
                        </IconButton>
                        <p style={{ margin: 0, fontWeight: 500 }}>History</p>
                    </div>

                    <Button 
                        variant="outlined"
                        onClick={() => {
                            localStorage.removeItem("token")
                            navigate("/auth")
                        }}
                        style={{
                            borderColor: "#FF9839",
                            color: "#FF9839",
                            textTransform: "none",
                            fontWeight: 600,
                            borderRadius: "8px",
                            padding: "6px 16px"
                        }}
                    >
                        Logout
                    </Button>
                </div>
            </div>

            <div className="meetContainer">
                <div className="leftPanel">
                    <div className="leftPanelCard">
                        <h2>Providing Quality Video Call Just Like Quality Education</h2>

                        <div className="meetInputs">
                            <TextField 
                                onChange={e => setMeetingCode(e.target.value)} 
                                id="outlined-basic" 
                                label="Meeting Code" 
                                variant="outlined" 
                                InputLabelProps={{ style: { color: 'rgba(255, 255, 255, 0.6)' } }}
                                inputProps={{ style: { color: 'white' } }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': {
                                            borderColor: 'rgba(255, 255, 255, 0.2)',
                                            borderRadius: '10px',
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
                            <Button 
                                onClick={handleJoinVideoCall} 
                                variant='contained'
                                sx={{
                                    background: 'linear-gradient(135deg, #FF9839 0%, #D97500 100%)',
                                    color: 'white',
                                    fontWeight: 'bold',
                                    borderRadius: '10px',
                                    padding: '12px 28px',
                                    textTransform: 'none',
                                    fontSize: '1rem',
                                    boxShadow: '0 4px 15px rgba(255, 152, 57, 0.3)',
                                    '&:hover': {
                                        background: 'linear-gradient(135deg, #FFaa55 0%, #E08510 100%)',
                                        boxShadow: '0 6px 20px rgba(255, 152, 57, 0.5)',
                                    }
                                }}
                            >
                                Join
                            </Button>
                        </div>
                    </div>
                </div>
                <div className='rightPanel'>
                    <img src='/meetx-logo.png' alt="MeetX Logo" />
                </div>
            </div>
        </div>
    )
}


export default withAuth(HomeComponent)