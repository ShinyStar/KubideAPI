const DocumentDBClient = require('documentdb').DocumentClient;
const host = "https://kubide-api-db.documents.azure.com:443/";
const authKey = "21vWxHKnK7H1JPHgK79lvPFmz331miMNP8hNVLGSTC7Ppcp00dnRF13XzolrAmblIyrQpUOrRJYjt1ix6Jh6lQ==";
const dbLink = "dbs/kubide-api-db";

const Database = {};

let client = new DocumentDBClient(host, {
    masterKey: authKey
});


Database.getNotes = function(){
    return new Promise((resolve, reject) => {
        let querySpec = { query: 'SELECT * FROM Notes' };
        client.queryDocuments(dbLink+"/colls/Notes", querySpec).toArray((err, results) => {
            if (err) {
                reject(err);
            } else {
                let finalResult = results.map(x => ({id: x.id, author: x.author, text: x.text, date: x.date}));
                resolve(finalResult);
            }
        });
    });
}

Database.createNote = function(author, text){
    return new Promise((resolve, reject) => {
        let doc = {author: author, text: text, date: new Date().toUTCString()};
        client.createDocument(dbLink+"/colls/Notes", doc, ((err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results.id);
            }
        }));
    });
}

Database.getNote = function(id){
    return new Promise((resolve, reject) => {
        let querySpec = { query: `SELECT * FROM Notes n WHERE n.id="${id}"` };
        client.queryDocuments(dbLink+"/colls/Notes", querySpec).toArray((err, results) => {
            if (err) {
                reject(err);
            } else {
                let finalResult = results.map(x => ({id: x.id, author: x.author, text: x.text, date: x.date}));
                resolve(finalResult[0]);
            }
        });
    });
}

Database.addFav = function(user, noteId){
    return new Promise((resolve, reject) => {
        let querySpec = { query: `SELECT * FROM Users u WHERE u.name="${user}"` };
        client.queryDocuments(dbLink+"/colls/Users", querySpec).toArray((err, results) => {
            if (err) {
                reject(err);
            } else {
                if(results.length==0){
                    Database.createUser(user, noteId).then(x => resolve([noteId]));
                }else{
                    results = results[0];
                    if(!(results.favs.includes(noteId))){
                        results.favs.push(noteId)
                        let doc = results;
                        client.replaceDocument(dbLink+"/colls/Users/docs/"+results.id, doc, (err, updated) => {
                            if (err) {
                                reject(err);
                            } else {
                                resolve(updated.favs);
                            }
                        });
                    }
                }
            }
        });
    });
}

Database.getFavs = function(name){
    return new Promise((resolve, reject) => {
        let querySpec = { query: `SELECT * FROM Users u WHERE u.name="${name}"` };
        client.queryDocuments(dbLink+"/colls/Users", querySpec).toArray((err, results) => {
            if (err) {
                reject(err);
            } else {
                Promise.all(results[0].favs.map(Database.getNote)).then(resolve);
            }
        });
    });
}

//Auxiliary

Database.createUser = function(name, fav){
    return new Promise((resolve, reject) => {
        let doc = {name: name, favs: [fav] || []};
        client.createDocument(dbLink+"/colls/Users", doc, ((err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results.id);
            }
        }));
    });
}

module.exports = Database;