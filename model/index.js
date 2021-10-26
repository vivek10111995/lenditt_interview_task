"use strict";

var fs = require("fs");
var path = require("path");
var Sequelize = require("sequelize");
var basename = path.basename(__filename);
var cluster = require("cluster");
var db = {};
var express = require("express");

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

fs.readdirSync(__dirname)
    .filter(file => {
        return (
            file === "user.js" ||
            file === "session.js"
        );
    })
    .forEach(file => {
        var model = sequelize["import"](path.join(__dirname, file));
        db[model.name] = model;

    });

Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;
var app = express();

module.exports = db;
