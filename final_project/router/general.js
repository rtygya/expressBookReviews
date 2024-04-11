const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username)=>{
    let userswithsamename = users.filter((user)=>{
      return user.username === username
    });
    if(userswithsamename.length > 0){
      return true;
    } else {
      return false;
    }
  }
  
public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (username && password) {
      if (!doesExist(username)) {
        users.push({"username":username,"password":password});
        return res.status(200).json({message: "User successfully registered. Now you can login"});
      } else {
        return res.status(404).json({message: "User already exists!"});
      }
    }
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    res.send(JSON.stringify(books,null,2));

    /*    
    let bookList = new Promise((resolve,reject) => {
        if (books) {
            resolve(books)
        } else {
            reject({error: 'No Book Library was found'})
        }
    });

    bookList.then((successMessage) => {
        res.send(successMessage);
      })
    */ 
        
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    let isbn = req.params.isbn;
    let booksList=Object.values(books)
    let book = booksList.find(b => b.isbn===isbn);
   
    if (book) {
       let bookDetails = JSON.stringify(book);
       res.send(`Book details for ISBN ${isbn}: ${bookDetails}`);
     } else {
       res.send(`No book found with ISBN ${isbn}`);
     }

     /*    
    let bookByISBN = new Promise((resolve,reject) => {
        if (books[isbn]) {
            resolve(books)
        } else {
            reject({error: 'No Book found for this ISBN'})
        }
    });

    bookByISBN.then((successMessage) => {
        res.send(successMessage);
      })
    */ 
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    let author = req.params.author;
    let booksList=Object.values(books)
    let book = booksList.find(b => b.author===author);
   
      if (book) {
       let bookDetails = JSON.stringify(book);
       res.send(`Book details for author ${author}: ${bookDetails}`);
     } else {
       res.send(`No book found for author ${author}`);
     }

     /*    
    let bookByAuthor = new Promise((resolve,reject) => {
        if (books[author]) {
            resolve(books)
        } else {
            reject({error: 'No Book found for this author'})
        }
    });

    bookByAuthor.then((successMessage) => {
        res.send(successMessage);
      })
    */ 
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    let title = req.params.title;
    let booksList=Object.values(books)
    let book = booksList.find(b => b.title===title);
   
      if (book) {
       let bookDetails = JSON.stringify(book);
       res.send(`Book details for title ${title}: ${bookDetails}`);
     } else {
       res.send(`No book found with title ${title}`);
    }

     /*    
    let bookByTitle = new Promise((resolve,reject) => {
        if (books[title]) {
            resolve(books)
        } else {
            reject({error: 'No Book found with this title'})
        }
    });

    bookByTitle.then((successMessage) => {
        res.send(successMessage);
      })
    */ 
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    let booksList=Object.values(books)
    let book = booksList.find(b => b.isbn===isbn);
      if (book) {
      const reviews = book.reviews;
      res.send(reviews);
    } else {
        res.send(`No review found for ISBN ${isbn}`);}
});

module.exports.general = public_users;
