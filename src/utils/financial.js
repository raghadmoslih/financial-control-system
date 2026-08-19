const DAILY_RATES = {
  Analyst: 1000,
  Consultant: 1700,
  "Senior Consultant": 2400,
};

export function getDailyRate(jobTitle) {
  return DAILY_RATES[jobTitle] || 0;
}

export function calculateTimesheetRevenue(timesheet) {
  const days = Number(timesheet.days) || 0;

  const rate = getDailyRate(
    timesheet.employee?.job_title
  );

  return days * rate;
}