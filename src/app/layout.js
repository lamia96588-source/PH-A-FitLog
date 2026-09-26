import { Geist, Geist_Mono } from "next/font/google";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ToastProvider } from "@/context/toast-context";
import { PlanProvider } from "@/context/plan-context";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Fit Log — Workout Library & Planner",
  description:
    "Browse workouts, build your daily plan, and keep an eye on calories — your personal gym companion.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-screen flex-col bg-background text-foreground">
        <ToastProvider>
          <PlanProvider>
            <SiteHeader />
            <main className="flex-1">{children}</main>
            <SiteFooter />
          </PlanProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
