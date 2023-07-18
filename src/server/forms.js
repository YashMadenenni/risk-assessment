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
    var userEmail = request.session.userEmail;
    var activity = request.body.activity;
    var date = request.body.date;
    var description = request.body.description;
    var risks = request.body.risks;
    var approval = false;

    collecttionForms.find({ _id: userEmail }).toArray()
        .then(doc => {
            if (doc.length == 0) {
                //if no forms submitted 
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
    var userEmail = request.session.userEmail;
    var activity = request.body.activity;
    var date = request.body.date;
    var description = request.body.description;
    var risks = request.body.risks;

    console.log(userEmail);

    collecttionFormsSave.find({ _id: userEmail }).toArray()
        .then(doc => {
            if (doc.length == 0) {

                collecttionFormsSave.insertOne({ _id: userEmail, activity: [{ activityName: activity, date: date, description: description, risks: risks }] });
                response.status(200).json({ message: "Success" });

            } else {
                // var newActivity = doc[0].activity;
                // newActivity = 
                // //     .then(doc => {})
                console.log("in 1")
                collecttionFormsSave.find({_id:userEmail,"activity.activityName":activity}).toArray()
                
                .then(doc=>{
                    console.log("in 2")
                    if (doc.length == 0) {
                        console.log("in 3")
                        console.log(doc)
                        //if activity is not there
                        collecttionFormsSave.updateOne({ _id: userEmail }, { $push: { activity: { activityName: activity, date: date, description: description, risks: risks } } }, function (err) {
                            if (err) {
                                response.status(400).json({ message: "Error adding new activity" });
                                console.error("Error adding new activity:", err);
                            } else {
                                response.status(200).json({ message: "Success" });
                                console.log("New activity added successfully");
                            }
                        })
                    }else{
                        console.log("here in object")
                        //if activity already exsists
                        collecttionFormsSave.updateOne({ _id: userEmail,"activity.activityName":activity }, { $set: { "activity.$.activityName": activity, "activity.$.date": date,
                        "activity.$.description": description,
                        "activity.$.risks": risks } }, function (err) {
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

                
            }
        })
});


router.get('/saved',function (request,response) {
     console.log("here");
    var userEmail = request.session.userEmail;
    console.log(userEmail)
    collecttionFormsSave.find({_id:userEmail}).toArray()
    .then(doc=>{
        console.log(doc)
        response.status(200).json({"saved":doc});
    }).catch(err=>{ response.status(404).json({ message: "Error finding favourites" }); });

})

router.get('/submitted',function (request,response) {
    
   var userEmail = request.session.userEmail;
   var isAdmin = request.session.isAdmin;

   if(isAdmin){
    console.log(isAdmin)
    collecttionForms.find({}).toArray()
    .then(doc=>{
        console.log(doc)
        response.status(200).json({"submitted":doc});
    }).catch(err=>{ response.status(404).json({ message: "Error finding favourites" }); });
 
   }else{
   
   collecttionForms.find({_id:userEmail}).toArray()
   .then(doc=>{
       console.log(doc)
       response.status(200).json({"submitted":doc});
   }).catch(err=>{ response.status(404).json({ message: "Error finding favourites" }); });
}
})

router.post('/approve/:formName',function (request,response) {
    var formName = request.params.formName;
    var userEmail = request.session.userEmail;
    console.log("error")
    collecttionForms.find({_id:userEmail,"activity.activityName":formName}).toArray()
    .then(doc=>{
        if(doc.length == 0){
            console.log("error")
        }else{
            collecttionForms.updateOne({_id:userEmail,"activity.activityName":formName},{$set:{"activity.$.approval":"true"}})
            .then( response.status(200).json({"message":"Successful"}))
            .catch(err=>{ response.status(400).json({ message: "Error Approving" });  console.log(err)})
        }
    })
})


module.exports = router;