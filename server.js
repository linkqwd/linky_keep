var express = require("express");
var	app = express();
var	http = require("http");
var	bodyParser = require('body-parser');
var	mongoose = require('mongoose');

// MONGO
var dbSchema = require('./schema.js');
var db = 'mongodb://localhost/linky';
mongoose.connect(db);
// END MONGO

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}));

var port = 80;
http.createServer(app).listen(port, function () {
	console.log('Listening on port: ' + port);
});

app.use(express.static(__dirname + "/client"));

// ROUTES //

// GET ALL samples
app.get('/samples', function (req, res) {
	dbSchema.find({})
		.exec( function(err, val) {
			if (err) {
				res.send('An error has occured');
			} else {
				res.json(val);
			}
		});
});

// GET One sample by its body
app.get('/search/:sample', function(req, res) {
  dbSchema.findOne({
    "sample": req.params.sample
    })
    .exec(function(err, sample) {
      if(err) {
        res.send('An error has occured')
      } else {
        res.json(sample);
      }
    });
});

// POST value
app.post('/value', function (req, res) {
	var newValue = new dbSchema();
	newValue.sample = req.body.sample;

	newValue.save( function (err, value) {
		if (err) {
			res.send('An error has occured');
		} else {
			res.send(value);
		}
	});
});

// DELETE sample
app.delete('/sample/:id', function (req,res) {
	dbSchema.findOneAndRemove({
		_id: req.params.id
	}, function (err, sample) {
	 	if (err) {
	 		res.send('An error has occured while removing');
	 	} else {
	 		res.send(sample);
	 	}
	});
});

// UPDATE sample
app.put('/update/:id', function (req, res) {
	dbSchema.findOneAndUpdate({_id: req.params.id},
	 {$set: {sample: req.body.sample}}, 
	 function (err, sample) {
	 	if (err) {
	 		res.send('An error has occured while updateing');
	 	} else {
	 		res.send(sample);
	 	}
	 });
});