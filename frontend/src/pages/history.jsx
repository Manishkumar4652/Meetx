import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import HomeIcon from '@mui/icons-material/Home';

import { IconButton } from '@mui/material';
export default function History() {


    const { getHistoryOfUser } = useContext(AuthContext);

    const [meetings, setMeetings] = useState([])


    const routeTo = useNavigate();

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const history = await getHistoryOfUser();
                setMeetings(history);
            } catch {
                // IMPLEMENT SNACKBAR
            }
        }

        fetchHistory();
    }, [])

    let formatDate = (dateString) => {

        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, "0");
        const month = (date.getMonth() + 1).toString().padStart(2, "0")
        const year = date.getFullYear();

        return `${day}/${month}/${year}`

    }

    return (
        <div className="historyContainer">
            <div className="historyHeader">
                <IconButton 
                    onClick={() => routeTo("/home")}
                    sx={{
                        color: 'white',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        '&:hover': {
                            backgroundColor: 'rgba(255, 152, 57, 0.3)',
                            color: '#FF9839'
                        }
                    }}
                >
                    <HomeIcon />
                </IconButton>
                <h1>Meeting History</h1>
            </div>

            <div className="historyGrid">
                {meetings.length !== 0 ? (
                    meetings.map((e, i) => (
                        <Card key={i} className="historyCard" variant="outlined">
                            <CardContent>
                                <Typography sx={{ fontSize: 14, color: '#FF9839', fontWeight: 600 }} gutterBottom>
                                    Code: {e.meetingCode}
                                </Typography>
                                <Typography sx={{ color: 'rgba(255,255,255,0.8)' }}>
                                    Date: {formatDate(e.date)}
                                </Typography>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <Typography sx={{ color: 'rgba(255, 255, 255, 0.6)', gridColumn: '1 / -1', textAlign: 'center', mt: 4 }}>
                        No Previous Meeting History Found
                    </Typography>
                )}
            </div>
        </div>
    )
}
