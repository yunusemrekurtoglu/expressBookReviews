const express = require('express');
const axios = require('axios').default;
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const connectToURL = (url)=>{
  const req = axios.get(url);
  console.log(req);
  req.then(resp => {
      console.log("Fulfilled")
      console.log(resp.data);
  })
  .catch(err => {
      console.log("Rejected for url "+url)
      console.log(err.toString())
  }); 
}

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
  const methCall = new Promise((resolve,reject)=>{
    try {
      const response = JSON.stringify({books},null,4); 
      resolve(response);
    } catch(err) {
      reject(err)
      }
  });
  methCall.then(
    (response) => res.send(response),
    (err) => console.log("Error accessing database") 
  );  
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const methCall = new Promise((resolve,reject)=>{
    try {
      const response = books[isbn]; 
      resolve(response);
    } catch(err) {
      reject(err)
      }
  });
  methCall.then(
    (response) => res.send(response),
    (err) => console.log("Error accessing that book or the database") 
  );  
 });

// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;  
  let filtered_books = [];
  const methCall = new Promise((resolve,reject)=>{
    try {
      let isbns = Object.keys(books);
      isbns.forEach(isbn => {
        if (books[isbn].author === author) {
          filtered_books.push(books[isbn]);
        }      
      });
      const response = JSON.stringify({filtered_books},null,4);
      resolve(response);
    } catch(err) {
      reject(err)
      }
  });
  methCall.then(
    (response) => res.send(response),
    (err) => console.log("Error accessing that author or the database") 
  );  
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;  
  let filtered_books = [];
  const methCall = new Promise((resolve,reject)=>{
    try {
      let isbns = Object.keys(books);
      isbns.forEach(isbn => {
        if (books[isbn].title === title) {
          filtered_books.push(books[isbn]);
        }      
      });
      const response = JSON.stringify({filtered_books},null,4);
      resolve(response);
    } catch(err) {
      reject(err)
      }
  });
  methCall.then(
    (response) => res.send(response),
    (err) => console.log("Error accessing that author or the database") 
  );  
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
