const MongoClient = require('mongodb').MongoClient;
const express = require('express');
const path = require('path');
const router = express.Router();
const cookieParser = require('cookie-parser');

router.use(express.urlencoded({ extended: true }));
router.use(express.json());
router.use(express.static(path.join(__dirname, '../client')));


router.use(cookieParser());
// //MongoDB set up ans start server
// //build url for client
const url = `mongodb+srv://yashwanthkumarms11:WBQsOI0CMrzpUbQl@cluster0.zf3rn5p.mongodb.net/`;
const client = new MongoClient(url, { useUnifiedTopology: true });
let collectionLogin = null; // initially null

//Insert some data for testing  
const insertOneStarterDataLogin = async function () {
    return collectionLogin.insertMany([
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
        collectionLogin = client.db().collection("login");
        console.log("Login: Connected to Database Login");
    })
    .catch(err => {
        console.log(`Error in connecting to Database Login ${url.replace(/:([^:@]{1,})@/, ':****@')}`, err);
    })
    .then(() => insertOneStarterDataLogin()) //invoke insert data for loading initial data

 

//Login END points

//Endpoint to login in with email and password

router.post('/login', function (request, response) {
    const userEmail = (request.body.userEmail).toLowerCase();
    const password = request.body.password;

    collectionLogin.find({ _id: userEmail }, { password: password }).toArray()
        .then(doc => {
            if (doc.length > 0) {

                // Set session data
                request.session.loggedIn = true;
                request.session.userEmail = userEmail;

                // console.log('userEmail after setting session:', request.session.userEmail);
                // console.log(request.session);

                //response.sendFile('home.html',{root:path.join(__dirname,"../client")});
                // Redirect after session values are saved
                // request.session.save(() => {
                //     response.redirect('/home.html');
                // });
                  response.status(200).json({ message: `Login Successful` });
                //globalUser.userEmail = userEmail;//set the user email to global variable
            } else {
                response.status(401).json({ message: `Unauthorised` })
            }


        })
        .catch(err => {
            console.log(err);

        });

})

//Endpoint to register

router.post("/register", function (request, response) {
    const userEmail = (request.body.userEmail).toLowerCase();
    const userName = (request.body.userName).toLowerCase();
    const password = request.body.password;
    console.log(userEmail)

    collectionLogin.find({ _id: userEmail }).toArray()
        .then(doc => {
            console.log(doc);
            if (doc.length == 0) {
                collectionLogin.insertOne({ _id: userEmail, userEmail: userEmail, userName: userName, password: password });
                response.status(200).json({ message: "Success" })
            } else {
                response.status(402).json({ message: "User with this email exists" })
            }
        }).catch(err => {
            console.log(err);
            response.status(404).json({ message: `Error finding data` })
        });
})

router.get('/email', (req, res) => {
    const userEmail = req.session.userEmail;
    // console.log(req.session);
    // console.log(userEmail);
    res.json({ userEmail });
});

module.exports = router;