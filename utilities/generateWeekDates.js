import moment from "moment";

function generateWeekDates(year, weekNumber) {
  const beginningOfWeek = moment().year(year).week(weekNumber).startOf("week");
  const endOfWeek = moment()
    .year(year)
    .week(weekNumber)
    .startOf("week")
    .add(6, "days");
  const start = beginningOfWeek.format("D MMM");
  const end = endOfWeek.format("D MMM");
  return { start, end };
}

export default generateWeekDates;
