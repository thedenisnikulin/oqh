module.exports = (sequelize, type) => {
    const Pool = sequelize.define('pool', {
        // userId: {
        //     type: type.UUID,
        //     allowNull: false,
        // }
    }, {
        freezeTableName: true
    });

    
    return Pool;
}