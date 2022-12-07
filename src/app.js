const express = require("express");
const path = require("path");
const engine = require('ejs-mate');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const morgan = require('morgan');
const app = express();
const ip=require('ip');  

// initializations  
require('./database');
require('./passport/local-auth');

// settings
app.set("port", process.env.PORT || 5000);
app.set('views', path.join(__dirname, 'views'))
app.engine('ejs', engine);
app.set('view engine', 'ejs');


// static files
app.use(express.static(path.join(__dirname, "public")));

// middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(session({
    secret: 'mysecretsession',
    resave: false,
    saveUninitialized: false
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
    app.locals.signinMessage = req.flash('signinMessage');
    app.locals.signupMessage = req.flash('signupMessage');
    app.locals.productoGuardado= req.flash('productoGuardado');
    app.locals.errorGuardarProducto= req.flash('errorGuardarProducto');
    app.locals.errorMostrarProductos= req.flash('errorMostrarProductos');
    app.locals.productoEliminado= req.flash('productoEliminado');
    app.locals.errorEliminarProducto= req.flash('errorEliminarProducto');
    app.locals.productoActualizado= req.flash('productoActualizado');
    app.locals.errorActualizarProducto= req.flash('errorActualizarProducto');

    //kardex
    app.locals.errorMostrarKardex= req.flash('errorMostrarKardex');
    app.locals.errorGuardarKardex= req.flash('errorGuardarKardex');
    app.locals.kardexGuardado= req.flash('kardexGuardado');

    app.locals.user = req.user;
    //console.log(app.locals);
    next();
});

// routes
app.use('/', require('./routes/routes'));



app.listen(app.get("port"), () => {
    console.log("Server on port http://localhost:"+ app.get("port"));
    console.log("On your network: http://"+ ip.address() +":"+ app.get("port"));
});