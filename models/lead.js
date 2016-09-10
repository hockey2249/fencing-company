const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LeadSchema = new Schema({
  	firstName: String,
  	lastName: String,
  	email: String,
  	phone: String
});

const Lead = mongoose.model('Lead', LeadSchema);

module.exports = Lead;