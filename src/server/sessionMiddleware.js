const session = require("express-session");

const ONE_DAY = 24*60*60*1000;
const sessionMiddleware = session({
    secret:'risk-managment', //secret-key
    resave: false,
    saveUninitialized: true,
    cookie:{maxAge:ONE_DAY},
});

module.exports = sessionMiddleware;