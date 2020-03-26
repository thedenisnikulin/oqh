module.exports = (sequelize, type) => {
    return sequelize.define('room', {
        id: {
            type: type.UUID,
            defaultValue: type.UUIDV4,
            primaryKey: true,
        }
    }, {
        freezeTableName: true
    });
};
