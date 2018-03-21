describe("Creating notes and getting all", function() {
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
                        return (x.id==id && x.author == author && x.text == text);
                    });
                    notes2 = result.filter(x => {
                        return (x.id==id2 && x.author == author2 && x.text == text2);
                    });
                    done();
                }).catch(done);
            }).catch(done);
        }).catch(done);
    });
  
    it("", function() {
        expect(notes1.length+notes2.length).toBe(2);
    });
  });

  describe("Creating and getting a note", function() {
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
  
    it("", function() {
        expect(flag).toBe(true);
    });
  });