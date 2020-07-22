import moment from "moment";

function generateWeekDates(year, weekNumber) {
  const beginningOfWeek = moment().year(year).week(weekNumber).startOf("week");
  const endOfWeek = moment()
    .year(year)
    .week(weekNumber)
    .startOf("week")
    .add(6, "days");
  const start = beginningOfWeek.format("ddd, D MMM");
  const end = endOfWeek.format("ddd, D MMM");
  return { start, end };
}

export default generateWeekDates;
