module.exports = (sequelize, type) => {
    return sequelize.define('pool', {
        userId: {
            type: type.UUID,
            allowNull: false,
        }
    }, {
        freezeTableName: true
    });
}