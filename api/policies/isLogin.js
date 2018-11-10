module.exports = function isLogin (req, res, next) {
    console.log(req.session.authenticated)
    if (req.session.authenticated) {
        return next();
    } else {
        return res.redirect('/login');
    }
};