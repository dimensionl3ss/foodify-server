const passport = require('passport');
const JWTStrategy = require('passport-jwt').Strategy;
const LocalStrategy = require('passport-local').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('./models/users');
const {secretKey} = require('./config/config');
const jwt = require('jsonwebtoken');

passport.use(new LocalStrategy(
  {
      usernameField: 'email',
      passwordField: 'password'
  },
  function(email, password,  done) {

      User.findOne({where: {email: email}})
      .then((user) => {
        if (user == null) {
          return done(null, false, {message: 'Incorrect Email.'});
        }
        if(user.password !== password) {
          return done(null, false, {message: 'Incorrect password.'});
        }
        return done(null, user);
      }, (err) => done(err))
      .catch((err) => done(err));
}));


/*
    The user id (you provide as the second argument of the done function) 
    is saved in the session and is later used to retrieve the whole object 
    via the deserializeUser function.

    serializeUser determines which data of the user object should be stored in the session. 
    The result of the serializeUser method is attached to the session as 
    req.session.passport.user = {}. 
    Here for instance, 
    it would be (as we provide the user id as the key) 
    req.session.passport.user = {id: 'xyz'}
 */
passport.serializeUser(function(user, done) {
    done(null, user.email);
});

/**
 * The first argument of deserializeUser corresponds to the key of the user object 
 * that was given to the done function. 
 * So your whole object is retrieved with help of that key. 
 * That key here is the user id (key can be any key of the user object i.e. name,email etc). 
 * In deserializeUser that key is matched with the in memory array / database or any data resource.
 * The fetched object is attached to the request object as req.user
 */

passport.deserializeUser(function(id, done) {
    User.findOne({where: {email: id}})
    .then((user,err) =>{
        done(err, user);
    })
});

exports.getToken = (user) => {
  return jwt.sign(user, secretKey,
      {expiresIn: 3600});
};

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: secretKey
};

exports.jwtPassport = passport.use(new JWTStrategy(opts, (jwt_payload, done) => {
      console.log(jwt_payload);
      User.findOne( {where: {email: jwt_payload.email}} ).then(user => {
        if (user) {
          return done(null, user);
        }
        return done(null, false);
      })
      .catch(err => console.log(err));
    })
  );

exports.verifyUser = passport.authenticate('jwt', {session: false});

exports.verifyAdmin = function(req, res, next) {
  User.findOne({where:{email: req.user.email}})
  .then((user) => {
      console.log("User: ", req.user);
      if (user.admin) {
          next();
      }
      else {
          err = new Error('You are not authorized to perform this operation!');
          err.status = 403;
          return next(err);
      } 
  }, (err) => next(err))
  .catch((err) => next(err))
}


