"use client"

import { useMusic } from "@/context/music-context"
import { Play, Pause, Volume2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { cn } from "@/lib/utils"

export function FixedMusicPlayer() {
  const { isPlaying, togglePlay, currentTrackUrl, volume, setVolume } = useMusic()

  // Hide if no track is set (unless we want to show an empty state)
  if (!currentTrackUrl) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-primary/30 bg-background/90 backdrop-blur-lg p-2">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 flex items-center justify-center border border-primary/50 bg-primary/10 animate-pulse">
            <MusicIcon isPlaying={isPlaying} />
          </div>
          <div className="hidden sm:block">
            <p className="text-xs text-muted-foreground">NOW_PLAYING</p>
            <p className="text-sm font-bold text-primary truncate max-w-[200px]">background_track.mp3</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={togglePlay}
            className="border-primary text-primary hover:bg-primary hover:text-background hover:shadow-[0_0_15px_var(--primary)] transition-all bg-transparent"
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
        </div>

        <div className="flex items-center gap-2 w-32 hidden sm:flex">
          <Volume2 className="h-4 w-4 text-muted-foreground" />
          <Slider
            value={[volume * 100]}
            max={100}
            step={1}
            onValueChange={(v) => setVolume(v[0] / 100)}
            className="cursor-pointer"
          />
        </div>
      </div>
    </div>
  )
}

function MusicIcon({ isPlaying }: { isPlaying: boolean }) {
  return (
    <div className={cn("flex items-end gap-[2px] h-4", isPlaying ? "" : "opacity-50")}>
      <div className={cn("w-[3px] bg-primary", isPlaying ? "animate-[bounce_1s_infinite]" : "h-2")} />
      <div className={cn("w-[3px] bg-primary", isPlaying ? "animate-[bounce_1.2s_infinite]" : "h-3")} />
      <div className={cn("w-[3px] bg-primary", isPlaying ? "animate-[bounce_0.8s_infinite]" : "h-1")} />
    </div>
  )
}
