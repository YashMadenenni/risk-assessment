const MongoClient = require('mongodb').MongoClient;
const express = require('express');
const path = require('path');
const router = express.Router();
router.use(express.urlencoded({ extended: true }));
router.use(express.json());
router.use(express.static(path.join(__dirname, '../client')));

// //MongoDB set up ans start server
// //build url for client
const url = `mongodb+srv://yashwanthkumarms11:WBQsOI0CMrzpUbQl@cluster0.zf3rn5p.mongodb.net/`;
const client = new MongoClient(url, { useUnifiedTopology: true });
let collecttionForms = null; // initially null
let collecttionFormsSave = null; //collection for forms

//connect to database
client.connect()
    .then(connection => {
        collecttionForms = client.db().collection("forms");
        collecttionFormsSave = client.db().collection("formsSaved");
        console.log("Forms: Connected to Database Forms");
    })
    .catch(err => {
        console.log(`Error in connecting to Database Forms ${url.replace(/:([^:@]{1,})@/, ':****@')}`, err);
    });



router.post("/submit", function (request, response) {
    var userEmail = request.body.userEmail;
    var activity = request.body.activityName;
    var date = request.body.date;
    var description = request.body.description;
    var risks = request.body.risks;
    var approval = false;

    collecttionForms.find({ _id: userEmail }).toArray()
        .then(doc => {
            if (doc.length == 0) {
                collecttionForms.insertOne({ _id: userEmail, activity: [{ activityName: activity, date: date, description: description, risks: risks ,approval:approval}] });
                response.status(200).json({ message: "Success" });

            } else {
                // var newActivity = doc[0].activity;
                // newActivity = 
                // //     .then(doc => {})
                collecttionForms.updateOne({ _id: userEmail }, { $push: { activity: { activityName: activity, date: date, description: description, risks: risks } } }, function (err) {
                    if (err) {
                        response.status(400).json({ message: "Error adding new activity" });
                        console.error("Error adding new activity:", err);
                    } else {
                        response.status(200).json({ message: "Success" });
                        console.log("New activity added successfully");
                    }
                })
            }
        })
});

router.post("/save", function (request, response) {
    var userEmail = request.body.userEmail;
    var activity = request.body.activity;
    var date = request.body.date;
    var description = request.body.description;
    var risks = request.body.risks;

    collecttionFormsSave.find({ _id: userEmail }).toArray()
        .then(doc => {
            if (doc.length == 0) {
                collecttionFormsSave.insertOne({ _id: userEmail, activity: [{ activityName: activity, date: date, description: description, risks: risks }] });
                response.status(200).json({ message: "Success" });

            } else {
                // var newActivity = doc[0].activity;
                // newActivity = 
                // //     .then(doc => {})
                collecttionFormsSave.updateOne({ _id: userEmail }, { $push: { activity: { activityName: activity, date: date, description: description, risks: risks } } }, function (err) {
                    if (err) {
                        response.status(400).json({ message: "Error adding new activity" });
                        console.error("Error adding new activity:", err);
                    } else {
                        response.status(200).json({ message: "Success" });
                        console.log("New activity added successfully");
                    }
                })
            }
        })
});


router.get('/saved/:user',function (request,response) {
     console.log("here");
    var userEmail = request.params.user;
    console.log(userEmail)
    collecttionFormsSave.find({_id:userEmail}).toArray()
    .then(doc=>{
        console.log(doc)
        response.status(200).json({"saved":doc});
    }).catch(err=>{ response.status(404).json({ message: "Error finding favourites" }); });

})

router.get('/submitted/:user',function (request,response) {
    
   var userEmail = request.params.user;
   
   collecttionForms.find({_id:userEmail}).toArray()
   .then(doc=>{
       console.log(doc)
       response.status(200).json({"saved":doc});
   }).catch(err=>{ response.status(404).json({ message: "Error finding favourites" }); });

})


module.exports = router;