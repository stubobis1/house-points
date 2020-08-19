const path = require('path');
const ejs = require('ejs');
const fs = require('fs');
const bodyParser = require('body-parser');
const crypto = require('crypto');

const username = "user";
const passhash = "924e815239232f8c06f4394a2969b36b";

const saveJsonPath = "./save.json";


let saveData;


fs.readFile(saveJsonPath, 'utf8', function (err, data) {
    if (err) {
        console.error(err);
        saveData = {};
    }
    else {
        console.log("Loading data...");
        console.log(data);
        try {
            saveData = JSON.parse(data);
        } catch (error) {
            console.log("There was an error parsing the saved data: ");
            console.log(error);
            saveData = {};
        }
    }

    console.log("Data loaded: ");
    console.log(saveData);

});


function getDataForRender() {
    let baseobj = {
        "maxpoints": 100,
        "team1": {
            "height": 0,
            "points": 0,
        },
        "team2": {
            "height": 0,
            "points": 0,
        },
        "team3": {
            "height": 0,
            "points": 0,
        },
        "team4": {
            "height": 0,
            "points": 0,
        }
    }
    let obj =  Object.assign(baseobj, saveData);

    let getHeight = (value, max=obj.maxpoints) => {
        return  Math.min(25, //takes the min of 25 and the value
                Math.max(4, // takes the max of 4 or the value
                value / max * 25));
    }

    obj.team1.height = getHeight(obj.team1.points);
    obj.team2.height = getHeight(obj.team2.points);
    obj.team3.height = getHeight(obj.team3.points);
    obj.team4.height = getHeight(obj.team4.points);


    console.log("Object to render: ");
    console.log(obj);
    return obj;
}

function hash(value)
{
    let submittedPassHash = crypto.createHash('md5').update(value).digest('hex');
    console.log("hash of value");
    console.log(submittedPassHash);
    return submittedPassHash;
}

function proccessDataForSave(formSubmission) {
    let baseobj = {
        "maxpoints": 100,
        "team1": {
            "points": 0,
        },
        "team2": {
            "points": 0,
        },
        "team3": {
            "points": 0,
        },
        "team4": {
            "points": 0,
        }
    }

    //deep copy, with correct structure
    let objToSave = Object.assign(baseobj, JSON.parse(JSON.stringify(saveData)));

    let points = Number.parseInt(formSubmission.points) || 0;
    let maxpoints = Number.parseInt(formSubmission.points) || null;


    let addToTeam = (teamName) => {
        switch (teamName) {
            case "team1":
                objToSave.team1.points += points;
                break;


            case "team2":
                objToSave.team2.points += points;
                break;


            case "team3":
                objToSave.team3.points += points;
                break;


            case "team4":
                objToSave.team4.points += points;
                break;
            default:
                break;
        }
    }

    formSubmission.points = formSubmission.points || 0;

    if (Array.isArray(formSubmission.team)) {
        formSubmission.team.forEach(teamName => { addToTeam(teamName); });
    }
    else {
        addToTeam(formSubmission.team)
    }


    objToSave.maxpoints = Math.max(
        (maxpoints || objToSave.maxpoints),
        objToSave.team1.points,
        objToSave.team2.points,
        objToSave.team3.points,
        objToSave.team4.points
    );

    return objToSave;
}


module.exports = function (app) {

    app.get('/admin', function (req, res) {
        ejs.renderFile(__dirname + '/templates/admin.ejs', getDataForRender(), function (err, data) {
            console.error(err || "");

            res.send(data);
        });
    });

    app.get('/', function (req, res) {
        ejs.renderFile(__dirname + '/templates/index.ejs', getDataForRender(), function (err, data) {
            console.error(err || "");
           
            res.send(data);
        });
    });

    app.use(bodyParser.urlencoded({ extended: true }));
    app.post('/update', function (req, res) {
        

    console.log("================================ UPDATE ==============================")

        
        let body = req.body;
        if (req.body
            && req.body.user == username
            && hash(req.body.pass) == passhash) {
            console.log("verified");


            console.log("Processing");
            let saveObj = proccessDataForSave(req.body);

            console.log("Saving obj:");
            console.log(JSON.stringify(saveObj));
            saveData = saveObj;
            fs.writeFile(saveJsonPath, JSON.stringify(saveObj), 'utf8', function (err, data) {
                if (err) throw err;
            })
            res.redirect('/admin');
        }
        else{
            console.log("incorrect password");
            res.redirect('/')
        }
        console.log(req.body);

        
    })
};
