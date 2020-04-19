module.exports = (sequelize, type) => {
    const ChatMessage = sequelize.define('chatMessage', {
        id: {
            type: type.UUID,
            defaultValue: type.UUIDV4,
            primaryKey: true,
        },
        message: {
            type: type.STRING,
            allowNull: false
        },
        senderId: {
            type: type.UUID,
            allowNull: false
        },
        roomId: {
            type: type.UUID,
            allowNull: false
        }
    }, {
        freezeTableName: true
    });

    return ChatMessage
};