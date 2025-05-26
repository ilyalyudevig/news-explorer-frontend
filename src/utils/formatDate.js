export const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export function formatDisplayDate(isoDateString) {
  if (!isoDateString) return "";
  try {
    const date = new Date(isoDateString);

    if (isNaN(date.getTime())) {
      console.error("Invalid date provided:", isoDateString);
      return "Invalid Date";
    }
    const options = { year: "numeric", month: "long", day: "numeric" };
    return date.toLocaleDateString("en-US", options);
  } catch (error) {
    console.error("Error formatting date:", isoDateString, error);
    return "Invalid Date";
  }
}
