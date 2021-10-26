const Sequelize = require("sequelize");
var express = require("express");
var app = express();
const bodyParser = require('body-parser');
// const app = express();
// const server = require('http').Server(app);
// const taskRequest = require('./routes/taskRequest')(io);

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// parse application/json
app.use(bodyParser.json())
const sequelize = new Sequelize(
   "DB_NAME",
    "USERNAME",
    "PASSWORD",
    {
        HOST: "HOST",
        dialect: "mysql",
        logging: console.log
    }
);

try {
    sequelize.authenticate();
    console.log("Connection has been established successfully.");
} catch (error) {
    console.error("Unable to connect to the database:", error);
} finally {
    // sequelize.close();
}

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.tutorials = require("./model/user")(sequelize, Sequelize);

module.exports = db;
require('./route/user')(app);

var server = app.listen("3010","0.0.0.0" , function () {
    console.log(
        "Express server listening on http://" + "0.0.0.0" + ":" + "3010"
    );
});
