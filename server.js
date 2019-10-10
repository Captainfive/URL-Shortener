"use strict";

// Require third part dependencies
const express = require("express");
const mongo = require("mongodb");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const Schema = mongoose.Schema;
const shortid = require("shortid");


// Establish the connection with the mongodb database
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true });

// Create Url schema
const Url = new Schema({
  longUrl: String,
  shortUrl: String
});

// Create Url Model
const newUrl = mongoose.model("shortUrl", Url);

// Basic Configuration
const port = process.env.PORT || 3000;

/** this project needs a db !! **/

// Middlewares
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/public", express.static(process.cwd() + "/public"));

// exemple API endpoint...
app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

// your first API endpoint...
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});

/**
 * @function isValidUrl
 * @param {!string} string to test
 * @description test a string to find out if it is a valid URL
 * @returns {!boolean}
 */
function isValidUrl(string) {
  try {
    new URL(string);
    return true;
  }
  catch (_) {
    return false;
  }
}

// Allows to recover a shortened URL in the JSON response
app.post("wry-gojirasaurus/api/shorturl/:new(*)", (req, res) => {
  const { new: url } = req.body;

  if (!isValidUrl(url)) {
    res.status(401).json({ error: "invalid URL" });
    // polka send
    // send(res, 200, { error: "invalid URL" });
  }

  let shortURL = shortid.generate();
  // polka send
  // send(res, 200, {
  //   original_url: "www.google.com",
  //   short_url: shortURL
  // });
  res.json({
    original_url: "www.google.com",
    short_url: shortURL
  });
});

app.listen(port, function () {
  console.log("Node.js listening ...");
});
