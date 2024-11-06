const authenticateJWT = (req, res, next) => {
    const token = req.cookies.token || req.headers['authorization']?.split(' ')[1]; // Get token from cookie or authorization header

    if (!token) {
        return res.status(401).json({ msg: 'No token provided, authorization denied' });
    }

    jwt.verify(token, process.env.JWT_TOKEN, (err, user) => {
        if (err) {
            return res.status(403).json({ msg: 'Token is not valid' });
        }
        req.user = user; // Attach user info to request object
        next();
    });
};

module.exports = authenticateJWT;