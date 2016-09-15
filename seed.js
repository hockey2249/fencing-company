var db = require('./models');

var user = 
  {
    username: 'kyle',
    password: 'hello123',
  };

db.User.remove({}, function(err, users){
  if(err) {
    console.log('Error occurred in remove', err);
  }else {
    console.log('removed user');
    db.User.hashPassword(user.password, function(err, hash){
      if (err){
        console.log('err');
      }
      db.User.create({
        username: user.username,
        password: hash,
      }, function(err, user){
        if (err){
          console.log('err');
        }else {
          console.log('User Created');
          process.exit(0);
        }
      }); 
    });
  }
});
