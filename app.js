const express = require('express');
const exphbs = require('express-handlebars');
const Handlebars = require('handlebars');
const bodyParser = require('body-parser');
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');
const path = require('path');
const flash = require('express-flash');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const Inventory = require('./models/Inventory');
const User = require('./models/User');
//const PORT = process.env.PORT || 3000;

// for heroku
const PORT = process.env.PORT || 80;



//Authentication packages
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require("express-session");


// Database
const  db = require('./config/database');

// Test DB
db.authenticate().then(() => console.log('Database connected...')).catch(err => console.log('Error: ' + err));

const app = express();

//Handlebars middleware
const hbs = exphbs.create({
    defaultLayout: 'main',
    handlebars: allowInsecurePrototypeAccess(Handlebars),

    helpers:{
        calculation: function (value) {
         return  value + 1
        },

        status: function (v1, v2) {

            if((v1/v2) * 100 >= 60){
                return 'Normal level';
            }else if((v1/v2) * 100 >= 40) {
                return 'Mini level'
            }else{
                return 'Reorder level'
            }
        },

        status_color: function(v1, v2){
            if((v1/v2) * 100 >= 60){
                return 'badge-success';
            }else if((v1/v2) * 100 >= 40) {
                return 'badge-info'
            }else{
                return 'badge-danger'
            }
        },

        ifCond: function (v1, v2, options) {
            if(v1 === v2) {
                return options.fn(this);
            }
            return options.inverse(this);
        }
    }
    });
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');


// Passport Middleware
app.use(express.static("public"));
app.use(session({
    secret: "cats",
    resave: false,
    saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());
//app.use(express-flash());

// Express-flash middleware
const sessionStore = new session.MemoryStore;
app.use(cookieParser('secret'));
app.use(session({
    cookie: { maxAge: 60000 },
    store: sessionStore,
    saveUninitialized: true,
    resave: 'true',
    secret: 'secret'
}));
app.use(flash());


// Body parser middleware
app.use(bodyParser.urlencoded({extended: false}));
//app.use(bodyParser.json());

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => res.redirect('/user/login'));
//app.get('/', (req, res) => res.render('login', {layout: 'landing'}));
app.use('/user', require('./routes/user'));

// Inventory routes
app.use('/inventory', require('./routes/inventory'));

//Passport Strategy
passport.use('local', new LocalStrategy(
        {usernameField: 'username'},
        (username, password, done) => {
            User.findOne({where: {username: username}})
                .then(user => {
                    if(!user){
                        console.log("user not correct");
                        return done(null, false, {message: 'Incorrect username, try again!'});
                    }

                    if(user.password !== password){
                        console.log("pass not correct");
                        return done(null, false, {message: 'Incorrect password, try again!'})
                    }

                    if(user.password === password){
                        console.log("everything correct");
                        return done(null, user)
                    }
                    // return user.validPassword(password) ?
                    //     console.log('correct')
                    //     done(null, user)
                    //     :
                    //     done(null, false, {message: 'Incorrect username and password. ')});
                })
                .catch(() => done(null, false, {message: 'Error while logging in!'}))
        }
    )
);



User.sequelize.sync().then(function() {
    console.log('Nice! Database looks fine')
}).catch(function(err) {
    console.log(err, "Something went wrong with the Database Update!")
});



app.listen(PORT, console.log('server started on port ' + PORT));