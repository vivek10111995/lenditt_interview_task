// User Model

module.exports = (sequelize, DataTypes) => {
    var session = sequelize.define("session", {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        token: {
            type: DataTypes.STRING,
            unique: true
        },
        delete_flag: {
            type: Boolean,
            default: false
        },

    }, { timestamps: false });

    // try {
    //     UserData.sync()
    // }
    // catch (e) {
    //     console.log("ERROR", e)
    // }

    return session;
};
