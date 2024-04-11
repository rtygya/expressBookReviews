const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
    //Check if the username is valid
    let userswithsamename = users.filter((user)=>{
        return user.username === username
    });
    if(userswithsamename.length > 0){
        return true;
    } else {
        return false;
    }
}

const authenticatedUser = (username,password)=>{ //returns boolean
    //Check if username and password match the one we have in records.
    let validusers = users.filter((user)=>{
        return (user.username === username && user.password === password)
    });
    
    if(validusers.length > 0){
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (!username || !password) {
        return res.status(404).json({message: "Error logging in"});
    }
    if (authenticatedUser(username,password)) {
      let accessToken = jwt.sign({
        data: password
      }, 'access', { expiresIn: 60 * 60 });
      req.session.authorization = {
        accessToken,username
    }
    return res.status(200).send("User successfully logged in");
    } else {
      return res.status(208).json({message: "Invalid Login. Check username and password"});
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
  const review = req.body.review;
  const username = req.session.username;

  let booksList = Object.values(books)
  const book = booksList.find(b => b.isbn == isbn)
  // If the ISBN doesn't exist in the books object, send an error message
  if (!book) {
    res.status(404).send('The book with ISBN ' + isbn + ' does not exist.');
    return;
  }

  // If the user already posted a review for this book, modify the existing review
  if (book.reviews[username]) {
    book.reviews[username] = review;
    res.json(`Your review has been updated for the book ${book.title} by ${book.author} with ISBN ${isbn}: ==>${JSON.stringify(book)}`);

    return;
  }

  // If the user didn't post a review for this book, add a new review
  book.reviews[username] = review;
  res.json(`Your review has been posted for the book ${book.title} by ${book.author} with ISBN ${isbn}: ==>${JSON.stringify(book)}`);

});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const username = req.session.username;
    const isbn = req.params.isbn;
    
    let booksList = Object.values(books)
    const book = booksList.find(b => b.isbn == isbn)
    
    if (!book) {
      res.status(404).send(`The book with ISBN  ${isbn}  does not exist.`);
      return;
    }
    
    if (!book.reviews[username]) {
      res.status(404).send(`You have not posted any review for the book with ISBN  ${isbn}: ==>${JSON.stringify(book)}`);
      return;
    }
    
    delete book.reviews[username];
    res.send(`Your review has been deleted for the book with ${isbn} isbn: ==>${JSON.stringify(book)}`);
  });
  

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
