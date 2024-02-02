const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const getAllBooks = () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(books);
        }, 500)
    })
}

const getBookByIsbn = (isbn) => {
    return new Promise((res, rej) => {
        if (books.hasOwnProperty(isbn)) {
            res(books[isbn])
        } else {
            rej("Book couldn't be found");
        }
    })
}

const getBookByTitle = (title) => {
    return new Promise((res, rej) => {
        const booksbytitle = [];
        Object.keys(books).forEach((k) => {
            if (books[k].title === title) {
                booksbytitle.push({isbn: k, author: books[k].author, reviews: books[k].reviews});
            }
        });

        if (booksbytitle.length > 0) {
            res(booksbytitle);
        } else {
            rej("Books couldn't be found by that title");
        }
    });
}

const getBookByAuthor = (author) => {
    return new Promise((res, rej) => {
        const booksbyauthor = [];
        Object.keys(books).forEach((k) => {
            if (books[k].author === author) {
                booksbyauthor.push({isbn: k, title: books[k].title, reviews: books[k].reviews});
            }
        });

        if (booksbyauthor.length > 0) {
            res(booksbyauthor);
        } else {
            rej("Books by that author couldn't be found.");
        }
    });
}



public_users.post("/register", (req, res) => {
    //Write your code here
    const {username, password} = req.body;

    if (!username || !password) {
        return res.status(401).json({message: "Username or password not provided"});
    }

    if (!isValid(username)) {
        return res.status(400).json({message: "Username already taken"});
    }

    users.push({username, password});

    return res.status(200).json({message: "Customer successfully registered, Now you can login."});
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
    //Write your code here
    const books = await getAllBooks();
    return res.status(200).json({books});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    //Write your code here
    const {isbn} = req.params;
    getBookByIsbn(isbn)
        .then(result => {
            res.status(300).json(result)
        }, error => {
            res.status(404).json({message: error})
        })
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    //Write your code here
    const {author} = req.params;
    getBookByAuthor(author)
        .then(booksbyauthor => {
            res.status(200).json({booksbyauthor})
        }, error => {
            res.status(404).json({message: error})
        })
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    //Write your code here
    const {title} = req.params;
    getBookByTitle(title)
        .then(booksbytitle => {
            res.status(200).json({booksbytitle})
        }, error => {
            res.status(404).json({message: error})
        });
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    //Write your code here
    const {isbn} = req.params;
    const reviewsforbook = books[isbn].reviews;
    return res.status(200).json(reviewsforbook);
});

module.exports.general = public_users;
