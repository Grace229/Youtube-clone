const express = require('express')
const path = require('path')
const logger = require('morgan')
const mongoose = require('mongoose')
const ejs = require('ejs')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const passport = require('passport')
const MongoStore = require('connect-mongo')
const app = express()
const flash = require('connect-flash')
// database connection
mongoose.connect('mongodb+srv://Grace:Ginaluv123@cluster0.q95mi.mongodb.net/waawtube?retryWrites=true&w=majority')
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
        mongoUrl: 'mongodb+srv://Grace:Ginaluv123@cluster0.q95mi.mongodb.net/waawtube?retryWrites=true&w=majority',
        ttl: + 3600 * 24 * 60 * 60
    })
}));
app.use(logger('dev'))
app.use(flash())
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs')

const defaultRoutes = require('./routes/default/default.routes')
// routes


app.use('/', defaultRoutes)
  

// Catch 404
app.use((req, res, next) => {
res.render('error404')
next();
})
   
const port = process.env.PORT || 8000
app.listen(port,() => console.log(`Listening on Port ${port}`));