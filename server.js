const express = require('express');
const app = express();
const bodyParser = require('body-parser');


/**********
 * MIDDLEWARE *
 **********/

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/**********
 * Database *
 **********/

const db = require('./models/'); 

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
		res.redirect('/thank-you');
	});
});











/**********
 * SERVER *
 **********/

app.listen(process.env.PORT || 3001, function () {
  console.log('Express server is up and running on http://localhost:3001/');
});