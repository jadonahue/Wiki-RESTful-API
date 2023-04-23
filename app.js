// Require modules
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

// 3000 is what we used for local. For Heroku we need to use process.env.PORT. Which is a dynamic port.
let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
};

// Import and configure dotenv.
require('dotenv').config()

// Personal AtlasDB URL and User info in .env file.
const atlasDBInfo = process.env.ATLAS_KEY_INFO;

app.set('view engine', 'ejs');

// This sets up body-parser for use.
app.use(bodyParser.urlencoded({ 
  extended: true 
}));

// This serves static files in public folder.
app.use(express.static("public"));


// Connect to Atlas DB or create DB if not there then connect. Or use local connection wikiDB.
mongoose.connect("mongodb://localhost:27017/wikiDB")
// mongoose.connect(atlasDBInfo + "wikiDB")

// Create new SCHEMA
const articleSchema = {
  title: String,
  content: String
};

// Create new MODEL (Mongoose will automatically make "Article" plural in mongoDB.)
const Article = mongoose.model(
  "Article",
  articleSchema
);

// GET articles using async/await function. Catch any errors.
app.get("/articles", async function (req, res){

  try {
    const articles = await Article.find({});
    res.send(articles);
  } catch (error) {
    res.send(error);
  }

});

// POST articles using async/await function. Catch any errors.
app.post("/articles", async function (req, res){

  try {
    const newArticle = new Article ({
      title:req.body.title,
      content:req.body.content
    });

     await newArticle.save()
    .then(function (success) {
      res.send("Successfully added a new article.");
    })
  } catch (error) {
    res.send(error);
  }

});

// DELETE all articles using asycn function.
// app.delete("/articles", async function (req, res){
//   try {
//     await Article.deleteMany({});
//   } catch (error) {
//     console.log(error);
//   }
// });

// Listen and respond when successfully connected to port.
app.listen(port, function () {
  console.log("Server started on port successfully.");
});