const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');	
const session = require('express-session');	


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

//Express Session Middleware
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
}));

//Express Messages Middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

//Express Validator Middleware
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

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

//Route Files
let articles = require('./routes/articles');
app.use('/articles', articles);

// Start Server
app.listen(3000, (req, res)=>{
	console.log('server started on port 3000');
});