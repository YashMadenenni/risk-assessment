const express = require("express");
const MongoClient = require('mongodb').MongoClient;
const path = require("path");
const API_PORT = 8000; // 
const app = express();
const login = require('./login');
const risks = require('./risks');
const forms = require('./forms');
const incidentReport = require('./incident');
const cookieParser = require('cookie-parser');
const sessionMiddleware = require('./sessionMiddleware');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(sessionMiddleware);
 app.use(cookieParser());
//Change to express sessions
 
//MongoDB set up ans start server
//build url for client 
const url = `mongodb+srv://yashwanthkumarms11:WBQsOI0CMrzpUbQl@cluster0.zf3rn5p.mongodb.net/`;
 //const url = `mongodb://${username}:${password}@${clusterHost}`;
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
            console.log("Server: Connected to Database");
        }
    )
    .catch(err => {
        console.log(`Error in connecting to Database ${url.replace(/:([^:@]{1,})@/, ':****@')}`, err);
    })
    .then(() => {
        app.listen(API_PORT);
        console.log("Server Started in port:" + API_PORT);
    })
    .catch(err => console.log(`Could not start server`, err))
//.finally(()=>{client.close(); console.log("Disconnected");})






app.use('/user' ,login);
app.use('/risks',risks);
app.use('/forms',forms);
app.use('/incident',incidentReport)
