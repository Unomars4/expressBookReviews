const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { //returns boolean
    //write code to check is the username is valid
    return users.filter(u => u.username === username).length === 0;
}

const authenticatedUser = (username, password) => { //returns boolean
    //write code to check if username and password match the one we have in records.
    console.log(users);
    return users.filter(u => u.username === username)[0].password === password;
}

//only registered users can login
regd_users.post("/login", (req, res) => {
    //Write your code here
    const {username, password} = req.body;

    if (!username || !password) {
        return res.status(401).json({message: "Username or password wasn't entered"});
    }

    if (!authenticatedUser(username, password)) {
        return res.status(400).json({message: "Invalid username or password"});
    }

    const token = jwt.sign({data: password}, "access", {expiresIn: 60 * 60});
    req.session.authorization = {token, username};

    return res.status(200).send("Customer successfully logged in");
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    //Write your code here
    const {isbn} = req.params;
    const {review} = req.query;
    const {username} = req.user;
    if (books[isbn]) {
        books[isbn].reviews[username] = review;
        return res.status(200).send(`The review for the book with ISBN ${isbn} has been added/updated.`);
    }
    return res.status(404).json({message: "Book couldn't be found to add review"});
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    //Write your code here
    const {isbn} = req.params;
    const {username} = req.user;

    if (books[isbn].reviews.hasOwnProperty(username)) {
        delete books[isbn].reviews[username];
        return res.status(201).send(`Review for the ISBN ${isbn} posted by the user ${username} deleted.`);
    }

    return res.status(401).json({message: "No review to delete"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
