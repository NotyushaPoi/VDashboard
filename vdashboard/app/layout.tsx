import type { Metadata } from "next";
import "./globals.css";
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
    <html lang="zh-CN">
      <body className="antialiased bg-white text-gray-900">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
