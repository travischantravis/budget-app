import myFirebase from "../configFiles/firebase";

const deleteSpending = (item) => {
  const dbh = myFirebase.firestore();

  dbh
    .collection("spendings")
    .doc(item.id)
    .delete()
    .then(() => {
      console.log("Item deleted with id ", item.id);
      dbh
        .collection("dayTotal")
        .where("timestamp", "==", item.date.toString())
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

            // Deduct the totalSpending in dayTotal
            const oldTotalSpending = oldDayObj[0].totalSpending;
            const newTotalSpending = parseFloat(
              (oldTotalSpending - item.price).toFixed(2)
            );

            // Deduct category total in dayTotal
            const category = item.category.toLowerCase();
            const oldCategoryTotal = oldDayObj[0][category];
            const newCategoryTotal = parseFloat(
              (oldCategoryTotal - item.price).toFixed(2)
            );

            // Update the db
            dbh
              .collection("dayTotal")
              .doc(docId)
              .update({
                totalSpending: newTotalSpending,
                [category]: newCategoryTotal,
              });
          } else {
            // Case 2
            console.log(
              "Error: there are more than one documents or zero documents"
            );
          }
        });
    })
    .catch((error) => {
      console.error("Error removing document: ", error);
    });
};

export default deleteSpending;
