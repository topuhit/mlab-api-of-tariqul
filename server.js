// server.js
// where your node app starts

// init project
var express = require("express")
var compression = require('compression')
var multer = require('multer')
var axios = require('axios')
var app = express()
var path = require('path')
var Router = require('router')
var router = express.Router();
var helmet = require('helmet')
var _ = require('lodash');
require('dotenv').config()
app.use(express.static('files'))
// compress all responses
app.use(compression())
app.use('/static', express.static(path.join(__dirname, 'files')))
app.use(helmet())
app.use(express.static(path.join(__dirname, 'uploads')));
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }));
var ejs = require('ejs')
app.set('view engine', 'ejs')

var mongoose = require('mongoose');

// var uri = 'mongodb://username:pass@ds*****8.mlab.com:12321/asdfsadf'

var uri = process.env.DB_HOST;
        // Create song schema
        var songSchema = mongoose.Schema({
            decade: String,
            artist: String,
            song: String,
            category: String,
            weeksAtOne: Number,
            age: Number
        });


app.get('/', function(req, res) {
    // cloudinary.v2.uploader.destroy('speakers/Firefox_Screenshot_2017-02-28T16-56-09113Z-20171101220013_cikpqj', 
    //     {invalidate: true }, function(error, result) {console.log(result)});
    var visitedid = {
        visitedid: req.originalUrl,
    }

    mongoose.Promise = global.Promise
    mongoose.connect(uri);
    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function callback() {
        // Store song documents in a collection called "songs"
        var Song = mongoose.model('songs', songSchema);
        // Create seed data
        Song.find({}, function(err, users) {
            console.log(users)
            var myJSON = JSON.stringify(users, null, 4);
            res.render('index', {
                data: myJSON
             });
        });
    });
})


app.get('/upload', function(req, res) {
    res.render('upload', {});
})


app.get('/upload/:id', function(req, res) {



    mongoose.Promise = global.Promise
    mongoose.connect(uri);
    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function callback() {

      var id = req.params.id;
      var Song = mongoose.model('songs', songSchema);
        Song.findById(id, function(err, user) {
            console.log(user);
             res.render('individual_update_form', {
                data: user
             });
            
        });


       
    });




    
})


app.post('/upload/:id', function(req, res) {

console.log(req.params.id);
        var Song = mongoose.model('songs', songSchema);
Song.update({ _id: req.params.id }, req.body, { multi: false }, function(err) {
    if(err) { throw err; }
    res.redirect('/upload/'+req.params.id)
})


})


app.post('/upload', function(req, res) {
    // cloudinary.v2.uploader.destroy('speakers/Firefox_Screenshot_2017-02-28T16-56-09113Z-20171101220013_cikpqj', 
    //     {invalidate: true }, function(error, result) {console.log(result)});
    console.log(req.body); // the posted data
    var visitedid = {
        visitedid: req.originalUrl,
    }
    mongoose.Promise = global.Promise
    mongoose.connect(uri);
    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function callback() {

        // Store song documents in a collection called "songs"
        var Song = mongoose.model('songs', songSchema);
        // Create seed data
        var seventies = new Song(req.body);
        var list = [seventies]
        Song.insertMany(list);
        var id = "5a6c41997f5a4e22ec753cf9";
        Song.findById(id, function(err, user) {
            console.log(user);
        });
        res.render('upload', {});
    });
})




// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
