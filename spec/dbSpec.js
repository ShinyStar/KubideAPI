describe("Note operations", function() {
    const db = require('./../src/db.js');
    const uuidv4 = require('uuid/v4');
    let notes = [];

    beforeEach(function (done) {
        let author = "jasmine";
        let text = uuidv4();
        db.createNote(author, text).then(x => {
            db.getNotes().then(result => {
                notes = result.filter(x => {
                    return (x.author == author && x.text == text);
                });
                done();
            }).catch(x => done());
        }).catch(x => done());
    });
  
    it("-Creating and getting notes", function() {
        expect(notes.length).toBeGreaterThan(0);
    });
  });