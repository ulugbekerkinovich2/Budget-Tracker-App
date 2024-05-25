const {checkToken} = require("../utils/jwt");

const isAuth = (req, res, next) => {
    // console.log(req.headers.token);
    if (!req.headers.token) return res.status(401).json({message: "Permission denied"});

    checkToken(req.headers.token, (err, data) => {
        if (err) return res.status(401).json({message: "Permission denied"});
        // console.log(data, '1111');
        req.user = data;
        next();
    });
};


module.exports = isAuth;