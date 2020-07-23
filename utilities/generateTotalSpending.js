// Calculate the total spending of the given items, with propertyName specified

const generateTotalSpending = (items, propertyName) => {
  let sum = 0;
  Object.values(items).forEach(
    (item) => (sum += parseFloat(item[propertyName]))
  );
  return sum;
};

export default generateTotalSpending;
