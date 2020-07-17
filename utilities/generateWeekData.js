// Receive all spending data of one week
// Return the total spending of each day of the week
import moment from "moment";

export default generateWeekData = (data) => {
  // console.log(data);

  // 1. Group data according to date, and return only the price
  const result = data.reduce(function (r, a) {
    r[a.date] = r[a.date] || [];
    r[a.date].push(a.price);
    return r;
  }, Object.create(null));

  // 2. Calculate the total spending of each day
  let result1 = [];
  for (let date in result) {
    result1.push({
      date: new Date(date),
      totalSpending: result[date].reduce((a, b) => {
        return a + b;
      }),
    });
  }

  // console.log(result1);
  return result1;
};
