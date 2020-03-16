module.exports = (sequelize, type) => {
    return sequelize.define('user', {
        email: {
            type: type.STRING,
            unique: true,
            allowNull: false,
        },
        username: {
            type: type.STRING,
            unique: true,
            allowNull: false,
        },
        password: {
            type: type.STRING,
            allowNull: false,
        },
        tag: {
            type: type.STRING,
            allowNull: false,
        }
    }, {
        freezeTableName: true 
    });
}