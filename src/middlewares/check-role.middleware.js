const {checkToken} = require("../utils/jwt");

const isAdmin = (req, res, next) => {
    if (!req.headers.token) return res.status(401).json({message: "Permission denied"});

    checkToken(req.headers.token, (err, data) => {
        if (err) return res.status(401).json({message: "Permission denied"});
        const {id: userId, is_admin} = data.payload;
        if (!is_admin) return res.status(401).json({message: "Permission denied"});
        res.admin = data;
        next();
    });
}

module.exports = isAdmin;