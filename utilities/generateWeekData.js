// Receive all spending data of one week
// Return the total spending of each day of the week

export default generateWeekData = (data) => {
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

  // console.log(result);
  return result1;
};
