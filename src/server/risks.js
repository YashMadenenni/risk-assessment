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
        { _id: "test@gmail.com", userEmail: "test@gmail.com", userName: "Test", password: "test@123" },
        { _id: "testNew@gmail.com", userEmail: "testNew@gmail.com", userName: "testNew", password: "testNew@123" },
        // { _id: "yash@gmail.com", userEmail: "yash@gmail.com", userName: "Yash", password: "yash@123" }
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
        collecttionRisks = client.db().collection("login");
        console.log("Login: Connected to Database Login");
    })
    .catch(err => {
        console.log(`Error in connecting to Database Login ${url.replace(/:([^:@]{1,})@/, ':****@')}`, err);
    })
    .then(() => insertStarterDataRisks()) //invoke insert data for loading initial data

 //Endpoint to return all risks
 router.get("/",function (request,response) {
    collecttionRisks.find().toArray()
    .then(doc=>
        {
            try {
                if(doc.length()>0){
                    response.send(doc)
                }
            } catch (error) {
                console.log(error);
                response.send("error retriving documents");
            }
        }
        )
 })