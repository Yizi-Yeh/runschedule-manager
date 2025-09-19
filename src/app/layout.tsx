import type { Metadata } from "next";
import ThemeProvider from "@/providers/ThemeProvider";
import AppLayout from "@/components/layout/AppLayout";
import "./globals.css";

export const metadata: Metadata = {
  title: "RunSchedule Manager - 跑步訓練管理系統",
  description: "專業的跑步訓練課表管理與Google Calendar同步工具",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW">
      <body>
        <ThemeProvider>
          <AppLayout>
            {children}
          </AppLayout>
        </ThemeProvider>
      </body>
    </html>
  );
}
