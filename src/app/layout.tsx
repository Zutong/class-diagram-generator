import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { GoogleAnalytics } from '@next/third-parties/google';
import "./globals.css";
import { Providers } from "@/components/Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI Class Diagram Generator | Free Text to UML Tool",
  description: "Instantly create UML class diagrams, flowcharts, and sequence diagrams from plain text using AI. Powered by Mermaid.js and DeepSeek.",
  keywords: ["AI UML generator", "Class diagram generator", "Text to UML", "Mermaid.js diagram", "AI class diagram", "Auto generate UML from code"],
  authors: [{ name: "Indie Developer" }],
  openGraph: {
    title: "AI Class Diagram Generator | Free Text to UML Tool",
    description: "Instantly create UML class diagrams from text using AI.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Class Diagram Generator",
    description: "Instantly create UML class diagrams from text using AI.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
      {process.env.NEXT_PUBLIC_GA_ID && (
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
      )}
    </html>
  );
}
