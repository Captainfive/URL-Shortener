"use strict";

const express = require("express");
const mongo = require("mongodb");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();

const Schema = mongoose.Schema;
const shortid = require("shortid");

mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true });

const Url = new Schema({
  longUrl: String,
  shortUrl: String
});

const newUrl = mongoose.model("shortUrl", Url);

// Basic Configuration
const port = process.env.PORT || 3000;

/** this project needs a db !! **/

// mongoose.connect(process.env.MONGOLAB_URI);

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));

/** this project needs to parse POST bodies **/
// you should mount the body-parser here

app.use("/public", express.static(process.cwd() + "/public"));

app.get("/", function(req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

// your first API endpoint...
app.get("/api/hello", function(req, res) {
  res.json({ greeting: "hello API" });
});

/**
 * @function isValidUrl
 * @param {!string} string to test
 * @returns {!boolean}
 */
function isValidUrl(string) {
  try {
    new URL(string);

    return true;
  } catch (_) {
    return false;
  }
}

app.post("wry-gojirasaurus/api/shorturl/:new(*)", (req, res) => {
  const { new: url } = req.body;

  if (!isValidUrl(url)) {
    res.status(401).json({ error: "invalid URL" });
    // send(res, 200, { error: "invalid URL" });
  }

  let shortURL = shortid.generate();
  const URL = new newUrl({
    longUrl: url,
    shortUrl: shortURL
  });
  // send(res, 200, { original_url: url, short_url: short });
  res.json({
    original_url: "www.google.com",
    short_url: shortURL
  });
});

app.listen(port, function() {
  console.log("Node.js listening ...");
});
