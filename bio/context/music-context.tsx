"use client"

import type React from "react"
import { createContext, useContext, useState, useRef, useEffect } from "react"

interface MusicContextType {
  isPlaying: boolean
  togglePlay: () => void
  currentTrackUrl: string | null
  setTrackUrl: (url: string) => void
  volume: number
  setVolume: (vol: number) => void
}

const MusicContext = createContext<MusicContextType | undefined>(undefined)

export function MusicProvider({ children }: { children: React.ReactNode }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTrackUrl, setCurrentTrackUrl] = useState<string | null>(null)
  const [volume, setVolume] = useState(0.5)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio()
    }

    const audio = audioRef.current
    audio.volume = volume

    if (currentTrackUrl) {
      if (audio.src !== currentTrackUrl) {
        audio.src = currentTrackUrl
        if (isPlaying) {
          audio.play().catch((e) => console.log("Audio play error:", e))
        }
      }
    } else {
      audio.pause()
    }

    return () => {
      audio.pause()
    }
  }, [currentTrackUrl])

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying && currentTrackUrl) {
        audioRef.current.play().catch(console.error)
      } else {
        audioRef.current.pause()
      }
    }
  }, [isPlaying, currentTrackUrl])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume
    }
  }, [volume])

  const togglePlay = () => setIsPlaying(!isPlaying)
  const setTrackUrl = (url: string) => setCurrentTrackUrl(url)

  return (
    <MusicContext.Provider value={{ isPlaying, togglePlay, currentTrackUrl, setTrackUrl, volume, setVolume }}>
      {children}
    </MusicContext.Provider>
  )
}

export const useMusic = () => {
  const context = useContext(MusicContext)
  if (context === undefined) {
    throw new Error("useMusic must be used within a MusicProvider")
  }
  return context
}
