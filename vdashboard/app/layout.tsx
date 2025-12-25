import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "./components/ThemeProvider";
import { Navbar } from "./components/Navbar";

export const metadata: Metadata = {
  title: "🌿春和音-Harumonie🌿",
  description: "我们的歌声，是献给世界的一整个春天。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning className="light">
      <body className="antialiased bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-50 transition-colors duration-200">
        <ThemeProvider>
          <Navbar />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
