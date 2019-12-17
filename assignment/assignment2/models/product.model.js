const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);
mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
var productSchema = mongoose.Schema(
{
	name:
	{
		type:String,
		required:true,
	},
	category:
	{
		type:String,
		required:true,
	},
	desc:
	{
		type:String,
	},
	price:
	{
		type:Number,
		required:true
	},
	image:
	{
		type:String,
	},
	reviews:
	{
		type:String,
	},
	seller_username:
	{
		type:String,
		required:true
	}

})
var Product = mongoose.model("Product",productSchema);
module.exports = Product;