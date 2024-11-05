const express = require('express');
const dotenv = require('dotenv');
const { connectDb } = require('./utlis/db');
const authRoutes = require('./router/auth-router');
const passwordRoutes = require('./router/password-routes');
const session = require('express-session');
const cors = require('cors');

// Load environment variables from .env file
dotenv.config();

const app = express();

// CORS Options
const corsOptions = {
    origin: "https://passop-heycharm.vercel.app", 
    credentials: true,
    methods: ["POST", "GET", "PUT", "DELETE"]
};

app.use(cors(corsOptions));

// Middleware for parsing JSON requests
app.use(express.json());

// Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET, // Secret for signing the session ID cookie
    resave: false, // Prevents resaving of sessions that are unmodified
    saveUninitialized: false, // Prevents uninitialized sessions from being saved
    cookie: {
        secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
        httpOnly: true, // Prevent client-side JavaScript from accessing the cookie
        maxAge: 24 * 60 * 60 * 1000, // Set cookie expiration to 1 day
         sameSite: 'None'
    }
}));

// Define routes for authentication and password management
app.get("/", (req,res)=>{
    res.json("Hello")
})
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
