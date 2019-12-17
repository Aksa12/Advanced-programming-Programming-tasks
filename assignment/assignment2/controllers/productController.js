const express =  require('express')
require("../models/db");
var Product = require('../models/product.model')
var bodyParser = require("body-parser")
var multer = require('multer')
var upload = multer()
var session=require('express-session')
var cookieParser = require('cookie-parser')
var login = '/user/login';
var signup = '/user';
var logout = '/user/logout';
var productitems;
var msg ="";
var items;
var router = express.Router();

router.get('/', function(req, res)
{
	
	if (req.session.user)
	{
		console.log("user logged in")
		res.redirect("/product/display")
	}
	else
	{
		console.log("user not logged in")
		res.redirect("/user/login")
	}
})
router.get('/add', function(req, res)
{
	if (req.session.user)
	{
		msg ="";
		res.render('additems', {message:msg})
	}
	else
	{
		console.log("user not logged in. not authorized");
		res.redirect("/");
	}
	
})
router.post('/add', function(req, res)
{
	var name = req.body.name;
	var price = parseFloat(req.body.price);
	var img = req.body.img;
	var desc = req.body.desc;
	var reviews =  req.body.reviews;
	var category = req.body.category;
	var username = req.session.user.username;
	console.log((!name || !price || !category))
	if (!name || !price || !category)
	{
		console.log("fields empty");
		msg = "Name, category and price cannot be empty. Pls Fill in all fields to proceed the process. Enter the data again";
		res.render("additems", {message:msg});
	}
	else
	{
		if ( /\.(jpe?g|png|gif|bmp)$/i.test(img) )
		{
			Product.find({name:name}, function(err, response)
			{
				if (err) throw err;
				console.log(response)
				if (!response[0])
				{
					console.log("unique product found")
					var newproduct = {name:name, category:category, desc:desc, price:price,image:img, reviews:reviews, seller_username:username}
					var product = new Product(newproduct)
					product.save(function(err, Product)
					{
						if (err) throw err;
			    		console.log("product saved in database")
			    		console.log(Product)
					})
					res.redirect("/product/display")
				}
				else
				{
					console.log("No unique product found");
					msg = "A product can only be added once and by a single seller";
					res.render("additems", {message:msg});
				}
		
			})
		}
		else
		{
			console.log("Incorrect image extension");
			msg = "	Incorrect image extension. Enter the data again";
			res.render("additems", {message:msg});
		}
	}
})
router.get('/display', function(req, res)
{
	if(req.session.user)
	{

		if (req.session.user.role == 'seller')
		{
			Product.find({seller_username:req.session.user.username}, function(err, response)
			{
				if (err) throw err;
				console.log(response)
				console.log(response.length)
				productitems = response
				res.render("protected",{request:req.session, logout_url:logout, item:productitems})
			})
		}
		else
		{
			Product.find(function(err, response)
			{
				if (err) throw err;
				console.log(response)
				console.log(response.length)
				productitems = response
				res.render("protected",{request:req.session, logout_url:logout, item:productitems})
			})
		}
	}
	else
	{
		console.log("user not logged in. not authorized");
		res.redirect("/");
	}
})
router.get('/edit/:name', function(req, res)
{
	if (req.session.user)
	{
		if(req.session.user.role=="seller")
		{
			msg ="";
			var pname = req.params.name;
			console.log("seller")
			console.log(pname)
			Product.find({name:pname}, function(err, response)
			{
				if (err) throw err;
				items = response[0]
				console.log(items);
				res.render("edititems", {message:msg, item:items})
			})
		}
		else
		{
			console.log("not authorized to go there")
			res.redirect('/product')
		}
	}
	else
	{
		console.log("user not logged in. not authorized");
		res.redirect("/");
	}
	
})
router.post('/edit', function(req, res)
{
	var name = req.body.name;
	var price = parseFloat(req.body.price);
	var img = req.body.img;
	var desc = req.body.desc;
	var reviews =  req.body.reviews;
	var category = req.body.category;
	console.log((!price || !category))
	if (!price || !category)
	{
		console.log("fields empty");
		msg = "Category and price cannot be empty. Pls Fill in all fields to proceed the process. Enter the data again";
		res.render("edititems", {message:msg, item:items});
	}
	else
	{
		if ( /\.(jpe?g|png|gif|bmp)$/i.test(img) )
		{
			Product.updateOne({name:name},{price:price, image:img,desc:desc, reviews:reviews, category:category}, function(err, response)
			{
			if (err) throw err;
			console.log(response.nModified)
			if (response.nModified)
			{
				console.log("updated");
			    console.log(response);
			    
			}
			res.redirect("/product/display")
			})
		}
		else
		{
			console.log("incorrect image extension.");
			msg = "Incorrect image extension. Enter the data again";
			res.render("edititems", {message:msg, item:items});
		}
		
	}
})
router.get('/delete/:name', function(req, res)
{

	if (req.session.user)
	{
		if(req.session.user.role=="seller")
		{
			var pname = req.params.name;
			console.log("seller")
			console.log(pname)
			Product.deleteOne({name:pname}, function(err, response)
			{
				if (err) throw err;
				console.log(response.deletedCount)
				if (!response.deletedCount)
				{
				    res.send("error deleting data");
				}
				res.redirect("/product/display")
				
				
			})
		}
		else
		{
			console.log("not authorized to go there")
			res.redirect('/product')
		}
	}
	else
	{
		console.log("user not logged in. not authorized");
		res.redirect("/");
	}
})
module.exports=router