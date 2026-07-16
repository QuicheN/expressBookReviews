const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  
  res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
    res.send(JSON.stringify(book, null, 4));
  } else {
    res.status(404).json({message: "Book not found"});
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
 // console.log("Author:", author);
  // debugArray = Object.values(books).map((book) => book.author.replace(/\s/g, "").toLowerCase());
  // console.log("Debug Array:", debugArray);
  const matches = Object.values(books).filter((book) => book.author.replace(/\s/g, "").toLowerCase() === author);
  if (matches.length > 0) {
    res.send(JSON.stringify(matches, null, 4));
  } else {
    res.status(404).json({message: "No books found for that author"});
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  const matches = Object.values(books).filter((book) => book.title.replace(/\s/g, "").toLowerCase() === title);
  if (matches.length > 0) {
    res.send(JSON.stringify(matches, null, 4));
  } else {
    res.status(404).json({message: "No books found with that title"});
  }
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
