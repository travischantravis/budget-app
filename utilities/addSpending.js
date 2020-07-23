import myFirebase from "../configFiles/firebase";
import moment from "moment";

const createDayTotalObj = (d) => {
  const seconds = d.date.seconds;
  const week = moment(seconds, "X").week();
  const year = moment(seconds, "X").year();

  let newDayTotalObj = {};
  newDayTotalObj.timestamp = seconds.toString();
  newDayTotalObj.week = week;
  newDayTotalObj.year = year;
  newDayTotalObj.yearWeek = year.toString() + week.toString();
  newDayTotalObj.date = moment(seconds, "X").format();
  newDayTotalObj.totalSpending = parseFloat(d.price.toFixed(2));
  return newDayTotalObj;
};

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

  // 1. Add the spending item to spendings
  dbh
    .collection("spendings") // TODO: spendings or test
    .add(spendingItem)
    .then((docRef) => {
      console.log("Item added: ", docRef.id);

      // 2. Update the totalSpending in dayTotal
      dbh
        .collection("dayTotal")
        .where("timestamp", "==", spendingItem.date.seconds.toString())
        .get()
        .then((snapshot) => {
          if (snapshot.docs.length === 1) {
            // Case 1: If day exists in dayTotal, update the totalSpending

            console.log("Case 1: Exists in dayTotal");

            // Get the id of dayObj in dayTotal
            let docId = 1;
            const oldDayObj = snapshot.docs.map((doc) => {
              const dayData = doc.data();
              docId = doc.id;
              return dayData;
            });

            // Calculate the new total spending of the day
            const oldTotalSpending = oldDayObj[0].totalSpending;
            const newTotalSpending = oldTotalSpending + spendingItem.price;

            // Update the db
            dbh
              .collection("dayTotal")
              .doc(docId)
              .update({ totalSpending: newTotalSpending });
          } else if (snapshot.docs.length === 0) {
            // Case 2: If day does not exist, create a new day in dayTotal

            console.log("Case 2: Does not exist in dayTotal");
            const newObj = createDayTotalObj(spendingItem);
            dbh
              .collection("dayTotal")
              .add(newObj)
              .then((doc) =>
                console.log("Document added to dayTotal ", doc.id)
              );
          } else {
            // Case 3
            console.log(
              "[Error]: There are more than one entries for the same day"
            );
          }
        });
    })
    .catch((err) => console.log(`Cannot add item: ${err}`));
};

export default addSpending;
