
models = require("../model");
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const db = require("../model");
const User = db.UserData;
const session = db.session;

module.exports.register = async function (req, res, next) {

    try {
        // Validate user input
        if (!(req.body.email && req.body.password)) {
            res.status(400).send("All input is required");
        }

    } catch (error) {
        console.log("error", error);
    }

    var condition = {
        where: {
            email: req.body.email
        }
    };

    User.count(condition)
        .then(async rsltSingle => {

            if (rsltSingle > 0) {
                return res.status(409).send("User Already Exist. Please Login");
            } else {
                encryptedPassword = await bcrypt.hash(req.body.password, 10);

                User.create({
                    email: req.body.email,
                    password: encryptedPassword
                }).then(data => {

                    // Create token
                    let email = req.body.email
                    const token = jwt.sign(
                        { user_id: data._id, email },
                        "process.env.TOKEN_KEY",
                        {
                            expiresIn: "2h",
                        }
                    );
                    // save user token
                    data.token = token;

                    res.status(201).json(data);
                }).catch(function (err) {
                    if (err) {
                        console.log("err", err);
                    }
                });
            }
        })
        .catch(function (err) {
            if (err) {
                console.log("err", err);
            }
        });
};

//   exports.signin = (req, res) => {
module.exports.signin = async function (req, res, next) {

    User.findOne({
        where: {
            email: req.body.email
        }
    })
        .then(user => {
            if (!user) {
                return res.status(404).send({ message: "User Not found." });
            }

            var passwordIsValid = bcrypt.compareSync(
                req.body.password,
                user.password
            );

            if (!passwordIsValid) {
                return res.status(401).send({
                    accessToken: null,
                    message: "Invalid Password!"
                });
            }

            var token = jwt.sign({ id: user.id }, "process.env.TOKEN_KEY", {
                expiresIn: 86400 // 24 hours
            });

            var authorities = [];
            // user.getRoles().then(roles => {

            session.create({
                token: token,
                delete_flag: false
            }).then()

            res.status(200).send({
                id: user.id,
                email: user.email,
                accessToken: token
            });
            // });
        })
        .catch(err => {
            res.status(500).send({ message: err.message });
        });
};

module.exports.welcome = async function (req, res, next) {

    var condition = {
        where: {
            token: req.headers['x-access-token'],
            delete_flag: 0
        },
    }


    await session.findOne(condition)
        .then(rsltSingle => {
            if (rsltSingle) {
                res.status(200).send("Welcome")
            } else {
                res.status(401).send("token is expired")
            }
        })
}

module.exports.signout = async function (req, res, next) {

    var condition = {
        where: {
            token: req.headers['x-access-token'],
            delete_flag: 0
        },
    }

    session.findOne(condition)
        .then((rsltUpdate) => {

            rsltUpdate.delete_flag = 1;

            rsltUpdate.save();

        })
        .catch(function (err) {
            if (err) {
                // return responder.handleInternalError(res, err, next);
                console.log("err", err);
                res.status(400).send("something went wrong please contact administrative")

            }
        });

    res.status(200).send({
        success: true,
        msg: "logout successfully."
    })

}