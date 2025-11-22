import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { MusicProvider } from "@/context/music-context"
import { Navbar } from "@/components/layout/navbar"
import { FixedMusicPlayer } from "@/components/layout/music-player"

const _geist = Geist({ subsets: ["latin"], variable: "--font-sans" })
const _geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" })

export const metadata: Metadata = {
  title: "NEON_DEV | Portfolio & Legit Checks",
  description: "Advanced portfolio system with built-in reputation tracking.",
  viewport: {
    themeColor: "#00f3ff",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pl" className="dark">
      <body
        className={`${_geist.variable} ${_geistMono.variable} font-mono antialiased bg-background text-foreground min-h-screen flex flex-col pb-20`}
      >
        <MusicProvider>
          <Navbar />
          <main className="flex-1 pt-16">{children}</main>
          <FixedMusicPlayer />
        </MusicProvider>
        <Analytics />
      </body>
    </html>
  )
}
