import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TibebBorder from "@/components/TibebBorder";

// Page metadata used by Next.js for the <head> tag and SEO.
export const metadata = {
  title: "AW Beauty Salon — Hair & Barber Studio in Silver Spring, MD",
  description:
    "Where hair dreams become reality for both men and women. Men's cuts, fades, beard trims, traditional shaves, women's styling, updos, braids, and color in Silver Spring, MD. Easy online booking.",
};

// The root layout wraps every page. It provides the theme context and the
// shared navbar/footer so each page only needs to render its own content.
export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="flex min-h-screen flex-col">
        <ThemeProvider>
          <Navbar />
          {/* Ethiopian tibeb accent strip under the header, site-wide. */}
          <TibebBorder />
          <main className="flex-1">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
