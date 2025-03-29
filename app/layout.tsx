import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Buzzer Detector App",
  description: "Created with Buzzer Detector",
  authors: [
    {
      name: "Zaini Nijar",
      url: "https://github.com/zaininijar",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
