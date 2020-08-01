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
    return { ...data, id: doc.id.toString() };
  });

  oldData.sort((a, b) => a.id < b.id);
  console.log(oldData.length);

  // const run = await Promise.all(
  oldData.slice(40, 41).map((spendingData) => {
    // console.log(data.category, data.price, da);
    db.collection("dayTotal")
      .where("timestamp", "==", spendingData.date.seconds.toString())
      .get()
      .then(function (snapshot) {
        const dayData = snapshot.docs[0].data();
        const dayTotalId = snapshot.docs[0].id;
        const category = spendingData.category.toLowerCase();
        console.log(spendingData);
        console.log(dayData);
        console.log("dayTotal", dayTotalId);

        let categoryTotal = spendingData.price;
        if (dayData[category]) {
          categoryTotal += dayData[category];
        }
        console.log(
          category,
          dayData[category],
          spendingData.price,
          categoryTotal
        );
        // db.collection("dayTotal")
        //   .doc(dayTotalId)
        //   .update({
        //     [category]: parseFloat(categoryTotal.toFixed(2)),
        //   });
      })
      .catch(function (error) {
        console.error("Error adding document: ", error);
      });
  });
  // );

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
