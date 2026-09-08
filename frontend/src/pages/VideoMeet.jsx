import React, { useEffect, useRef, useState } from 'react'
import io from "socket.io-client";
import { Badge, IconButton, TextField } from '@mui/material';
import { Button } from '@mui/material';
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff'
import CallEndIcon from '@mui/icons-material/CallEnd'
import MicIcon from '@mui/icons-material/Mic'
import MicOffIcon from '@mui/icons-material/MicOff'
import ScreenShareIcon from '@mui/icons-material/ScreenShare';
import StopScreenShareIcon from '@mui/icons-material/StopScreenShare'
import ChatIcon from '@mui/icons-material/Chat'
import CloseIcon from '@mui/icons-material/Close'
import server from '../environment';

const server_url = server;

var connections = {};

const peerConfigConnections = {
    "iceServers": [
        { "urls": "stun:stun.l.google.com:19302" }
    ]
}

export default function VideoMeetComponent() {

    var socketRef = useRef();
    let socketIdRef = useRef();

    let localVideoref = useRef();

    let [videoAvailable, setVideoAvailable] = useState(true);

    let [audioAvailable, setAudioAvailable] = useState(true);

    let [video, setVideo] = useState(true);

    let [audio, setAudio] = useState(true);

    let [screen, setScreen] = useState();

    let [showModal, setModal] = useState(true);

    let [screenAvailable, setScreenAvailable] = useState();

    let [messages, setMessages] = useState([])

    let [message, setMessage] = useState("");

    let [newMessages, setNewMessages] = useState(3);

    let [askForUsername, setAskForUsername] = useState(true);

    let [username, setUsername] = useState("");

    const videoRef = useRef([])

    let [videos, setVideos] = useState([])

    let [showControls, setShowControls] = useState(true);
    let controlsTimeoutRef = useRef(null);

    const handleMouseMove = () => {
        setShowControls(true);
        if (controlsTimeoutRef.current) {
            clearTimeout(controlsTimeoutRef.current);
        }
        controlsTimeoutRef.current = setTimeout(() => {
            setShowControls(false);
        }, 3000);
    };

    useEffect(() => {
        if (!askForUsername) {
            controlsTimeoutRef.current = setTimeout(() => {
                setShowControls(false);
            }, 3000);
        }
        return () => {
            if (controlsTimeoutRef.current) {
                clearTimeout(controlsTimeoutRef.current);
            }
        };
    }, [askForUsername]);

    useEffect(() => {
        console.log("HELLO")
        getPermissions();
    }, [])

    let getDislayMedia = () => {
        if (screen) {
            if (navigator.mediaDevices.getDisplayMedia) {
                navigator.mediaDevices.getDisplayMedia({ video: true, audio: true })
                    .then(getDislayMediaSuccess)
                    .then((stream) => { })
                    .catch((e) => console.log(e))
            }
        }
    }

    const getPermissions = async () => {
        try {
            const userMediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            if (userMediaStream) {
                setVideoAvailable(true);
                setAudioAvailable(true);
                setVideo(true);
                setAudio(true);
                window.localStream = userMediaStream;
                if (localVideoref.current) {
                    localVideoref.current.srcObject = userMediaStream;
                }
            }
        } catch (error) {
            console.log("Failed to get both video & audio", error);
            try {
                const userMediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
                setVideoAvailable(true);
                setAudioAvailable(false);
                setVideo(true);
                setAudio(false);
                window.localStream = userMediaStream;
                if (localVideoref.current) {
                    localVideoref.current.srcObject = userMediaStream;
                }
            } catch (err1) {
                try {
                    const userMediaStream = await navigator.mediaDevices.getUserMedia({ video: false, audio: true });
                    setVideoAvailable(false);
                    setAudioAvailable(true);
                    setVideo(false);
                    setAudio(true);
                    window.localStream = userMediaStream;
                } catch (err2) {
                    setVideoAvailable(false);
                    setAudioAvailable(false);
                    setVideo(false);
                    setAudio(false);
                }
            }
        }

        if (navigator.mediaDevices.getDisplayMedia) {
            setScreenAvailable(true);
        } else {
            setScreenAvailable(false);
        }
    };

    let getMedia = () => {
        setVideo(videoAvailable);
        setAudio(audioAvailable);
        connectToSocketServer();
    }

    let getDislayMediaSuccess = (stream) => {
        console.log("HERE")
        try {
            window.localStream.getTracks().forEach(track => track.stop())
        } catch (e) { console.log(e) }

        window.localStream = stream
        localVideoref.current.srcObject = stream

        for (let id in connections) {
            if (id === socketIdRef.current) continue

            if (connections[id].getSenders) {
                let senders = connections[id].getSenders();
                stream.getTracks().forEach(track => {
                    let sender = senders.find(s => s.track && s.track.kind === track.kind);
                    if (sender) {
                        sender.replaceTrack(track);
                    } else {
                        connections[id].addTrack(track, stream);
                    }
                });
            } else if (connections[id].addStream) {
                connections[id].addStream(window.localStream)
            }

            connections[id].createOffer().then((description) => {
                connections[id].setLocalDescription(description)
                    .then(() => {
                        socketRef.current.emit('signal', id, JSON.stringify({ 'sdp': connections[id].localDescription }))
                    })
                    .catch(e => console.log(e))
            })
        }

        stream.getTracks().forEach(track => track.onended = () => {
            setScreen(false)

            try {
                let tracks = localVideoref.current.srcObject.getTracks()
                tracks.forEach(track => track.stop())
            } catch (e) { console.log(e) }

            let blackSilence = (...args) => new MediaStream([black(...args), silence()])
            window.localStream = blackSilence()
            localVideoref.current.srcObject = window.localStream
        })
    }

    let gotMessageFromServer = (fromId, message) => {
        var signal = JSON.parse(message)

        if (fromId !== socketIdRef.current) {
            if (signal.sdp) {
                if (connections[fromId]) {
                    connections[fromId].setRemoteDescription(new RTCSessionDescription(signal.sdp)).then(() => {
                        if (signal.sdp.type === 'offer') {
                            connections[fromId].createAnswer().then((description) => {
                                connections[fromId].setLocalDescription(description).then(() => {
                                    socketRef.current.emit('signal', fromId, JSON.stringify({ 'sdp': connections[fromId].localDescription }))
                                }).catch(e => console.log(e))
                            }).catch(e => console.log(e))
                        }
                    }).catch(e => console.log(e))
                }
            }

            if (signal.ice) {
                if (connections[fromId]) {
                    connections[fromId].addIceCandidate(new RTCIceCandidate(signal.ice)).catch(e => console.log(e))
                }
            }
        }
    }

    let connectToSocketServer = () => {
        socketRef.current = io.connect(server_url, { secure: false })

        socketRef.current.on('signal', gotMessageFromServer)

        socketRef.current.on('connect', () => {
            socketRef.current.emit('join-call', window.location.href)
            socketIdRef.current = socketRef.current.id

            socketRef.current.on('chat-message', addMessage)

            socketRef.current.on('user-left', (id) => {
                setVideos((videos) => videos.filter((video) => video.socketId !== id))
                if (connections[id]) {
                    try {
                        connections[id].close();
                    } catch (e) { }
                    delete connections[id];
                }
            })

            socketRef.current.on('user-joined', (id, clients) => {
                clients.forEach((socketListId) => {
                    if (socketListId === socketIdRef.current) return;

                    if (!connections[socketListId]) {
                        connections[socketListId] = new RTCPeerConnection(peerConfigConnections)
                        
                        // Wait for their ice candidate       
                        connections[socketListId].onicecandidate = function (event) {
                            if (event.candidate != null) {
                                socketRef.current.emit('signal', socketListId, JSON.stringify({ 'ice': event.candidate }))
                            }
                        }

                        const handleTrackOrStream = (stream) => {
                            console.log("BEFORE:", videoRef.current);
                            console.log("FINDING ID: ", socketListId);

                            let videoExists = videoRef.current.find(video => video.socketId === socketListId);

                            if (videoExists) {
                                console.log("FOUND EXISTING");

                                setVideos(videos => {
                                    const updatedVideos = videos.map(video =>
                                        video.socketId === socketListId ? { ...video, stream: stream } : video
                                    );
                                    videoRef.current = updatedVideos;
                                    return updatedVideos;
                                });
                            } else {
                                console.log("CREATING NEW");
                                let newVideo = {
                                    socketId: socketListId,
                                    stream: stream,
                                    autoplay: true,
                                    playsinline: true
                                };

                                setVideos(videos => {
                                    const updatedVideos = [...videos, newVideo];
                                    videoRef.current = updatedVideos;
                                    return updatedVideos;
                                });
                            }
                        };

                        // Wait for their track / video stream
                        connections[socketListId].ontrack = (event) => {
                            if (event.streams && event.streams[0]) {
                                handleTrackOrStream(event.streams[0]);
                            }
                        };

                        connections[socketListId].onaddstream = (event) => {
                            if (event.stream) {
                                handleTrackOrStream(event.stream);
                            }
                        };

                        // Add the local video & audio stream
                        if (window.localStream !== undefined && window.localStream !== null) {
                            if (connections[socketListId].addTrack) {
                                window.localStream.getTracks().forEach(track => {
                                    connections[socketListId].addTrack(track, window.localStream);
                                });
                            } else {
                                connections[socketListId].addStream(window.localStream);
                            }
                        } else {
                            let blackSilence = (...args) => new MediaStream([black(...args), silence()])
                            window.localStream = blackSilence()
                            if (connections[socketListId].addTrack) {
                                window.localStream.getTracks().forEach(track => {
                                    connections[socketListId].addTrack(track, window.localStream);
                                });
                            } else {
                                connections[socketListId].addStream(window.localStream);
                            }
                        }
                    }
                })

                if (id === socketIdRef.current) {
                    for (let id2 in connections) {
                        if (id2 === socketIdRef.current) continue

                        connections[id2].createOffer().then((description) => {
                            connections[id2].setLocalDescription(description)
                                .then(() => {
                                    socketRef.current.emit('signal', id2, JSON.stringify({ 'sdp': connections[id2].localDescription }))
                                })
                                .catch(e => console.log(e))
                        })
                    }
                }
            })
        })
    }

    let silence = () => {
        let ctx = new AudioContext()
        let oscillator = ctx.createOscillator()
        let dst = oscillator.connect(ctx.createMediaStreamDestination())
        oscillator.start()
        ctx.resume()
        return Object.assign(dst.stream.getAudioTracks()[0], { enabled: false })
    }
    let black = ({ width = 640, height = 480 } = {}) => {
        let canvas = Object.assign(document.createElement("canvas"), { width, height })
        canvas.getContext('2d').fillRect(0, 0, width, height)
        let stream = canvas.captureStream()
        return Object.assign(stream.getVideoTracks()[0], { enabled: false })
    }

    let handleVideo = () => {
        setVideo((prevVideo) => {
            const nextVideo = !prevVideo;
            if (window.localStream) {
                window.localStream.getVideoTracks().forEach(track => {
                    track.enabled = nextVideo;
                });
            }
            return nextVideo;
        });
    }

    let handleAudio = () => {
        setAudio((prevAudio) => {
            const nextAudio = !prevAudio;
            if (window.localStream) {
                window.localStream.getAudioTracks().forEach(track => {
                    track.enabled = nextAudio;
                });
            }
            return nextAudio;
        });
    }

    useEffect(() => {
        if (screen !== undefined) {
            getDislayMedia();
        }
    }, [screen])
    let handleScreen = () => {
        setScreen(!screen);
    }

    let handleEndCall = () => {
        try {
            let tracks = localVideoref.current.srcObject.getTracks()
            tracks.forEach(track => track.stop())
        } catch (e) { }
        window.location.href = "/"
    }

    let openChat = () => {
        setModal(true);
        setNewMessages(0);
    }
    let closeChat = () => {
        setModal(false);
    }
    let handleMessage = (e) => {
        setMessage(e.target.value);
    }

    const addMessage = (data, sender, socketIdSender) => {
        setMessages((prevMessages) => [
            ...prevMessages,
            { sender: sender, data: data }
        ]);
        if (socketIdSender !== socketIdRef.current) {
            setNewMessages((prevNewMessages) => prevNewMessages + 1);
        }
    };



    let sendMessage = () => {
        console.log(socketRef.current);
        socketRef.current.emit('chat-message', message, username)
        setMessage("");

        // this.setState({ message: "", sender: username })
    }

    
    let connect = () => {
        setAskForUsername(false);
        getMedia();
    }


    return (
        <div>

            {askForUsername === true ?

                <div className="lobbyContainer">
                    <div className="lobbyCard">
                        <div className="lobbyLeft">
                            <h2>Enter into Lobby</h2>
                            <TextField 
                                size="small"
                                id="outlined-basic" 
                                label="Username" 
                                value={username} 
                                onChange={e => setUsername(e.target.value)} 
                                variant="outlined" 
                                InputLabelProps={{ style: { color: 'rgba(255, 255, 255, 0.6)' } }}
                                inputProps={{ style: { color: 'white' } }}
                                sx={{
                                    width: '100%',
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
                            <Button 
                                variant="contained" 
                                onClick={connect}
                                sx={{
                                    mt: 2,
                                    width: '100%',
                                    background: 'linear-gradient(135deg, #FF9839 0%, #D97500 100%)',
                                    color: 'white',
                                    fontWeight: 'bold',
                                    borderRadius: '8px',
                                    padding: '10px 0',
                                    textTransform: 'none',
                                    fontSize: '1.1rem',
                                    boxShadow: '0 4px 15px rgba(255, 152, 57, 0.3)',
                                    '&:hover': {
                                        background: 'linear-gradient(135deg, #FFaa55 0%, #E08510 100%)',
                                    }
                                }}
                            >
                                Connect
                            </Button>
                        </div>
                        
                        <div className="lobbyRight">
                            <div className="webcamPreview">
                                <video ref={localVideoref} autoPlay muted playsInline></video>
                                <span className="liveBadge">LIVE PREVIEW</span>
                            </div>
                        </div>
                    </div>
                </div> :


                <div className="meetVideoContainer" onClick={handleMouseMove} onMouseMove={handleMouseMove} onMouseLeave={() => setShowControls(false)}>

                    <div className="conferenceView">
                        {videos.length === 0 ? (
                            <div className="singleVideoContainer">
                                <video
                                    ref={(ref) => {
                                        localVideoref.current = ref;
                                        if (ref && window.localStream) {
                                            if (ref.srcObject !== window.localStream) {
                                                ref.srcObject = window.localStream;
                                            }
                                        }
                                    }}
                                    autoPlay
                                    muted
                                    playsInline
                                    style={{ transform: "scaleX(-1)" }}
                                ></video>
                            </div>
                        ) : videos.length === 1 ? (
                            <div className="singleVideoContainer">
                                <video
                                    data-socket={videos[0].socketId}
                                    ref={(ref) => {
                                        if (ref && videos[0].stream) {
                                            if (ref.srcObject !== videos[0].stream) {
                                                ref.srcObject = videos[0].stream;
                                                ref.play().catch(e => console.log("Play error:", e));
                                            }
                                        }
                                    }}
                                    autoPlay
                                    playsInline
                                ></video>
                            </div>
                        ) : (
                            <div className="multipleVideoGrid">
                                {videos.map((video) => (
                                    <div key={video.socketId}>
                                        <video
                                            data-socket={video.socketId}
                                            ref={(ref) => {
                                                if (ref && video.stream) {
                                                    if (ref.srcObject !== video.stream) {
                                                        ref.srcObject = video.stream;
                                                        ref.play().catch(e => console.log("Play error:", e));
                                                    }
                                                }
                                            }}
                                            autoPlay
                                            playsInline
                                        ></video>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {videos.length > 0 && (
                        <video
                            className="meetUserVideo"
                            ref={(ref) => {
                                localVideoref.current = ref;
                                if (ref && window.localStream) {
                                    if (ref.srcObject !== window.localStream) {
                                        ref.srcObject = window.localStream;
                                    }
                                }
                            }}
                            autoPlay
                            muted
                            playsInline
                        ></video>
                    )}

                    {showModal ? <div className="chatRoom">

                        <div className="chatContainer">
                            <div className="chatHeader">
                                <h1>Chat</h1>
                                <IconButton className="chatCloseBtn" onClick={closeChat} style={{ color: "white" }}>
                                    <CloseIcon />
                                </IconButton>
                            </div>

                            <div className="chattingDisplay">

                                {messages.length !== 0 ? messages.map((item, index) => {

                                    console.log(messages)
                                    return (
                                        <div style={{ marginBottom: "20px" }} key={index}>
                                            <p style={{ fontWeight: "bold", margin: "0 0 4px 0", color: "#FF9839" }}>{item.sender}</p>
                                            <p style={{ margin: 0, color: "rgba(255,255,255,0.9)" }}>{item.data}</p>
                                        </div>
                                    )
                                }) : <p style={{ color: "rgba(255,255,255,0.5)", textAlign: "center" }}>No Messages Yet</p>}


                            </div>

                            <div className="chattingArea">
                                <TextField 
                                    value={message} 
                                    onChange={(e) => setMessage(e.target.value)} 
                                    id="outlined-basic" 
                                    label="Enter Your chat" 
                                    variant="outlined" 
                                    size="small"
                                    InputLabelProps={{ style: { color: 'rgba(255, 255, 255, 0.6)' } }}
                                    inputProps={{ style: { color: 'white' } }}
                                    sx={{
                                        flex: 1,
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
                                <Button 
                                    variant='contained' 
                                    onClick={sendMessage}
                                    sx={{
                                        background: 'linear-gradient(135deg, #FF9839 0%, #D97500 100%)',
                                        color: 'white',
                                        fontWeight: 'bold',
                                        borderRadius: '8px',
                                        padding: '9px 20px',
                                        textTransform: 'none',
                                        '&:hover': {
                                            background: 'linear-gradient(135deg, #FFaa55 0%, #E08510 100%)',
                                        }
                                    }}
                                >
                                    Send
                                </Button>
                            </div>


                        </div>
                    </div> : <></>}


                    <div className={`buttonContainers ${showControls ? 'showControls' : 'hideControls'}`}>
                        <IconButton onClick={handleVideo} style={{ color: "white" }}>
                            {(video === true) ? <VideocamIcon /> : <VideocamOffIcon />}
                        </IconButton>
                        <IconButton onClick={handleEndCall} style={{ color: "red" }}>
                            <CallEndIcon  />
                        </IconButton>
                        <IconButton onClick={handleAudio} style={{ color: "white" }}>
                            {audio === true ? <MicIcon /> : <MicOffIcon />}
                        </IconButton>

                        {screenAvailable === true ?
                            <IconButton onClick={handleScreen} style={{ color: "white" }}>
                                {screen === true ? <ScreenShareIcon /> : <StopScreenShareIcon />}
                            </IconButton> : <></>}

                        <Badge badgeContent={newMessages} max={999} color='warning'>
                            <IconButton onClick={() => setModal(!showModal)} style={{ color: "white" }}>
                                <ChatIcon />
                            </IconButton>
                        </Badge>

                    </div>

                </div>

            }

        </div>
    )
}
