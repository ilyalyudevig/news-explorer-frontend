import { newsApiBaseUrl as baseUrl } from "./constants";
import { checkResponse } from "./checkResponse";
import { formatDate } from "./formatDate";

const apiKey = import.meta.env.VITE_NEWS_API_KEY;

const today = new Date();
const weekAgo = new Date(today);
weekAgo.setDate(today.getDate() - 7);

const formattedToday = formatDate(today);
const formattedWeekAgo = formatDate(weekAgo);

async function getSearchResults({
  query,
  from = formattedWeekAgo,
  to = formattedToday,
  pageSize = 100,
}) {
  return await fetch(
    `${baseUrl}?q=${query}&apiKey=${apiKey}&from=${from}&to=${to}&pageSize=${pageSize}`
  ).then(checkResponse);
}

export { getSearchResults };
