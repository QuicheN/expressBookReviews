const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.get("/users", (req, res) => {
  res.send(JSON.stringify(users, null, 4));
});

public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (!username || !password) {
    return res.status(400).json({message: "Username and password are required"});
  }
  if (!isValid(username)) {
    users.push({"username":username,"password":password});
    return res.status(200).json({message: "User successfully registered. Now you can login"});
  } else {
    return res.status(400).json({message: "User already exists!"});
  }
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  new Promise((resolve, reject) => {
    resolve(books);
  })
    .then((bookList) => {
      res.send(JSON.stringify(bookList, null, 4));
    })
    .catch((err) => {
      res.status(500).json({ message: "Error retrieving books" });
    });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  new Promise((resolve, reject) => {
    const isbn = req.params.isbn;
    const book = books[isbn];
    if (book) {
      resolve(book);
    } else {
      reject(new Error("Book not found"));
    }
  })
    .then((book) => {
      res.send(JSON.stringify(book, null, 4));
    })
    .catch((err) => {
      res.status(404).json({ message: "Book not found" });
    });
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  new Promise((resolve, reject) => {
    const author = req.params.author;
    // console.log("Author:", author);
    // debugArray = Object.values(books).map((book) => book.author.replace(/\s/g, "").toLowerCase());
    // console.log("Debug Array:", debugArray);
    const matches = Object.values(books).filter((book) => book.author.replace(/\s/g, "").toLowerCase() === author);
    if (matches.length > 0) {
      resolve(matches);
    } else {
      reject(new Error("No books found for that author"));
    }
  })
    .then((matches) => {
      res.send(JSON.stringify(matches, null, 4));
    })
    .catch((err) => {
      res.status(404).json({ message: "No books found for that author" });
    });
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  new Promise((resolve, reject) => {
    const title = req.params.title;
    const matches = Object.values(books).filter((book) => book.title.replace(/\s/g, "").toLowerCase() === title);
    if (matches.length > 0) {
      resolve(matches);
    } else {
      reject(new Error("No books found with that title"));
    }
  })
    .then((matches) => {
      res.send(JSON.stringify(matches, null, 4));
    })
    .catch((err) => {
      res.status(404).json({ message: "No books found with that title" });
    });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
    res.send(JSON.stringify(book.reviews, null, 4));
  } else {
    res.status(404).json({message: "Book not found"});
  }
});

module.exports.general = public_users;
