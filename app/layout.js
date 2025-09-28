import './globals.css'
import '../styles/scrollbar.css';
import Header from "../components/Header";
import Footer from "../components/Footer";
import { LanguageProvider } from "./context/LanguageContext";
import { Toaster } from "../components/ui/toaster";

export const metadata = {
  title: 'Rajea Bundle Marketplace',
  description: 'Buy and sell bundles of 3+ items',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content="Rajea Bundle Marketplace" />
        <meta name="description" content="Buy and sell bundles of 3+ items" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans">
        <LanguageProvider>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <Toaster />
        </LanguageProvider>
      </body>
    </html>
  );
}