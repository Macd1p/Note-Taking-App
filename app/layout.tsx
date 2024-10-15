import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { ConvexClientProvider } from "@/components/providers/convex-provider";
import { Toaster} from "sonner";
import { ModalProvider } from "@/components/providers/model-provider";
import { EdgeStoreProvider } from "@/lib/edgestore";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Jotion",
  description: "The connected workspace where stuff gets done",
  icons: {
    icon:[
      {
        media: "(prefers-color-scheme: light",
        url: "/logo.svg",
        href: "/logo.svg",
      },
      {
        media: "(prefers-color-scheme: dark",
        url: "/logo-dark.svg",
        href: "/logo-dark.svg",
      }
    ]
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ConvexClientProvider>
          <EdgeStoreProvider>
        <ThemeProvider attribute="class"
        defaultTheme="sytem"
        enableSystem
        disableTransitionOnChange
        storageKey="jotion-theme"
        >
          <Toaster position="bottom-center" />
          <ModalProvider />
        {children}
        </ThemeProvider>
        </EdgeStoreProvider>
        </ConvexClientProvider>
        </body>
    </html>
  );
}
