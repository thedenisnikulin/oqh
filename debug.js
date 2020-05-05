const User = require('./models/index').user;
const db = require('./models/index');

db.sequelize.authenticate().then(() => console.log('s')).catch(e => console.log(e))

User.update(
    { bio: 'looool' },
    { where: { username: 'test1'} }
).then(lol => {
    console.log(lol);
})