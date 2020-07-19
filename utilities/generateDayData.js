// Filter by date

const generateDayData = (items, date) => {
  // console.log(date);
  // console.log(items);
  const filteredItems = items.filter(function (item) {
    // console.log(item.date.getTime() === date.getTime());
    return item.date === date;

    // return item.date.getTime() === date.getTime();
  });
  // console.log(filteredItems);
  return filteredItems;
};

export default generateDayData;
