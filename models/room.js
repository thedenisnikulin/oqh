module.exports = (sequelize, type) => {
    const Room = sequelize.define('room', {
        id: {
            type: type.UUID,
            defaultValue: type.UUIDV4,
            primaryKey: true,
        }
    }, {
        freezeTableName: true
    });


    return Room;
};
