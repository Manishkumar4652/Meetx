import React from 'react'
import "../App.css"
import { Link, useNavigate } from 'react-router-dom'
export default function LandingPage() {


    const router = useNavigate();

    return (
        <div className='landingPageContainer'>
            <video className='backgroundVideo' src="/background_video.mp4" autoPlay loop muted playsInline />
            <div className='videoOverlay'></div>
            <nav>
                <div className='navHeader'>
                    <h2><span style={{ color: "#FF9839" }}>MeetX</span> Video Call</h2>
                </div>
                <div className='navlist'>
                    <p onClick={() => {
                        router("/aljk23")
                    }}>Join as Guest</p>
                    <p onClick={() => {
                        router("/auth")

                    }}>Register</p>
                    <div onClick={() => {
                        router("/auth")

                    }} role='button'>
                        <p>Login</p>
                    </div>
                </div>
            </nav>


            <div className="landingMainContainer">
                <div>
                    <h1><span style={{ color: "#FF9839" }}>Connect</span> with your loved Ones</h1>

                    <p>Cover a distance by MeetX Video Call</p>
                    <div className='getStartedBtn' role='button'>
                        <Link to={"/auth"}>Get Started</Link>
                    </div>
                </div>
                <div>

                    <img src="/meetx-logo.png" alt="" />

                </div>
            </div>



        </div>
    )
}
