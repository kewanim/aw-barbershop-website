import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Page metadata used by Next.js for the <head> tag and SEO.
export const metadata = {
  title: "AW Barbershop — Sharp Cuts, Classic Service",
  description:
    "Book your next haircut, fade, beard trim, or hot-towel shave at AW Barbershop. Master barbers, modern style, easy online booking.",
};

// The root layout wraps every page. It provides the theme context and the
// shared navbar/footer so each page only needs to render its own content.
export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="flex min-h-screen flex-col">
        <ThemeProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
