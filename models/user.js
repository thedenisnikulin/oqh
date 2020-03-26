module.exports = (sequelize, type) => {
    return sequelize.define('user', {
        id: {
            type: type.UUID,
            defaultValue: type.UUIDV4,
            primaryKey: true,
        },
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
        },
        rank: {
            type: type.INTEGER,
            defaultValue: 0
        },
        roomId: {
            type: type.UUID,
            references: {
                model: 'room',
                key: 'id'
            }
        }
    }, {
        freezeTableName: true 
    });
}