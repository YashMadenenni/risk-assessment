const MongoClient = require('mongodb').MongoClient;
const express = require('express');
const path = require('path');
const router = express.Router();
const cookieParser = require('cookie-parser');

const multer = require('multer');
const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB
    },
  });
//const upload = multer({ storage: multer.memoryStorage() });

router.use(express.urlencoded({ extended: true }));
router.use(express.json());
router.use(express.static(path.join(__dirname, '../client')));

router.use(cookieParser());

const url = `mongodb+srv://yashwanthkumarms11:WBQsOI0CMrzpUbQl@cluster0.zf3rn5p.mongodb.net/`;
const client = new MongoClient(url, { useUnifiedTopology: true });
let collectionIncident = null;

//connect to database
client.connect()
    .then(connection => {
        collectionIncident = client.db().collection("incident");
        
        console.log("Incident: Connected to Database Incident");
    })
    .catch(err => {
        console.log(`Error in connecting to Database Incident ${url.replace(/:([^:@]{1,})@/, ':****@')}`, err);
    });


    
    // Handle the incident form submission
    router.post('/report', upload.single('incidentImage'), async (request, response) => {
    try {
      const { incident,activity, incidentDate, incidentDescription } = request.body;  
      //console.log(request.file.buffer)
      // Create a new incident document
      const newIncident = {
        incident,
        activity,
        incidentDate,
        incidentDescription,
        incidentImage: {
          data: request.file.buffer,
          contentType: request.file.mimetype,
        },
      };
  
      // Save the incident document to the "collectionIncident" collection
      await collectionIncident.insertOne(newIncident);
  
      response.status(200).send('Incident report submitted successfully!');
    } catch (error) {
      console.error('Error submitting incident report:', error);
      response.status(500).send('An error occurred while submitting the incident report.');
    }
  });

  router.get('/report',function (request,respone) {
    collectionIncident.find({}).toArray()
    .then(doc=>{
        respone.status(200).json(doc);
    }).catch(error=>{
        console.log(error);
        respone.status(500).json("Error");
    })

  });

  
    module.exports = router;


