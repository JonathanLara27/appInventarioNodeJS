const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/user');
const {secret} = require('../keys');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});

passport.use('local-signup', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, async (req, email, password, done) => {
  //await pausa la ejecución de la funcion para esperar un resultado 
  //especificamente el resultado de la consulta a la base de datos que es una promesa
  const user = await User.findOne({'email': email})
  const key=req.body.key;
  console.log(user)
  if(user) {
    return done(null, false, req.flash('signupMessage', 'Este correo ya se encuentra registrado.'));
  } else {
    const newUser = new User();
    newUser.email = email;
    newUser.password = newUser.encryptPassword(password);
    newUser.name = req.body.name;
    newUser.lastname = req.body.lastname;
    console.log(newUser)
    if(key==secret){
      await newUser.save();
      done(null, newUser);
    }else{
      return done(null, false, req.flash('signupMessage', 'No tienes permiso para registrarte en esta App.'));
    }
  }
}));

passport.use('local-signin', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, async (req, email, password, done) => {
  const user = await User.findOne({email: email});
  if(!user) {
    return done(null, false, req.flash('signinMessage', 'Usuario no registrado'));
  }
  if(!user.comparePassword(password)) {
    return done(null, false, req.flash('signinMessage', 'Contraseña incorrecta'));
  }
  return done(null, user);
}));
