const mongoose = require('mongoose');
mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect('mongodb://localhost/mydb', function(err)
	{
		if (err) throw err;
		console.log("Mongodb Database my db connected")
		
	});

var User = require('./user.model')
var Product = require('./product.model')