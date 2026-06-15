import { redirect } from "next/navigation";
import { getCurrentStaff } from "@/lib/auth";

// Server-side gate for the entire /admin section. It runs before the dashboard
// renders: if there's no valid session cookie, the visitor is redirected to the
// login page. Because this check happens on the server, the protected content
// is never sent to an unauthenticated browser.
//
// The login page lives at /login (outside /admin) so it isn't blocked by this
// gate — avoiding a redirect loop.
export default async function AdminLayout({ children }) {
  const staff = await getCurrentStaff();
  if (!staff) {
    redirect("/login");
  }
  return <>{children}</>;
}
