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
                resolve();
            }
        }));
    });
}

module.exports = Database;