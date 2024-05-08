const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Register users
public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});    
    }
  } 
  return res.status(404).json({message: "Unable to register user because username or password is missing."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.send(JSON.stringify({books},null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  return res.send(books[isbn]);
 });

// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;  
  let filtered_books = [];
  let isbns = Object.keys(books);
  
  isbns.forEach(isbn => {
    if (books[isbn].author === author) {
      filtered_books.push(books[isbn]);
    }      
  });
  if (filtered_books.length > 0) {
    return res.send(JSON.stringify({filtered_books},null,4));
  }
  else {
    return res.send("There are no books from author " + (' ')+ (req.params.author) + " in the database!");
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;  
  let filtered_books = [];
  let isbns = Object.keys(books);
  
  isbns.forEach(isbn => {
    if (books[isbn].title === title) {
      filtered_books.push(books[isbn]);
    }      
  });
  if (filtered_books.length > 0) {
    return res.send(JSON.stringify({filtered_books},null,4));
  }
  else {
    return res.send("There are no books titled " + (' ')+ (req.params.title) + " in the database!");
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;  
  if (books[isbn]) {
    return res.send(books[isbn]["reviews"]);
  }      
  else {
    return res.send("The book with ISBN " + (' ')+ (req.params.isbn) + " is not in the database!");
  } 

});

module.exports.general = public_users;
