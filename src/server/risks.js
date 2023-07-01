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
let collecttionRisks = null; // initially null

//Insert some data for testing  
const insertStarterDataRisks = async function () {
    return collecttionRisks.insertMany([
        {
           _id:1, riskname: "Position of oven",risks:["Sited in traffic routes being knocked over "],probability:"1",severity:"1",riskLevel:"1",precautions:["oven is sited in an area free of vehicle and pedestrian traffic with access limited to staff that operate the equipment. ","A suitable barrier is positioned around the oven to keep children and visitors etc away from hot surfaces","A sheltered position is used to help eliminate wind and other natural elements from blowing across the oven causing food to spill and smoke/embers from blowing into people. ","Only designated people fuel used to light the oven following manufacturer’s instructions on the packaging. "]
          },{
           _id:2,riskname: "Firefighting equipment ",risks:["No provision to fight fire "],probability:"1",severity:"3",riskLevel:"1",precautions:[]
          }
    ])
        .then(res => console.log("data inserted with ID", res.insertedIds))
        .catch(err => {
            console.log("Could not add data ", err.message);
            //For now, ingore duplicate entry errors, otherwise re-throw the error for the next catch
            if (err.name != 'MongoBulkWriteError' || err.code != 11000) throw err;
        })
}

//connect to database
client.connect()
    .then(connection => {
        collecttionRisks = client.db().collection("risks");
        console.log("Risks: Connected to Database Risks");
    })
    .catch(err => {
        console.log(`Error in connecting to Database Risks ${url.replace(/:([^:@]{1,})@/, ':****@')}`, err);
    })
    .then(() => insertStarterDataRisks()) //invoke insert data for loading initial data

 //Endpoint to return all risks
 router.get("/all",function (request,response) {
    collecttionRisks.find().toArray()
    .then(doc=>
        {
            try {
                if(doc.length>0){
                    response.send(doc);
                }else{
                    response.send("No documents");
                }
            } catch (error) {
                console.log(error);
                response.send("error retriving documents");
            }
        }
        )
 })

 module.exports = router;