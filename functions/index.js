const functions = require("firebase-functions");
const express = require("express");

const app = express();
app.use(express.json());

// [Debug] Initial test
app.get("/test", (req, res) => {
  res.send("testing success!");
});

exports.app = functions.https.onRequest(app);
