var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var consolidate = require('consolidate');
var dust = require('dustjs-helpers');
var pg = require('pg');
var constring = "postgres://user:password@localhost:5432/recipedb";
var app = express();

app.engine('dust', consolidate.dust);
app.set('view engine', 'dust' );
app.set('views', __dirname + '/views');
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));


//route

app.get('/', function(req,res){

// connect to postgres database
	pg.connect(constring, function (err, client, done) {
	  if (err) throw err;

	  // execute a query on database
	  client.query('SELECT * FROM recipes', function (err, result) {
	    if (err) throw err;

	    res.render('index', {recipes: result.rows})

	    // disconnect the client
	    client.end(function (err) {
	      if (err) throw err;
	    });
	  });
	});
})

app.post('/add', function(req, res){

	pg.connect(constring, function (err, client, done) {
		client.query('INSERT INTO recipes(name, ingredients, direction) VALUES($1,$2,$3)', [req.body.name, req.body.ingredients, req.body.directions]);
	//req.body.name, req.body.ingredients, req.body.directions
	 done();
	 res.redirect('/');

	
	});//connect
	
})


app.delete('/delete/:id', function(req, res){

	pg.connect(constring, function (err, client, done) {
		client.query('DELETE FROM recipes WHERE id = $1', [req.params.id]);

	 done();
	 res.sendStatus(200);

	
	});//connect
	
})

app.post('/edit', function(req, res){
	 //console.log("id:"+request.params.id);
	pg.connect(constring, function (err, client, done) {
		client.query('UPDATE recipes set name=$1, ingredients=$2, direction= $3 WHERE id = $4', [req.body.name, req.body.ingredients, req.body.directions, req.body.id]);


	 res.redirect('/');

	
	});//connect
	
})

app.listen(3000);	

