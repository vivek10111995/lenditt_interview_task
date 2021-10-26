const jwt = require("jsonwebtoken");

const config = "process.env.TOKEN_KEY";
const db = require("../model");
const session = db.session;
const verifyToken = (req, res, next) => {
    const token = req.headers["x-access-token"];

    if (!token) {
        return res.status(403).send("A token is required for authentication");
    }
    // try {
    //     const decoded = jwt.verify(token, config);
    //     req.user = decoded;
    // } catch (err) {
    //     return res.status(401).send("Invalid Token");
    // }
    console.log("==================");

    jwt.verify(token, config, (err, decoded) => {
        if (err) {
            return res.status(401).send({
                message: "Unauthorized!"
            });
        }
        req.userId = decoded.id;
        next();
    });
    return next();

};

module.exports = verifyToken;