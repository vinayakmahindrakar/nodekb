const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

mongoose.connect('mongodb://localhost:27017/nodekb', { useNewUrlParser: true });
let db = mongoose.connection;

//Check connection
db.once('open', ()=>{
	console.log('Connected to MongoDB');
});

// Check for db errors 
db.on('errors', (err)=>{
	console.log(err);
});

// Init App
const app = express();

//Bring in Models
let Article = require('./models/article');

// Load View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Body Parser Middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

//Set public folder
app.use(express.static(path.join(__dirname, 'public')));

// Home Route
app.get('/', (req, res)=>{
	Article.find({}, (err, articles)=>{
		if(err){
			console.log(err);
		}
		else{
			res.render('index', {
				title: 'test',
				articles:articles
			});
		}
	});
});

//Get Single Article
app.get('article/:id', (req,res)=>{
	Article.findById(req.params.id, (err, article)=>{
		res.render('article', {
			article: article
		});
	});
});

// Add Route
app.get('/articles/add', (req, res)=>{
	res.render('add_article', {
		title: 'Add Article'
	});
});

//Add Submit POST Route
app.post('/articles/add', (req, res)=>{
	let article = new Article();
	article.title = req.body.title;
	article.author = req.body.author;
	article.body = req.body.body;
	article.save((err)=>{
		if (err) {
			console.log(err);
		}
		else{
			res.redirect('/');
		}
	});
});

// Start Server
app.listen(3000, (req, res)=>{
	console.log('server started on port 3000');
});