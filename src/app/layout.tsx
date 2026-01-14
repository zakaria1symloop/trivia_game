import type { Metadata, Viewport } from "next";
import "./globals.css";
import AnimatedBackground from "@/components/AnimatedBackground";

export const metadata: Metadata = {
  title: "Restaurant Trivia Game",
  description: "Fun trivia game about Middle Eastern culture, food, and history",
  keywords: ["trivia", "game", "restaurant", "Middle East", "Arabic", "culture", "food"],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Arabic/Islamic Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Tajawal:wght@400;500;700;800&family=Scheherazade+New:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        <AnimatedBackground />
        {children}
      </body>
    </html>
  );
}
