const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const mongoose = require('mongoose')
const flash = require('connect-flash')
const session = require('express-session')
const passport = require('passport')

const PORT = process.env.PORT || 5000 
const app = express()

// DB Config
const db = require('./config/keys').MongoURI

// Passport Config
require('./config/passport')(passport)

// Connect to Mongo
mongoose.connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {console.log('MongoDB connected');
    })
    .catch(error => {console.log(error);
})

// EJS
app.use(expressLayouts)
app.set('view engine', 'ejs')

// Bodyparser
app.use(express.urlencoded({extended: false}))

// Express Session
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
}))

// Passport Middlewares
app.use(passport.initialize());
app.use(passport.session());

// Connect Flash
app.use(flash())

// Global Vars
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')
    res.locals.error = req.flash('error')
    next()
})

// Routes
app.use('/', require('./routes/'))
app.use('/users', require('./routes/users'))

app.listen(PORT, console.log(`Server started on port ${PORT}`))
