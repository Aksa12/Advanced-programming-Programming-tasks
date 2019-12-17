require("./models/db");
var User = require('./models/user.model')
const express = require('express')
var bodyParser = require("body-parser")
var multer = require('multer')
var upload = multer()
var session=require('express-session')
var cookieParser = require('cookie-parser')
const userController = require('./controllers/userController')
const productController = require('./controllers/productController')
var app = express()
app.set('view engine','pug')
app.set('views','./views')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use(upload.array())
app.use(cookieParser())
app.use(express.static('public'))
app.use(session(
{
	secret:'work hard',
	resave:true,
	saveUninitialized:false
}))
app.get('/', function(req, res)
{
	if (req.session.user)
	{
		res.redirect('/user/protected')
	}
	else
	{
		var login = '/user/login';
		var signup = '/user';
		res.render('index',{login_url:login, signup_url:signup })
	}
	
})
app.use('/user', userController)
app.use('/user/login', userController)
app.use('/user/protected', userController)
app.use('/product', productController)
app.use('/product/edit/:name', productController)
app.use('/user/logout', userController)


app.listen(3000) 