const express = require("express");
const MongoClient = require('mongodb').MongoClient;
const path = require("path");
const API_PORT = 8000;
const app = express();
const login = require('./Login');
const risks = require('./risks');
const sessionMiddleware = require('./sessionMiddleware');

app.use(sessionMiddleware);
//Change to express sessions
// const globalUser = {  
//     userEmail : ""
// }

//MongoDB set up ans start server
//build url for client 
const url = `mongodb+srv://yashwanthkumarms11:WBQsOI0CMrzpUbQl@cluster0.zf3rn5p.mongodb.net/`;
const client = new MongoClient(url, { useUnifiedTopology: true });
let collection = null; // initially null 
let collectionLogin = null;

app.use(express.static(path.join(__dirname, '../client'))); // using client files

//connect to database
client.connect()
    .then(
        connection => {
            //if collection is not present it is automatically created 
            collection = client.db().collection("RiskAssessment"); //comment this when createCollection() is uncommented
           // collectionLogin = client.db().collection("login");
            console.log("Server: Connected to Database");
        }
    )
    .catch(err => {
        console.log(`Error in connecting to Database ${url.replace(/:([^:@]{1,})@/, ':****@')}`, err);
    })
     // .then(() => client.db().collection(config.collection).drop()) //drop the collection if it exists
    //.then(() => createCollection()) // invoke createCollection if not created 
   // .then(() => insertOneStarterData()) //invoke insert data for loading initial data
    // .catch(err => { console.log("Giving up!", err.message); })
    // .finally(() => {
    //     client.close();
    //     console.log("Disconnected");
    // });
    .then(() => {
        app.listen(API_PORT);
        console.log("Server Started in port:" + API_PORT);
    })
    .catch(err => console.log(`Could not start server`, err))
//.finally(()=>{client.close(); console.log("Disconnected");})



app.use('/user', sessionMiddleware ,login);
app.use('/risks',risks);
