let IS_PROD = process.env.NODE_ENV === 'production';
const server = IS_PROD ?
    (process.env.REACT_APP_BACKEND_URL || "https://meetx-backend.onrender.com") :
    "http://localhost:8000";

export default server;