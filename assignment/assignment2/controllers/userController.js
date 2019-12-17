const express =  require('express')
require("../models/db");
var User = require('../models/user.model')
var bodyParser = require("body-parser")
var multer = require('multer')
var upload = multer()
var session=require('express-session')
var cookieParser = require('cookie-parser')
var router = express.Router();
var login = '/user/login';
var signup = '/user';
var logout = '/user/logout';
var msg = "";
router.get('/', function(req, res)
{
	msg ="";
	if (!req.session.user)
	{
	    res.render('form',{message:msg, login_url:login});
	}
	else
	{
		console.log("user already logged in")
		res.redirect("/");
	}
	
})
router.post('/', function(req, res)
{
	var username = req.body.username;
	var password = req.body.pass;
	var cpassword = req.body.cpass;
	var email = req.body.email;
	var role = req.body.role;
	console.log(username+" "+password+" "+cpassword+" "+email+" "+role);
	if (!username || !password || !cpassword || !email)
	{
		console.log("fields empty");
		msg = "Fields are empty. Pls Fill in all fields to proceed the process. Enter the data again";
		res.render("form", {message:msg, login_url:login});
	}
	else
	{
		if (password!=cpassword)
		{
			console.log("Password Not matched");
			msg = "Password not matched.Pls enter the data again";
			res.render("form", {message:msg, login_url:login});
		}
		else
		{
			User.find({username:username}, function(err, response)
			{
				if (err) throw err;
				console.log(response)
				if (!response[0])
				{
					console.log("unique username found")
					User.find({email:email}, function(err, response)
					{
						if (err) throw err;
						if (!response[0])
						{
							console.log("unique email found")
							var newuser = {username:username, password: password, email:email, role:role}
							var user_id;
							var user = new User(newuser)
							user.save(function (err, User)
								{
									if (err) throw err;
									console.log("user saved in database")
									user_id = User._id;
									
								})
							req.session.user = {username:username, password: password, email:email, role:role, us_id:user_id}
							return res.redirect("/user/login");
						}
						else
						{
							console.log("No unique email found");
							msg = "Email already exists.Pls enter the data again";
							res.render("form", {message:msg, login_url:login});
						}
					})
				}
				else
				{
					console.log("No unique Username found");
					msg = "Username is not unique.Pls enter the data again";
					res.render("form", {message:msg, login_url:login});
				}
		
			})
		}
		
	}		
})

router.get('/login', function(req, res)
{
	msg = "";
	if (req.session.user)
	{
		console.log("user logged in")
		res.redirect('/user/protected')
	}
	else
	{
		console.log("user not logged in")
		res.render("login",{message:msg, signup_url:signup})
	}
})
router.get('/protected', function(req, res)
{
	
	if (req.session.user)
	{   
		if (req.session.user.role == "admin")
		{
			console.log("admin logged in")
			res.redirect('/user/display')
		}
		else
		{
			console.log("user logged in")
		    res.redirect('/product')
		}
		
	}
	else
	{
		console.log("user not logged in")
		res.redirect("/user/login")
	}
})
router.get('/display', function(req, res)
{
	if (req.session.user)
	{   
		if (req.session.user.role == "admin")
		{
			console.log("admin logged in")
			User.find(function(err, response)
			{
				if (err) throw err;
				console.log(response)
				console.log(response.length)
				var users = response;
				res.render("usersdisplay",{request:req.session, logout_url:logout, users:users})
			})
		}
		else
		{
			console.log("Only admin can access it")
		    res.redirect('/user/protected')
		}
		
	}
	else
	{
		console.log("user not logged in")
		res.redirect("/user/login")
	}

})
router.post('/login', function(req, res)
{
	var username = req.body.username;
	var password = req.body.pass;
	if (!username || !password)
	{
		console.log("fields empty");
		msg = "Fields are empty. Pls Fill in all fields to proceed the process. Enter the data again";
		res.render("login", {message:msg, signup_url:signup});
	}
	else
	{
		User.find({username:username}, function(err, response)
			{
				if (err) throw err;
				console.log(response[0])
				if (response[0])
				{
					console.log("user exists")
					if (response[0].password == password)
					{
						console.log("password correct")
						req.session.user = response[0]
						res.redirect("/user/protected")
					}
					else
					{
						console.log("Password Wrong");
						msg = "Password Incorrect. Enter the data again";
						res.render("login", {message:msg, signup_url:signup});
					}
					
				}
				else
				{
					console.log("user doesn't exists")
					msg = "Username does not exist. Pls Enter the correct data";
					res.render("login", {message:msg, signup_url:signup});
				}
			})
	}
})
router.get('/logout',function(req,res)
{    
    req.session.destroy(function(err){  
        if(err){  
            console.log(err);  
        }  
        else  
        {  
            res.redirect('/user/login');  
        }  
    })
})

module.exports = router;