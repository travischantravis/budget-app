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

  dbh
    .collection("test") // spendings or test
    .add(spendingItem)
    .then((docRef) => console.log("Item added with id ", docRef.id))
    .catch((err) => console.log(`Cannot add item: ${err}`));
};

export default addSpending;
