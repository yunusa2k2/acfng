const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/User');


router.get('/login', (req, res) => {
    const errors = req.flash().error || [];
    res.render('login', {layout: 'landing', errors});
});

router.post('/login', passport.authenticate('local',
    {
        successRedirect: '/inventory/dashboard',
        failureRedirect: '/user/login',
        failureFlash: true
    }));

router.get('/logout', (req, res) => {
    req.logout();
    req.session.destroy();
    res.redirect('/user/login');
});

router.get('/forgot_password', (req, res) => {
    res.render('forgot_password', {layout: 'landing'})
});

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    // console.log(`id: ${id}`);
    User.findByPk(id)
        .then((user) => {
            done(null, user);
        })
        .catch((error) => {
            console.log(`Error: ${error}`);
        });
});

module.exports = router;