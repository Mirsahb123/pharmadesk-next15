import type { Metadata, Viewport } from "next";
import { Cinzel, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import PWARegister from "@/components/PWARegister";
import { AuthProvider } from "@/contexts/AuthContext";
import CartIcon from "@/components/Cart/CartIcon";

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Darbar Restaurant | Royal Mughal Cuisine",
  description: "Experience the royal taste of authentic Mughal cuisine at Darbar Restaurant. Biryani, Kebabs, and traditional dishes fit for royalty.",
  keywords: ["Darbar Restaurant", "Mughal Cuisine", "Biryani", "Kebabs", "Pakistani Food", "Indian Food", "Royal Dining"],
  authors: [{ name: "Darbar Restaurant" }],
  creator: "Darbar Restaurant",
  manifest: "/manifest.json",
  icons: {
    icon: "/logo.jpg",
    apple: "/logo.jpg",
  },
  openGraph: {
    title: "Darbar Restaurant | Royal Mughal Cuisine",
    description: "Experience the royal taste of authentic Mughal cuisine",
    images: ["/logo.jpg"],
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#7B1818",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${cinzel.variable} ${cormorant.variable} antialiased bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900`}
      >
        <AuthProvider>
          <PWARegister />
          {children}
          <CartIcon />
        </AuthProvider>
      </body>
    </html>
  );
}
