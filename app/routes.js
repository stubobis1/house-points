const path = require('path');
const ejs = require('ejs');
var fs = require('fs');

module.exports = function (app) {
    // application -------------------------------------------------------------
    

    
    app.get('/admin', function (req, res) {
        res.sendFile(__dirname + '/public/admin.html');
    });

    app.get('/', function (req, res) {
        res.sendFile(__dirname + '/public/index.html');
    });

    app.get('/ejs', function (req, res) {
        ejs.renderFile(__dirname + '/templates/index.ejs', {name:"Stuart"}, function(err, data) {
            console.error(err || "");
            console.log(data);
            res.send(data);
        });

    });
};
