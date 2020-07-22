import myFirebase from "../configFiles/firebase";
import moment from "moment";

const addSpending = (spendingItem) => {
  const dbh = myFirebase.firestore();
  const { date } = spendingItem;

  // Remove the time part
  spendingItem.date.setHours(0, 0, 0, 0);
  spendingItem.date = myFirebase.firestore.Timestamp.fromDate(
    spendingItem.date
  );
  spendingItem.price = parseFloat(spendingItem.price);
  spendingItem.week = moment(date).week();
  spendingItem.year = moment(date).year();

  console.log(spendingItem);

  // 1. Add the spending item to spendings
  dbh
    .collection("test") // spendings or test
    .add(spendingItem)
    .then((docRef) => {
      console.log(spendingItem.date.seconds);
      console.log("Item added: ", docRef.id);

      // 2. Update the totalSpending in dayTotal
      dbh
        .collection("dayTotal")
        .where("timestamp", "==", spendingItem.date.seconds.toString())
        .get()
        .then((snapshot) => {
          if (snapshot.docs.length === 1) {
            // If day exists in dayTotal, update the totalSpending
            console.log("Exists in dayTotal");

            snapshot.docs.map((doc) => {
              const dayData = doc.data();
              const newDayTotal = dayData.totalSpending + spendingItem.price;
              console.log(newDayTotal);
              // console.log(dayData.totalSpending);
              // console.log(spendingItem.price);
            });
          } else if (snapshot.docs.length === 0) {
            // If day does not exist, create a new day in dayTotal
            console.log("Does not exist in dayTotal");
          } else {
            console.log(
              "[Error]: There are more than one entries for the same day"
            );
          }
        });
    })
    .catch((err) => console.log(`Cannot add item: ${err}`));
};

export default addSpending;
