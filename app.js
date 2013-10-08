/**
 * Module dependencies.
 */

var express = require('express');
//var routes = require('./routes');
//var user = require('./routes/user');
var http = require('http');
var mongoose = require('mongoose');
//var path = require('path');

var app = express();

// all environments
app.configure(function(){
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(__dirname, 'public'));
});


//Create Database
mongoose.connect("mongodb://localhost/notepad");
//Create Schema
var NoteSchema = new mongoose.Schema({
        title: String,
        nbody: String,
        created: Date,
        updated: Date,
    }),
        Notes = mongoose.model('Notes', NoteSchema);


//Index
//app.get('/', routes.index);
app.get('/notes', function(req, res){
    Notes.find({}, function(err, docs){
        res.render('index', {notes:docs});
    });
});

//New
app.get('/notes/new', function(req, res){
    res.render("new");
});

//Post
app.post('/notes', function(req, res){
    var b = req.body;
    Notes({
        title: b.title, required: true,
        nbody: b.nbody,
        created: new Date(),
        updated: new Date()
    }).save(function (err, docs){
        if(err) res.json(err);
        res.redirect("/notes/");
    });
});

app.param('id', function(req, res, next, id) {
        Notes.find({_id: id}, function (err, docs) {
            req.note = docs[0];
            next();
        });
});

//SHOW
app.get('/notes/:id', function(req, res) {
    res.render("show", {note:req.note});
});

//EDIT
app.get('/notes/:id/edit', function(req, res) {
        res.render("edit", {note: req.note});
});

//UPDATE
app.put('/notes/:id', function (req, res){
  return Notes.findById(req.params.id, function (err, note) {
    note.title = req.body.title;
    note.nbody = req.body.nbody;
    note.updated = new Date();
    return note.save(function (err) {
      if (!err) {
        console.log("updated");
      } else {
        console.log(err);
      }
      return res.redirect("/notes/");
    });
  });
});

//DELETE
app.delete('/notes/:id', function(req, res) {
    var id = req.params.id;
    Notes.remove({_id: id}, function(err, data) {
        if (err) {console.log(err) }
       // res.json(data);
        return res.redirect("/notes");
    });
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
