module.exports = (sequelize, type) => {
    const User = sequelize.define('user', {
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
        isSearching: {
            type: type.BOOLEAN,
            defaultValue: false
        },
        team: {
            type: type.ENUM,
            values: ['A', 'B', 'C']
        },
        roomId: {
            type: type.UUID
        }
    }, {
        freezeTableName: true 
    });

    return User;
}