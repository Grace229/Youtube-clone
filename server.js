const { globalVariables } = require('./config/configuration')
const express = require('express')
const path = require('path')
const logger = require('morgan')
const mongoose = require('mongoose')
const ejs = require('ejs')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy;
const MongoStore = require('connect-mongo') 
const User = require('./models/User')
const app = express()
const bcrypt = require('bcryptjs');
const flash = require('connect-flash')
const dotenv = require('dotenv')
dotenv.config();
// database connection
mongoose.connect(process.env.DATABASE)
.then(() => console.log('Database connected successfully'))
.catch(err => console.log('Error connecting to Database'))
// configure express
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')))
app.use(cookieParser());
app.use(session({
    secret: 'grace',
    saveUninitialized: true,
    resave: true,
    cookie: { maxAge: Date.now() + 3600 * 24 * 60 * 60},
    store: MongoStore.create({ 
        mongoUrl: process.env.DATABASE,
        ttl: + 3600 * 24 * 60 * 60
    })
}));
app.use(logger('dev'));
app.use(flash());
app.use(globalVariables)

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy({usernameField: 'email', passReqToCallback: true}, async(req, identifier, email, password, done) => {
    await User.findOne({$or: [{userName: identifier}, {email: identifier} ]})
    .then(async(user) => {
        if (!user) {return done(null, false, req.flash('error-message', 'User not found. Please register and try again.'));}

        bcrypt.compare(password, user.password, (err, passwordMatch) => {
            if (err){
                return err;
            }
            if (!passwordMatch) return done(null,false, req.flash('error-message', 'Password incorrect'))

            return done(null, user, req.flash('success-message', 'Login successfully'));
        });
    });
}));

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.findById(id, function(err, user){
        done(err, user);
    });
});


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs')

const defaultRoutes = require('./routes/default/default.routes')
const authRoutes = require('./routes/auth/auth.routes')

// routes


app.use('/', defaultRoutes)
app.use('/auth', authRoutes)

  

// Catch 404
// app.use((req, res, next) => {
// res.render('error404')
// next();
// })
   
const port = process.env.PORT || 8000
app.listen(port,() => console.log(`Listening on Port ${port}`));