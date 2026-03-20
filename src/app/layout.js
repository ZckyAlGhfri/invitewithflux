import { Playfair_Display, Montserrat } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
});

const montserrat = Montserrat({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata = {
  title: "FluxWedding - Digital Invitation",
  description: "Undangan digital eksklusif dan elegan.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" className="scroll-smooth">
      <body className={`${montserrat.variable} ${playfair.variable} min-h-full flex flex-col font-sans antialiased bg-slate-50`}>
        {children}
      </body>
    </html>
  );
}