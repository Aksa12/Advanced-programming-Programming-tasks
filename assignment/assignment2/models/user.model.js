const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);
mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
var userSchema = mongoose.Schema({
	username:
	{
		type:String,
		unique:true,
		required:true,
		trim:true
	},
	email:
	{
		type:String,
		unique:true,
		required:true,
		trim:true
	},
	password:
	{
		type:String,
		required:true,
	},
	role:
	{
		type:String,
		required:true,
	}
})
var User = mongoose.model("User",userSchema)
module.exports = User