const company = (sequelize, Sequelize) => {
    const Company = sequelize.define('company', {
        companyName: {
            type: Sequelize.STRING,
            unique: true,
            allowNull: false,
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        email: {
            type: Sequelize.STRING,
            unique: true,
            allowNull: false,
        },
    }, {
        freezeTableName: true 
    });

    return Company;
}

module.exports = company;