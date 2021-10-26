const auth = require("../middleware/auth");


module.exports = (app) => {
    const user = require('../controller/userController');

    //sign-Up user

    app.post('/sign-up', user.register);

    //login user
    app.post('/sign-in', user.signin);

    app.post('/welcome', user.welcome);

    app.post('/logout', user.signout);


}