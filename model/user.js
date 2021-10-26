// User Model

module.exports = (sequelize, DataTypes) => {
    var UserData = sequelize.define("UserData", {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        email: {
            type: DataTypes.STRING,
            unique: true
        },
        password: {
            type: DataTypes.STRING
        },
        
    }, { timestamps: false });

    // try {
    //     UserData.sync()
    // }
    // catch (e) {
    //     console.log("ERROR", e)
    // }

    return UserData;
};
