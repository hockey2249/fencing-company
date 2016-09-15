const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mailer = require('express-mailer');
const secrets = require('./secrets');
const cookieParser = require('cookie-parser');
const session = require('express-session');

/**********
 * MIDDLEWARE *
 **********/

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mailer.extend(app, {
  from: 'highermarkets@gmail.com',
  host: 'smtp.gmail.com',
  secureConnection: true, 
  port: 465, 
  transportMethod: 'SMTP', 
  auth: {
    user: secrets.FC_EMAIL_USERNAME,
    pass: secrets.FC_EMAIL_PASSWORD
  }
});

/**********
 * Database *
 **********/

const db = require('./models/'); 

/**********
 * PASSPORT *
 **********/

app.use(cookieParser());
app.use(session({ 
  secret: 'keyboard cat'
}));
const passportConfig = require('./passport-config');
const passport = passportConfig(app, db);

/**********
 * ROUTES *
 **********/

app.get('/', (req, res) => {
	res.render('index');

});

app.get('/api/leads', (req, res) =>{
	db.Lead.find((err, leads) =>{
		if (err){
      		res.json(err);
    	}
    	res.json(leads);
	});
});

app.get('/thank-you', (req, res) => {
	res.render('thank-you');

});

app.post('/new-lead', (req, res) => {
	const newLead = req.body;	
	db.Lead.create(newLead, (err, lead) =>{
		if(err){
			res.send("Error " + err);
		}
		app.mailer.send('email', {
		    to: 'highermarkets@gmail.com', 
		    subject: newLead.firstName + ' ' + newLead.lastName,
        	firstName: newLead.firstName,
		    lastName: newLead.lastName,
		    phone: newLead.phone,
		    email: newLead.email
		}, function (err) {
		    if (err) {
		      	res.json(err);
		    	return;
	    	} 	
        	res.redirect('/thank-you');
	  	});
	});
});

app.get('/login', (req, res) => {
	res.render('login');
});

app.post('/login', passport.authenticate('local', {failWithError: true}),
  function(req, res, next) {
  	var redirectUrl = '/user-portal';
  	if(req.user && req.user.role === 'admin'){
  		redirectUrl = '/blog-post';
  	}
  	res.send('Hey It Works!!');
  	// res.redirect('/route');
    // return res.json({ sucess: 'sucess', redirectUrl: redirectUrl});
  },
  function(err, req, res, next) {
    // return res.json(err);
    res.send('Wrong Password');
 });

/**********
 * SERVER *
 **********/

app.listen(process.env.PORT || 3001, function () {
  console.log('Express server is up and running on http://localhost:3001/');
});