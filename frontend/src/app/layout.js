import localFont from "next/font/local";
import "./globals.css";
import { SettingsProvider } from "@/context/Settings";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "ABC bookstore",
  description: "ABC Bookstore Management System",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel='icon' type='image/jpg' sizes='32x32' href='/images/logo.jpg' />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <SettingsProvider>
          {children}
        </SettingsProvider>
      </body>
    </html >
  );
}
