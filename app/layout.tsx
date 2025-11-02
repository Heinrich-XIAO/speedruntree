import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider"
import { ModeToggle } from "../components/mode-toggle"
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'
import { Button } from "@/components/ui/button"
import ConvexClientProvider from '@/components/ConvexClientProvider'
import { PutUserInDB } from '@/components/putuserindb'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "speedruntree",
  description: "A todo list app built for ADHD.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <ConvexClientProvider>
        <html lang="en" suppressHydrationWarning>
          <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
          >
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <header className="bg-background shadow-md w-full">
                  <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                      <div className="flex items-center justify-between h-16 border-b border-gray-300">
                          <h1 className="text-2xl font-bold text-foreground">
                              Speedruntree
                          </h1>
                          <div className="flex gap-3 items-center">
                            <ModeToggle />
                            <SignedOut>
                              <SignInButton>
                                <Button variant="outline">
                                  Sign In
                                </Button>
                              </SignInButton>

                              <SignUpButton>
                                <Button className="font-medium"> 
                                  Sign Up
                                </Button>
                              </SignUpButton>
                            </SignedOut>

                            <SignedIn>
                              <UserButton />
                              <PutUserInDB />
                            </SignedIn>
                          </div>
                      </div>
                  </div>
              </header>
              {children}
            </ThemeProvider>
          </body>
        </html>
      </ConvexClientProvider>
    </ClerkProvider>
  );
}
