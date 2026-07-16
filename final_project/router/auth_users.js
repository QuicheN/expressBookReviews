const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
  return users.some((user) => user.username === username);
}

const authenticatedUser = (username,password)=>{ //returns boolean
  return users.some((user) => user.username === username && user.password === password);
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  if (!req.body.username || !req.body.password) {
    return res.status(400).json({message: "Username and password are required"});
  }
  const username = req.body.username;
  const password = req.body.password;
  if ((!isValid(username))){
    return res.status(400).json({message: "Invalid username"});
  }
  if (!authenticatedUser(username, password)) {
    return res.status(400).json({message: "Incorrect password"});
  }

  //save credentials in JWT token
  let accessToken = jwt.sign({data: password}, 'access', { expiresIn: 60 * 60 });
  console.log("Access Token:", accessToken);
  req.session.authorization = {
    accessToken,username
  }
  console.log("Session Authorization:", JSON.stringify(req.session.authorization, null, 4));

  return res.status(200).json({message: "Login successful"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.body.review;
  const username = req.body.username;
  
  if (!isbn || !review || !username) {
    return res.status(400).json({message: "ISBN, review, and username are required"});
  }
  else if (!books[isbn]) {
    return res.status(404).json({message: "Book not found"});
  }
  else if (req.session.authorization.username !== username) {
    return res.status(403).json({message: "You are not authorized to add a review for this user"});
  }
  else {
    books[isbn].reviews[username] = review;
    return res.status(200).json({message: "Review added/updated successfully"});
  }
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization.username;

  if (!books[isbn]) {
    return res.status(404).json({message: "Book not found"});
  }
  else if (!books[isbn].reviews[username]) {
    return res.status(404).json({message: "No review by this user for this book"});
  }
  else {
    delete books[isbn].reviews[username];
    return res.status(200).json({message: "Review deleted successfully"});
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
