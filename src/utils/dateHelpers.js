export function formatDateRange(start, end) {
  if (!start || !end) return "N/A";
  const startDate = new Date(start);
  const endDate = new Date(end);

  function getMonthPart(date) {
    const day = date.getDate();
    if (day <= 10) return "Early";
    if (day <= 20) return "Mid";
    return "Late";
  }

  const sameMonth = startDate.getFullYear() === endDate.getFullYear() &&
    startDate.getMonth() === endDate.getMonth();

  const monthName = endDate.toLocaleString(undefined, { month: "short" });
  const year = endDate.getFullYear();

  const part = getMonthPart(endDate);
  return `${part} ${monthName} ${year}`;
}