const functions = require("firebase-functions");
const express = require("express");
const admin = require("firebase-admin");
const firebase = require("firebase");
const async = require("express-async-await");
const moment = require("moment");

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

app.get("/api/spendings/all", async (req, res) => {
  const snapshot = await db.collection("spendings").get();
  res.send(snapshot.docs.map((doc) => doc.data()));
});

const generateDayTotal = (data) => {
  // console.log(data);

  // 1. Group data according to date, and return only the price
  const result = data.reduce(function (r, a) {
    r[a.date.seconds] = r[a.date.seconds] || [];
    r[a.date.seconds].push(a.price);
    return r;
  }, Object.create(null));

  // 2. Calculate the total spending of each day
  let result1 = [];
  for (let seconds in result) {
    result1.push({
      timestamp: seconds,
      totalSpending: result[seconds].reduce((a, b) => {
        return a + b;
      }),
    });
  }

  // console.log(result1);
  return result1;
};

// Listen for changes in spendings and update dayTotal
app.get("/api/day/total/listen", async (req, res) => {
  db.collection("spendings").onSnapshot((querySnapshot) => {
    const data = querySnapshot.docs.map((doc) => {
      let tempData = doc.data();
      console.log("Changes listened");
      return tempData;
    });
  });
  res.send({ msg: "success" });
});

// [One-time] Calculate day total by explicitly calling
app.get("/api/day/total/new", async (req, res) => {
  const snapshot = await db.collection("spendings").get();
  const oldData = snapshot.docs.map((doc) => {
    let data = doc.data();
    data.id = doc.id;
    return data;
  });
  // console.log(oldData);
  let groupedData = generateDayTotal(oldData);
  groupedData.forEach((d) => {
    d.week = moment(d.timestamp, "X").week();
    d.year = moment(d.timestamp, "X").year();
    d.totalSpending = parseFloat(d.totalSpending.toFixed(2));
    d.date = moment(d.timestamp, "X").format();
  });

  const run = await Promise.all(
    groupedData.map((data) => {
      console.log(data);
      db.collection("dayTotal")
        .add(data)
        .then(function (docRef) {
          console.log("Document written with ID: ", docRef.id);
        })
        .catch(function (error) {
          console.error("Error adding document: ", error);
        });
    })
  );

  res.send({ msg: "success" });
});

// [One-time] Add new properties to each document
app.get("/api/spendings/update", async (req, res) => {
  // 1. Get all documents' id
  const snapshot = await db.collection("spendings").get();
  const oldData = snapshot.docs.map((doc) => {
    let data = doc.data();
    data.id = doc.id;
    return data;
  });

  // console.log(oldData);

  // 2. Add new properties to each document
  const edited = await Promise.all(
    oldData.map((d) => {
      console.log(d.id);
      const date = d.date._seconds;
      const week = moment(date, "X").week();
      const year = moment(date, "X").year();
      console.log(date, week, year);
      db.collection("spendings").doc(d.id).set(
        {
          week,
          year,
        },
        { merge: true }
      );
    })
  );

  res.send({ msg: "success" });
});

exports.app = functions.https.onRequest(app);
