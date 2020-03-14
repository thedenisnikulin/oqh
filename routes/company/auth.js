const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs')

const Company = require('../../models/index').Company;

const isLoggedIn = (req, res, next) => {
    req.session.user ? res.redirect(req.baseUrl + '/dashboard') : next();
};

router.get('/register', isLoggedIn, (req, res, next) => {
    res.send(`
        <h1>Register a company</h1>
        <form method="post" action="/company/register">
            <input name="companyName" placeholder="Company name" required/>
            <input type="email" name="email" placeholder="email" required/>
            <input type="password" name="password" placeholder="password" required />
            <input type="submit" />
        </form>
        <a href="/company/login">Login</a>
    `);
})

router.get('/login', isLoggedIn, (req, res, next) => {
    res.send(`
        <h1>Login</h1>
        <form method="post" action="/company/login">
            <input type="email" name="email" placeholder="email" required/>
            <input type="password" name="password" placeholder="password" required />
            <input type="submit" />
        </form>
        <a href="/company/register">Register</a>
    `);
})

router.post('/register', async (req, res) => {
    console.log(req.body)
    const { companyName, password, email } = req.body;
    const company = Company.findOne({
        where: {
            email
        }
    })
        .then(async (result) => {
            if (result) {
                // company already exists
                res.redirect(req.baseUrl + '/register');
            } else {
                const hashedPassword = await bcrypt.hash(password, 10);
                Company.create({
                    companyName,
                    password: hashedPassword,
                    email
                })
                    .then(company => {
                        // success
                        req.session.user = company.dataValues;    // session
                        req.session.flag = 'company';
                        res.redirect(req.baseUrl + '/dashboard');
                })
                    .catch(err => console.log(err));
            }
        })
});

router.post('/login', async (req, res, next) => {
    console.log(req.body)
    const { email, password } = req.body;
    const company = Company.findOne({
        where: {
            email
        }
    })
        .then((company) => {
            // no such company
            if (!company) {
                res.redirect(req.baseUrl + '/login');
            } else {
                bcrypt.compare(password, company.password, (err, result) => {
                    // success
                    if (result === true) { 
                        req.session.user = company.dataValues;      // session
                        req.session.flag = 'company';
                        res.redirect(req.baseUrl + '/dashboard');
                    } else {
                        // invalid password
                        res.redirect(req.baseUrl + '/login');
                    }
                })
            }
        })
        .catch(err => console.log(err));
});

router.get('/logout', (req, res) => {
    if (req.session.user) {
        req.session.destroy(() => res.redirect('/'));
    }
});

module.exports = router;