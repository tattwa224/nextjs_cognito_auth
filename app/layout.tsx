import type { Metadata } from "next";
import "./globals.css";
import Providers from './providers'

export const metadata: Metadata = {
  title: "My Cognito App",
  description: "Secure Next.js App with Cognito + Amplify v6",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
