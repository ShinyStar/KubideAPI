const express = require('express');
const app = express();

const db = require('./src/db.js');

// db.createNote("test", "prueba").then(x=>console.log(x)).catch(err=>console.log(err));
// db.getNotes().then(x=>console.log(x)).catch(err=>console.log(err));
// db.getNote(1).then(x=>console.log(x)).catch(err=>console.log(err));
// db.addFav("silvia", 0).then(x=>console.log(x)).catch(err=>console.log(err));
// db.addFav("newUser", 1).then(x=>console.log(x)).catch(err=>console.log(err));
// db.getFavs("jasmine").then(x=>console.log(x)).catch(err=>console.log(err));

//REST API

app.get('/', (req, res) => res.send('Hiii!'));

//Create a note
app.post('/note/:userid', function (req, res) {
    //db.createNote
});

//Get all notes
app.get('/notes', function (req, res) {
    db.getNotes().then(result => {
	    res.json(result);
    }).catch(err => {
        res.json(err);
    });
});

//Get a single note
app.get('/notes/:id', function (req, res) {
	db.getNote(req.params.id).then(result => {
	    res.json(result);
    }).catch(err => {
        res.json(err);
    });
});

//Fav a note
app.post('/favs/:userid/:noteid', function (req, res) {
	//db.addFav
});

//Get favs
app.get('/favs/:user', function (req, res) {
	db.getFavs(req.params.user).then(result => {
	    res.json(result);
    }).catch(err => {
        res.json(err);
    });
});

app.listen(8080);