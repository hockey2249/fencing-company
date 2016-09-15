module.exports = function(app, db){

const passport = require('passport'); 
const LocalStrategy = require('passport-local').Strategy;

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(function(username, password, done) {
    db.User.findOne({ username: username }, function(err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      user.validatePassword(password, function(err, result){
        if(err || !result){
          return done(null, false, { message: 'Incorrect password.' });
        }else{
          return done(null, user);
        }
      });
    });
}));

passport.serializeUser(function(user, done) {
  return done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  db.User.find(function(err, users){
    if (err){
      done(err);
    }
    var user = users.filter(function(user){
      return user.id == id;
    })[0];
    done(null, user);
  });
});

return passport;

};