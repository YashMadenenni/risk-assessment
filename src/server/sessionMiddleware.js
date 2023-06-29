const session = require("express-session");

const sessionMiddleware = session({
    secret:'risk-managment', //secret-key
    resave: false,
    saveUninitialized: true,
    cookie:{secure:true},
});

module.exports = sessionMiddleware;