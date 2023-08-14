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
let collectionLoginAdmin = null;

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

//Insert some data for testing  
const insertOneStarterDataLoginAdmin = async function () {
    return collectionLoginAdmin.insertMany([
        { _id: "testadmin@gmail.com", userEmail: "testadmin@gmail.com", userName: "Test", password: "test@123" },
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
        collectionLoginAdmin = client.db().collection("loginAdmin");
        console.log("Login: Connected to Database Login");
    })
    .catch(err => {
        console.log(`Error in connecting to Database Login ${url.replace(/:([^:@]{1,})@/, ':****@')}`, err);
    })
    .then(() => insertOneStarterDataLogin()) //invoke insert data for loading initial data
    .then(() => insertOneStarterDataLoginAdmin()) //add admin data 


//Login END points

//Endpoint to login in with email and password

router.post('/login', function (request, response) {
    const userEmail = (request.body.userEmail).toLowerCase();
    const password = request.body.password;
    const isAdmin = request.body.isAdmin;
    console.log("password");
    console.log(password);
    

    if (isAdmin) {
        collectionLoginAdmin.find({ _id: userEmail ,  password: password }).toArray()
            .then(doc => {
                console.log(doc)
                if (doc.length > 0) {

                    // Set session data
                    request.session.loggedIn = true;
                    request.session.userEmail = userEmail;
                    request.session.isAdmin = true;
                    request.session.userName = doc[0].userName;

                    console.log('userEmail after setting session:', request.session.userEmail);
                    console.log(request.session);

                    
                        response.redirect('/home.html');
                  
                } else {
                    response.status(401).json({ message: `Unauthorised` })
                }


            })
            .catch(err => {
                console.log(err);

            });
    } else {
        collectionLogin.find({ _id: userEmail , password: password }).toArray()
            .then(doc => {
                console.log("doc");
    console.log(doc);
                if (doc.length > 0) {

                    // Set session data
                    request.session.loggedIn = true;
                    request.session.userEmail = userEmail;
                    request.session.isAdmin = false;
                    request.session.userName = doc[0].userName;

                    console.log('userEmail after setting session:', request.session.userEmail);
                    console.log(request.session);

                    
                        response.redirect('/home.html');
                    
                } else {
                    response.status(401).json({ message: `Unauthorised` })
                }

            })
            .catch(err => {
                console.log(err);

            });
    }

})

//Endpoint to register

router.post("/register", function (request, response) {
    const userEmail = (request.body.userEmail).toLowerCase();
    const userName = (request.body.userName).toLowerCase();
    const password = request.body.password;
    //console.log(userEmail)

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

//Endpoint to reset password
router.post("/reset", function (request, response) {
    const userEmail = (request.body.userEmail).toLowerCase();
    const password = request.body.password;
    // console.log("userEmail")
    // console.log(userEmail)
    collectionLogin.find({ _id: userEmail }).toArray()
        .then(doc => {
            //console.log(doc);
            if (doc.length != 0) {
                collectionLogin.updateOne({ _id: userEmail},{$set:{ password: password }}).then(res=>{
                    response.status(200).json({ message: "Success Login Now" })
                }).catch(err=>{
                    response.status(404).json({ message: "Error Updating Try Again" })
                })
                
            } else {
                response.status(404).json({ message: "User with this email doesn't exsists" })
            }
        }).catch(err => {
            console.log(err);
            response.status(404).json({ message: `Error finding data` })
        });
})

//Endpoint to get user details
router.get('/email', (req, res) => {
    const userEmail = req.session.userEmail;
    const isAdmin = req.session.isAdmin;
    const userName = req.session.userName;
    // console.log(req.session);
    // console.log(userEmail);
    res.json({ userEmail :userEmail, isAdmin:isAdmin ,userName:userName});
});

module.exports = router;