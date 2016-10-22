"use strict";

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mailer = require('express-mailer');
const cookieParser = require('cookie-parser');
const session = require('express-session');
require('dotenv').config();

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
    user: process.env.FC_EMAIL_USERNAME,
    pass: process.env.FC_EMAIL_PASSWORD
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
 * UTIL Function *
 **********/

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login');
}

/**********
 * ROUTES *
 **********/

app.get('/', (req, res) => {
	res.render('index');

});

app.get('/about-us', (req, res) => {
	res.render('about-us');

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
		    repair: newLead.repair,
		    fenceType: newLead.fenceType,
		    dateCompleted: newLead.dateCompleted,
		    hear: newLead.hear,
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
  	res.redirect('/admin');
  	// res.redirect('/route');
    // return res.json({ sucess: 'sucess', redirectUrl: redirectUrl});
  },
  function(err, req, res, next) {
    // return res.json(err);
    res.send('Wrong Password');
 });


app.get('/admin', (req, res) => {
	let allLeads; 
	ensureAuthenticated(req, res, function(){
		db.Lead.find((err, leads) =>{
			if (err){
	      		res.json(err);
	    	}
	    allLeads = leads;
		});

		db.Review.find((err, reviews) =>{
		if (err){
      		return res.send(err);
    	}
    	const unApprovedReviews = reviews.filter(review =>{
    		return !review.approved;
    	});
    	return res.render('admin', {
    		reviews: unApprovedReviews,
    		leads: allLeads

    	});
    });
	});
});

app.get('/admin/approved', (req, res) => {
	ensureAuthenticated(req, res, function(){
		db.Review.find((err, reviews) =>{
		if (err){
      		return res.send(err);
    	}
    	const approvedReviews = reviews.filter(review =>{
    		return review.approved;
    	});
    	return res.render('admin', {
    		reviews: approvedReviews,
    		leads: null
    	});
	});
});
});


app.get('/reviews', (req, res) =>{
	db.Review.find((err, reviews) =>{
		if (err){
      		res.send(err);
    	}
    	const approvedReviews = reviews.filter((review) =>{
    		return review.approved;
    	});
    	res.render('reviews', {
    		
    		reviews: approvedReviews

    	});
	});
});

app.post('/reviews', (req, res) => {
	const newReview = req.body;
	newReview.date = new Date();
	newReview.approved = false;
	db.Review.create(newReview, (err, review) => {
		if(err){
			return res.send("Error " + err);
		}
		res.redirect('/reviews'); // use flash to notify user 

	});
});

app.get('/approve-reviews/:id', function(req, res){
	ensureAuthenticated(req, res, function(){
	    db.Review.findOneAndUpdate({ _id: req.params.id }, { approved: true }, (err, review) => {
	    	if (err){
      			return res.json(err);
    		}
	    	return res.json(review);
	    });
	});
});	


app.get('/unapprove-reviews/:id', function(req, res){
	ensureAuthenticated(req, res, function(){
	    db.Review.findOneAndUpdate({ _id: req.params.id }, { approved: false }, (err, review) => {
	    	if (err){
      			return res.json(err);
    		}
	    	return res.json(review);
	    });
	});
});		   

app.get('/contact-us', (req, res) => {
	res.render('contact-us');

});

/**********
 * ROUTES Fence Pages *
 **********/

app.get('/cedar-fences-denver', (req, res) => {
	res.render('cedar-fences-denver');
});

/**********
 * SERVER *
 **********/

app.listen(process.env.PORT || 3001, function () {
  console.log('Express server is up and running on http://localhost:3001/');
});