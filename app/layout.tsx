import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar, Footer } from "@/components/shared";
import { AuthProvider } from "@/components/auth/AuthProvider";


const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "UB Merch - Official Universitas Brawijaya Merchandise",
  description: "Koleksi merchandise official kualitas terbaik untuk mahasiswa dan alumni Universitas Brawijaya. Bangga menjadi bagian dari Brawijaya!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body
        className={`${inter.variable} antialiased flex flex-col min-h-screen`}
      >
        <AuthProvider>
            <Navbar />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
