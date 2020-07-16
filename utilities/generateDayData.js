// Filter by date

const generateDayData = (items, date) => {
  const filteredItems = items.filter(function (item) {
    return item.date === date;
    // return item.date.getTime() === date.getTime();
  });
  return filteredItems;
};

export default generateDayData;
