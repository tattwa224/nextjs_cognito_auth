import type { Metadata } from "next";
import "./globals.css";
import Providers from './providers'
import Header from '@/components/layout/Header'

export const metadata: Metadata = {
  title: "My Cognito App",
  description: "Secure Next.js App with Cognito + Amplify v6",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
         <Header /> {/*Renders conditionally based on auth state */}
         {children}
        </Providers>
      </body>
    </html>
  )
}
