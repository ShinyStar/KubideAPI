describe("Creating notes and getting all", function () {
    const db = require('./../src/db.js');
    let notes1 = [], notes2 = [];

    beforeEach(function (done) {
        let author = "jasmine",
            text = "jasmine test",
            author2 = "second",
            text2 = "second test";
        db.createNote(author, text).then(id => {
            db.createNote(author2, text2).then(id2 => {
                db.getNotes().then(result => {
                    notes1 = result.filter(x => {
                        return (x.id == id && x.author == author && x.text == text);
                    });
                    notes2 = result.filter(x => {
                        return (x.id == id2 && x.author == author2 && x.text == text2);
                    });
                    done();
                }).catch(done);
            }).catch(done);
        }).catch(done);
    });

    it("", function () {
        expect(notes1.length + notes2.length).toBe(2);
    });
});

describe("Creating and getting a note", function () {
    const db = require('./../src/db.js');
    let flag = false;

    beforeEach(function (done) {
        let author = "jasmine";
        let text = "jasmine test";
        db.createNote(author, text).then(id => {
            db.getNote(id).then(result => {
                flag = (result.id == id && result.author == author && result.text == text);
                done();
            }).catch(done);
        }).catch(done);
    });

    it("", function () {
        expect(flag).toBe(true);
    });
});

describe("Adding and getting favorites", function () {
    const db = require('./../src/db.js');
    let notes = [];

    beforeEach(function (done) {
        let user = "jasmine",
            author = "jasmineAuthor",
            text = "jasmine test";
        db.createNote(author, text).then(id => {
            db.addFav(user, id).then(note => {
                db.getFavs(user).then(result => {
                    notes = result.filter(x => {
                        return (x.id == id && x.author == author && x.text == text);
                    });
                    done();
                }).catch(done)
            }).catch(done);
        }).catch(done);
    });

    it("", function () {
        expect(notes.length).toBe(1);
    });
});

describe("Adding favorites to new user", function () {
    const db = require('./../src/db.js');
    let notes = [];

    beforeEach(function (done) {
        let author = "jasmine",
            text = "jasmine test";
        db.createNote(author, text).then(id => {
            let user = "NewUser"+id;
            db.addFav(user, id).then(note => {
                db.getFavs(user).then(result => {
                    notes = result.filter(x => {
                        return (x.id == id && x.author == author && x.text == text);
                    });
                    done();
                }).catch(done)
            }).catch(done);
        }).catch(done);
    });

    it("", function () {
        expect(notes.length).toBe(1);
    });
});

describe("Rest API", function () {
    const request = require('request');
    let opt = {
        uri: "http://localhost:8080/note/jasmine",
        method: "POST",
        json: {
            "text": "PostTestNote"
        }
    }
    let noteId;
    let flag = false;

    let makeRequest = function(done){
        //Create node
        request(opt, (err, res, body) => {
            if (!err && res.statusCode == 200) {
                //Get that note
                noteId = body;
                opt.uri = "http://localhost:8080/notes/" + noteId;
                opt.method = "GET";
                request(opt, (err, res, body) => {
                    if (!err && res.statusCode == 200) {
                        //Fav note
                        opt.uri = "http://localhost:8080/fav/jasmine";
                        opt.method = "POST";
                        opt.json = { "note": noteId };
                        request(opt, (err, res, body) => {
                            if (!err && res.statusCode == 200) {
                                //Get user favs
                                opt.uri = "http://localhost:8080/favs/jasmine";
                                opt.method = "GET";
                                request(opt, (err, res, body) => {
                                    if (!err && res.statusCode == 200) {
                                        flag = body.filter(x => {
                                            return (x.id == noteId);
                                        }).length == 1;
                                        if (flag) {
                                            //Get all notes
                                            opt.uri = "http://localhost:8080/notes";
                                            request(opt, (err, res, body) => {
                                                if (!err && res.statusCode == 200) {
                                                    flag = body.filter(x => {
                                                        return (x.id == noteId);
                                                    }).length == 1;
                                                    done();
                                                } else {
                                                    done();
                                                }
                                            });
                                        } else {
                                            done();
                                        }
                                    } else {
                                        done();
                                    }
                                });
                            } else {
                                done();
                            }
                        });
                    } else {
                        done();
                    }
                });
            } else {
                console.log(err)
                if(err.code == 'ECONNREFUSED'){
                    setTimeout(x => makeRequest(done), 100);
                }else{
                    done();
                }
            }
        });
    }

    beforeEach(function (done) {
        const { spawn } = require('child_process');
        const server = spawn('node', ['app.js']);
        //Waits for the server to initialize
        setTimeout(x => makeRequest(done), 1000);
    });

    it("", function () {
        expect(flag).toBe(true);
    });
});