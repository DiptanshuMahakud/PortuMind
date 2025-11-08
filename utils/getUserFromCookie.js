// /utils/getUserFromCookie.js
import jwt from "jsonwebtoken";

export default function getUserFromCookie(req) {
  const token =
    req.cookies.get("token_investor")?.value ||
    req.cookies.get("token_analyst")?.value;
  if (!token) return null;
  return jwt.verify(token, process.env.JWT_SECRET);
}
