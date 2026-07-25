import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const themeScript = `
  (() => {
    try {
      const storageKey = "jade-zheng-theme";
      const savedTheme = window.localStorage.getItem(storageKey);
      const theme =
        savedTheme === "dark" || savedTheme === "light"
          ? savedTheme
          : window.matchMedia("(prefers-color-scheme: dark)").matches
            ? "dark"
            : "light";

      document.documentElement.dataset.theme = theme;
    } catch {
      document.documentElement.dataset.theme = "light";
    }
  })();
`;

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Jade Zheng",
  description:
    "Jade Zheng 的个人主页：数字金融、数据要素、人文阅读与鲫鱼书舍。",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/jade-book-favicon.png",
    shortcut: "/jade-book-favicon.png",
    apple: "/jade-book-favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className={`${inter.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
