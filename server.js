var express = require("express");
var	app = express();
var	http = require("http");
var	bodyParser = require('body-parser');

// MONGO
var	mongoose = require('mongoose');
var dbSchema = require('./schema.js');

var db = 'mongodb://localhost/linky';
mongoose.connect(db);
// END MONGO

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}));

http.createServer(app).listen(3000, function () {
	console.log('Listening on port 3000');
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

// GET ONE sample it's by body
app.get('/search/:sample', function(req, res) {
  console.log('getting all sample');
  dbSchema.findOne({
    "sample": req.params.sample
    })
    .exec(function(err, sample) {
      if(err) {
        res.send('error occured')
      } else {
        console.log(sample);
        res.json(sample);
      }
    });
});

// POST VALUE
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
	dbSchema.findOneAndRemove({_id: req.params.id},
	 function (err, sample) {
	 	if (err) {
	 		res.send('An error has occured while removing');
	 	} else {
	 		res.status(204);
	 		res.send('sample')
	 	}
	});
});