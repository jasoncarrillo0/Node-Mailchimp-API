// configure constants and setup express app
const dotenv     = require('dotenv');
const express    = require("express");
const bodyParser = require("body-parser");
const request    = require("request");
const app        = express();
dotenv.config();
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


// Begin home route
app.get("/", function(req, res) {
    res.sendFile(__dirname + "/signup.html");
});
app.post("/", function(req, res){
    var firstName = req.body.firstName;
    var lastName  = req.body.lastName;
    var email     = req.body.email;
    var data      = {
        "email_address": email,
        "status": "subscribed",
        "merge_fields": {
            "FNAME": firstName,
            "LNAME": lastName
        }
    }          
    var jsonData = JSON.stringify(data);
    var options   = {
        url: "https://us3.api.mailchimp.com/3.0/lists/" + process.env.LIST_ID + "/members",
        method: "POST", 
        headers: {
            "Authorization": "jason " + process.env.API_KEY
        },
        body: jsonData  
    }

    request(options, function(error, response, body) {
        if (error) {
            console.log(error);
        }
        else if (respons.statusCode >= 400) {
            res.sendFile(__dirname + "/failure.html");
        }
        else if (response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html");
        }
        else {
            res.send("<h1>There was a problem. Please contact your administrator.</h1>");
        }
        console.log(response.statusCode);
    });
});

app.post("/failure", function(req, res) {
    res.redirect("/");
});

// listen on Heroku defined PORT
app.listen(process.env.PORT || 3000, function() {
    console.log("Server listening on port 3000.");
});