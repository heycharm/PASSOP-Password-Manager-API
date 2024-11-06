// middleware/auth-middleware.js
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const authenticateJWT = (req, res, next) => {
    // Ensure Authorization header is present and correctly formatted
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).json({ message: "Authorization header is missing" });
    }

    // Extract token from Authorization header
    const token = authHeader.split(' ')[1]; // Split 'Bearer <token>'

    // If token is not provided after 'Bearer', return an error
    if (!token) {
        return res.status(401).json({ message: "Token missing after 'Bearer'" });
    }

    // Verify the token and decode user information
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: "Invalid token" });
        }
        req.user = user; // Attach decoded user data to the request object
        next();
    });
};

module.exports = authenticateJWT;
