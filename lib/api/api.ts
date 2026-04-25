import axios from "axios";

const apiOrigin = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "";
const baseURL = apiOrigin ? `${apiOrigin}/api` : "/api";

export const api = axios.create({
  baseURL,
  withCredentials: true,
});
