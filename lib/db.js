var mysql = require('mysql');

var db = mysql.createConnection({
    host: 'localhost',
    user: 'joyoon',
    password: '1234',
    database: 'opentutorials'
});

module.exports = db;