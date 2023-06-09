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
// const atlasDBInfo = process.env.ATLAS_KEY_INFO;

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

// ROUTE targeting ALL /articles.
app.route("/articles")
  .get(async (req, res) => {
    try {
      const articles = await Article.find({});
      res.send(articles);
    } catch (error) {
      res.send(error);
    }
  })
  .post(async (req, res) => {
    try {
      const newArticle = new Article({
        title: req.body.title,
        content: req.body.content
      });
      await newArticle.save();
      res.send("Successfully added a new article.");
    } catch (error) {
      res.send(error);
    }
  })
  .delete(async (req, res) => {
    try {
      await Article.deleteMany({});
      res.send("Successfully deleted all articles.");
    } catch (error) {
      res.send(error);
    }
  });

// ROUTE targeting a SPECIFIC article.
app.route("/articles/:articleTitle")
  .get(async (req, res) => {
    try {
      const foundArticle = await Article.findOne({ title: req.params.articleTitle });
      if (foundArticle) {
        res.send(foundArticle);
      } else {
        res.send("No articles matching that specific title are found.");
      }
    } catch (error) {
      res.send(error);
    }
  })
  .put(async (req, res) => {
    try {
      await Article.replaceOne(
        { title: req.params.articleTitle },
        { title: req.body.title, content: req.body.content },
        { overwrite: true }
      );
      res.send("Successfully updated the article.");
    } catch (error) {
      res.send(error)
    }
  })
  .patch(async (req, res) => {
    try {
      await Article.updateOne(
        { title: req.params.articleTitle },
        { $set: req.body }
      );
      res.send("Successfully updated the article.");
    } catch (error) {
      res.send(error)
    }
  })
  .delete(async (req, res) => {
    try {
      await Article.deleteOne(
        { title: req.params.articleTitle },
      );
      res.send("Successfully deleted the article.");
    } catch (error) {
      res.send(error)
    }
  });

// Listen and respond when successfully connected to port.
app.listen(port, function () {
  console.log("Server started on port successfully.");
});