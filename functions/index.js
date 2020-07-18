const functions = require("firebase-functions");
const express = require("express");
const admin = require("firebase-admin");

// Express
const app = express();
app.use(express.json());

// Firebase
admin.initializeApp();
const db = admin.firestore();

// [Debug] Initial test
app.get("/test", (req, res) => {
  res.send({ msg: "test success" });
});

// [Debug] GET data from Firestore
app.get("/api/test", (req, res) => {
  // const { matchId } = req.params;
  db.collection("test")
    .doc("S1Gnq99L4ZrumHQHttOE")
    .get()
    .then((doc) => res.send(doc.data()))
    .catch((err) => {
      console.log("Error getting documents", err);
    });
});

exports.app = functions.https.onRequest(app);
