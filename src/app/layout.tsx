import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/hooks/use-language";
import { AccessibilityProvider } from "@/hooks/use-accessibility";
import AIAssistant from "@/components/sections/ai-assistant";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "RoadSOS AI - Emergency Response Platform",
  description: "AI-Powered Emergency Response System for Road Accidents. Saving lives during the Golden Hour.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <LanguageProvider>
          <AccessibilityProvider>
            {children}
            <AIAssistant />
          </AccessibilityProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}

