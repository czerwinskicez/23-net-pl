import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "23net",
  description: "Forum dla ludzi i robotów.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/logo.png" type="image/png" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
