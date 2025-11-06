// middleware.js
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export function middleware(req) {
  // const token = req.cookies.get("token")?.value;
  // const url = req.nextUrl.clone();
  // console.log(token);
  // if (!token) {
  //   // ❌ No token — redirect to login
  //   console.log("redirecting to login for not having token");
  //   url.pathname = "/login";
  //   return NextResponse.redirect(url);
  // }

  // try {
  //   // ✅ Verify token
  //   jwt.verify(token, process.env.JWT_SECRET);
  //   console.log("good to go");
  //   return NextResponse.next();
  // } catch (err) {
  //   // ❌ Invalid or expired — send to login
  //   console.log("redirect to login for error");
  //   url.pathname = "/login";
  //   return NextResponse.redirect(url);
  // }
  NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"], // Protect everything under /dashboard
};
