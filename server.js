const express = require('express');
const dotenv = require('dotenv');
const { connectDb } = require('./utlis/db');
const authRoutes = require('./router/auth-router');
const passwordRoutes = require('./router/password-routes');
const cors = require('cors');

// Load environment variables from .env file
dotenv.config();

const app = express();

// CORS Options
const corsOptions = {
    origin: "https://passop-heycharm.vercel.app",
    credentials: true,
    methods: ["POST", "GET", "PUT", "DELETE"],
    allowedHeaders: ['Authorization', 'Content-Type']

};

app.use(cors(corsOptions));

// Middleware for parsing JSON requests
app.use(express.json());

// Middleware to log requests (optional, for debugging)
app.use((req, res, next) => {
    console.log('Request received:', req.method, req.url);
    next();
});

// Test endpoint to set a cookie (for CORS testing, if necessary)
app.get('/test-cookie', (req, res) => {
    res.cookie('testCookie', 'testValue', { httpOnly: true, secure: true, sameSite: 'None' });
    res.send('Cookie set');
});

// Define routes for authentication and password management
app.get("/", (req, res) => {
    res.json("Hello App");
});
app.use('/api/auth', authRoutes);
app.use('/api/passwords', passwordRoutes);

// Start the server and connect to the database
connectDb()
    .then(() => {
        app.listen(3000, () => {
            console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode.`);
        });
    })
    .catch(err => {
        console.error("Failed to connect to the database", err);
    });
