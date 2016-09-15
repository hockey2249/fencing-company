const mongoose = require("mongoose");
mongoose.connect( process.env.MONGODB_URI ||
				  process.env.MONGOLAB_URI ||
                  process.env.MONGOHQ_URL ||
                  "mongodb://localhost:27017");

module.exports.Lead = require("./lead.js");
module.exports.User = require("./user.js");
