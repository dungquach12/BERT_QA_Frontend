// Middleware to check for user authentication
const checkAuth = (req, res, next) => {
    if (req.session.user) {
        next(); // User is authenticated, proceed to the next middleware/route handler
    } else {
        res.redirect("/login"); // User is not authenticated, redirect to login
    }
};

module.exports = { checkAuth }