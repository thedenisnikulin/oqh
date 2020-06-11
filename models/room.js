module.exports = (sequelize, type) => {
    const Room = sequelize.define('room', {
        id: {
            type: type.UUID,
            defaultValue: type.UUIDV4,
            primaryKey: true,
        },
        topic: {
            type: type.STRING,
        }
    }, {
        freezeTableName: true
    });


    return Room;
};
