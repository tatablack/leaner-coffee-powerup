const INTERVALS = {
  ONE_DAY: 24 * 60 * 60 * 1000,
  ONE_WEEK: 7 * 24 * 60 * 60 * 1000,
  ONE_MONTH: 30 * 24 * 60 * 60 * 1000,
  SIX_MONTHS: 6 * 30 * 24 * 60 * 60 * 1000,
  ONE_YEAR: 365 * 24 * 60 * 60 * 1000,
  TWO_YEARS: 2 * 365 * 24 * 60 * 60 * 1000,
  FIVE_YEARS: 5 * 365 * 24 * 60 * 60 * 1000,
};

function classifyDuration(duration: number): string {
  switch (true) {
    case duration < INTERVALS.ONE_DAY:
      return "Less than a day";

    case duration >= INTERVALS.ONE_DAY && duration < INTERVALS.ONE_WEEK:
      return "Between a day and a week";

    case duration >= INTERVALS.ONE_WEEK && duration < INTERVALS.ONE_MONTH:
      return "Between a week and a month";

    case duration >= INTERVALS.ONE_MONTH && duration < INTERVALS.SIX_MONTHS:
      return "Between a month and six months";

    case duration >= INTERVALS.SIX_MONTHS && duration < INTERVALS.ONE_YEAR:
      return "Between six months and a year";

    case duration >= INTERVALS.ONE_YEAR && duration < INTERVALS.TWO_YEARS:
      return "Between one and two years";

    case duration >= INTERVALS.TWO_YEARS && duration < INTERVALS.FIVE_YEARS:
      return "Between two and five years";

    case duration >= INTERVALS.FIVE_YEARS:
      return "More than five years";

    default:
      return "Invalid duration";
  }
}

export default classifyDuration;
