module.exports = (sequelize, type) => {
    const User = sequelize.define('user', {
        id: {
            type: type.UUID,
            defaultValue: type.UUIDV4,
            primaryKey: true,
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
        bio: {
            type: type.STRING,
        },
        isSearching: {
            type: type.BOOLEAN,
            defaultValue: false
        },
        roomId: {
            type: type.UUID
        }
    }, {
        freezeTableName: true 
    });

    return User;
}