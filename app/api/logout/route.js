// app/api/auth/logout/route.js
import { NextResponse } from "next/server";
import { serialize } from "cookie";

export async function POST() {
  const res = NextResponse.json({ message: "Logged out" });

  // ❌ Old cookie ("token") — clear anyway for safety
  res.headers.append(
    "Set-Cookie",
    serialize("token", "", {
      httpOnly: true,
      path: "/",
      expires: new Date(0),
    })
  );

  // ✅ New investor cookie
  res.headers.append(
    "Set-Cookie",
    serialize("token_investor", "", {
      httpOnly: true,
      path: "/",
      expires: new Date(0),
    })
  );

  // ✅ New analyst cookie
  res.headers.append(
    "Set-Cookie",
    serialize("token_analyst", "", {
      httpOnly: true,
      path: "/",
      expires: new Date(0),
    })
  );

  return res;
}
