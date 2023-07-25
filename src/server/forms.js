const MongoClient = require('mongodb').MongoClient;
const express = require('express');
const path = require('path');
const router = express.Router();
router.use(express.urlencoded({ extended: true }));
router.use(express.json());
router.use(express.static(path.join(__dirname, '../client')));
const crypto = require("crypto");

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
    }).then();

//to store randomly generated id
var idCollectionSubmit = [];
router.post("/submit", function (request, response) {
    var userEmail = request.session.userEmail;
    var activity = request.body.activity;
    var date = request.body.date;
    var description = request.body.description;
    var risks = request.body.risks;
    var approval = false;
    // generate Random id
    var n = 0;
    do {
        n = crypto.randomInt(0, 100000);
    } while (idCollectionSubmit.includes(n));

    collecttionForms.find({ _id: userEmail }).toArray()
        .then(doc => {
            if (doc.length == 0) {
                //if no forms submitted 
                collecttionForms.insertOne({ _id: userEmail, activity: [{ activityName: activity, date: date, description: description, risks: risks, approval: approval, id: n }] })
                    .then(res => {
                        response.status(200).json({ message: "Success" });
                    }).catch(err => {
                        response.status(400).json({ message: "Error submittting new activity" });
                    })




            } else {
                // var newActivity = doc[0].activity;
                // newActivity = 
                // //     .then(doc => {})
                collecttionForms.updateOne({ _id: userEmail }, { $push: { activity: { activityName: activity, date: date, description: description, risks: risks, approval: approval, id: n } } })
                    .then(res => {
                        response.status(200).json({ message: "Success" });
                        console.log("New activity submitted successfully");

                    }).catch((res) => {

                        response.status(400).json({ message: "Error submittting new activity" });
                        console.error("Error submitting activity:", err);
                    })
            }
        })

    collecttionFormsSave.find({ _id: userEmail, "activity.activityName": activity }).toArray()
        .then(doc => {
            console.log("in delete saved")
            console.log(doc);
            if (doc.length) {
                collecttionFormsSave.updateOne({ "_id": userEmail }, { $pull: { "activity": { "activityName": activity } } }).then(console.log("deleted"))
            }
        })
});

//to store randomly generated id
var idCollection = [];

router.post("/save", function (request, response) {
    var userEmail = request.session.userEmail;
    var activity = request.body.activity;
    var formRandomID = request.body.formID;
    var date = request.body.date;
    var description = request.body.description;
    var risks = request.body.risks;

    console.log(formRandomID);
    console.log(userEmail);

    collecttionFormsSave.find({ _id: userEmail }).toArray()
        .then(doc => {
            if (doc.length == 0) {

                // generate Random id
                var n = 0;
                do {
                    n = crypto.randomInt(0, 100000);
                } while (idCollection.includes(n));

                collecttionFormsSave.insertOne({ _id: userEmail, activity: [{ activityName: activity, date: date, description: description, risks: risks, id: n }] })
                    .then(res => {
                        response.status(200).json({ message: "Success" });
                    }).catch(err => {
                        console.error("Catch :", err);
                        response.status(400).json({ message: "Error adding new activity" })
                    })


            } else {

                console.log("in 1")
                //if user has saved documents then check if this document is already there to edit it
                collecttionFormsSave.find({ _id: userEmail, "activity.id": formRandomID }).toArray()

                    .then(doc => {
                        // console.log("in 2")
                        if (doc.length == 0) {
                            console.log("in 3")
                            console.log(doc)
                            //if activity is not there

                            // generate Random id
                            var n = 0;
                            do {
                                n = crypto.randomInt(0, 100000);
                            } while (idCollection.includes(n));
                            idCollection.push(n);
                            console.log(n);

                            collecttionFormsSave.updateOne({ _id: userEmail }, { $push: { activity: { activityName: activity, date: date, description: description, risks: risks, id: n } } })
                                .then(res => {
                                    response.status(200).json({ message: "Success" });
                                    console.log("New activity added successfully")
                                })
                                .catch(error => {
                                    console.error("Catch :", error);
                                    response.status(400).json({ message: "Error adding new activity" })
                                });
                        } else {

                            //if activity already exsists
                            console.log("here in object")

                            collecttionFormsSave.updateOne({ _id: userEmail, "activity.id": formRandomID }, {
                                $set: {
                                    "activity.$.activityName": activity, "activity.$.date": date,
                                    "activity.$.description": description,
                                    "activity.$.risks": risks
                                }
                            })
                                .then(res => {

                                    response.status(200).json({ message: "Success" });
                                    console.log("Editing saved successfully");

                                }).catch(error => { console.error("Catch :", error); response.status(400).json({ message: "Error editing saved activity" }) });
                        }
                    }).catch(error => { console.error("Catch :", error); response.status(400).json({ message: "Error editing saved activity" }) });


            }
        }).catch(error => { console.error("Catch :", error); response.status(400).json({ message: "Error editing saved activity" }) });
});


router.get('/saved', function (request, response) {
    // console.log("here");
    var userEmail = request.session.userEmail;
    console.log(userEmail)
    collecttionFormsSave.find({ _id: userEmail }).toArray()
        .then(doc => {
            console.log(doc)
            response.status(200).json({ "saved": doc });
        }).catch(err => { response.status(404).json({ message: "Error finding favourites" }); });

})

router.get('/submitted', function (request, response) {

    var userEmail = request.session.userEmail;
    var isAdmin = request.session.isAdmin;

    if (isAdmin) {
        console.log(isAdmin)
        collecttionForms.find({}).toArray()
            .then(doc => {
                console.log(doc)
                response.status(200).json({ "submitted": doc });
            }).catch(err => { response.status(404).json({ message: "Error finding favourites" }); });

    } else {

        collecttionForms.find({ _id: userEmail }).toArray()
            .then(doc => {
                console.log(doc)
                response.status(200).json({ "submitted": doc });
            }).catch(err => { response.status(404).json({ message: "Error finding favourites" }); });
    }


})

router.post('/approve', function (request, response) {
    var formID = parseInt(request.body.formID);
    var userEmail = request.body.userEmail;
    //console.log("here")
    console.log(formID)
    console.log(userEmail)
    collecttionForms.find({ _id: userEmail, "activity.id": formID }).toArray()
        .then(doc => {
            if (doc.length == 0) {
                console.log("error")
            } else {
                collecttionForms.updateOne({ _id: userEmail, "activity.id": formID }, { $set: { "activity.$.approval": "true" } })
                    .then(response.status(200).json({ "message": "Successful" }))
                    .catch(err => { response.status(400).json({ message: "Error Approving" }); console.log(err) })
            }
        })
});

router.get('/template/:formID/:userEmail',function (request,response) {
    var formID = encodeURIComponent(request.params.formID);
    var userEmail = encodeURIComponent(request.params.userEmail);

    if(formID!=undefined && userEmail!=undefined){
        response.redirect(`/home.html?userEmail=${userEmail}&formID=${formID}`)
    }else{
        response.sendStatus(404);
    }
});

//Endpoint to sent selected submitted template
router.get('/:userEmail/:formID',function (request,response) {
    var formID = parseInt(request.params.formID);
    var userEmail = request.params.userEmail;

    console.log(formID, userEmail)
    collecttionForms.find({_id:userEmail,"activity.id":formID}).toArray()
    .then(doc=>{
        if(doc.length == 0){
            response.status(404).json({message:"Document Not Found"});
        }else{
            response.status(200).json({activity:doc});
        }
    })
})


module.exports = router;