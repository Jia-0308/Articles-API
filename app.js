//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.get("/", function(req, res) {
  res.send("Hello");
});

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", {
  useNewUrlParser: true
});

const articleSchema = {
  title: String,
  content: String
};

const Article = mongoose.model("Article", articleSchema);

app.route("/articles")

.get(function(req, res) {
  Article.find(function(err, foundArticles) {
    if (!err) {
      res.send(foundArticles);
    } else {
      res.send(err);
    }
  });
})

.post(function(req, res) {
  const newArticle = new Article({
    title: req.body.title,
    content: req.body.content
  });
  newArticle.save(function(err) {
    if (!err) {
      res.send("Added!")
    } else {
      res.send(err);
    }
  });
})

// .delete(function(req, res) {
//   Article.deleteOne({
//     title: "PHP"
//   }, function(err) {
//     if (!err) {
//       res.send("Deleted!");
//     } else {
//       res.send(err);
//     }
//   });
// });

/////////////////////////////////////////////////////Specific Article///////////////////////////////////////////////
app.route("/articles/:articleTitle")

.get(function(req, res) {
  Article.findOne(
    {title : req.params.articleTitle},
    function(err, result) {
    if (result) {
      res.send(result);
    } else {
      res.send("Not found!");
    }
  });
})

.put(function(req, res){
   Article.update(
     {title : req.params.articleTitle},
     {title: req.body.title, content: req.body.content},
     {overwrite: true},
     function(err, results){
       if (!err) {
         res.send("Updated!");
       } else {
         res.send(err);
       }
     }
   )
})

.patch(function(req, res){
   Article.update(
     {title : req.params.articleTitle},
     { $set: req.body},
     function(err, results){
       if (!err) {
         res.send("Updated!");
       } else {
         res.send(err);
       }
     }
   )
})

.delete(function(req, res) {
  Article.deleteOne({
    title: req.params.articleTitle
  }, function(err) {
    if (!err) {
      res.send("Deleted!");
    } else {
      res.send(err);
    }
  });
});

app.listen(6000, function() {
  console.log("Server started on port 6000");
});
