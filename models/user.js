module.exports = (sequelize, type) => {
    return sequelize.define('user', {
        username: {
            type: type.STRING,
            unique: true,
            allowNull: false,
        },
        password: {
            type: type.STRING,
            allowNull: false,
        },
        email: {
            type: type.STRING,
            unique: true,
            allowNull: false,
        },
    }, {
        freezeTableName: true 
    });
}