export { default } from "next-auth/middleware";

export const config = {
  matcher: ["/dashboard/:path*", "/people/:path*", "/import/:path*", "/import", "/profile/:path*", "/profile"],
  // /submit/:path* is intentionally public — no auth required
};
