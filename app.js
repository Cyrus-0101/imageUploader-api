const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

require("./mvc/models/db");

const indexRouter = require('./mvc/routes/index');
const usersRouter = require('./mvc/routes/users');

const app = express();

app.set('views', path.join(__dirname, 'mvc', 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', (req, res, next) => {
	res.header('Access-Control-Allow-Origin', 'http://localhost:4200');
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
	next();
});

app.use('/', indexRouter);
app.use('/users', usersRouter);



app.use(function(req, res, next) {
	next(createError(404));
});

app.use(function(err, req, res, next) {
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);
    console.log(err.message);
    console.log(err.stack);
	res.render('error');
});

module.exports = app;
