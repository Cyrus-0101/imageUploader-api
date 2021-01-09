const mongoose = require('mongoose');
let dbURI = 'mongodb://localhost/upload-image-example';


if (process.env.NODE_ENV === 'production') {
    dbURI = process.env.MONGODB_URI;
}


mongoose.connect(dbURI, { useNewUrlParser: true });


// heroku logs --tail

mongoose.connection.on('connected', () => {
	console.log("===================================");
	console.log("===================================");
	console.log("===================================");
    console.log(`Mongoose connected to ${dbURI}`);
	console.log("===================================");
	console.log("===================================");
	console.log("===================================");
});

mongoose.connection.on('error', err => {
	console.log("==================================");
    console.log(`Mongoose connection error: ${err}`);
	console.log("==================================");
});

mongoose.connection.on('disconnected', () => {
	console.log("==================================");
    console.log('Mongoose disconnected');
	console.log("==================================");
});


const gracefulShutdown = (msg, callback) => {
    mongoose.connection.close( () => {
        console.log(`Mongoose disconnected through ${msg}`);
        callback();
    });
};


// For nodemon restarts
process.once('SIGUSR2', () => {
    gracefulShutdown('nodemon restart', () => {
        process.kill(process.pid, 'SIGUSR2');
    });
});


// For app termination
process.on('SIGINT', () => {
    gracefulShutdown('app termination', () => {
        process.exit(0);
    });
});


// For Heroku app termination
process.on('SIGTERM', () => {
    gracefulShutdown('Heroku app shutdown', () => {
        process.exit(0);
    });
});



require('./users');