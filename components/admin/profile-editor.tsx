"use client"

import type React from "react"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Loader2, Save } from "lucide-react"
import { useRouter } from "next/navigation"

interface Profile {
  id: string
  username: string | null
  full_name: string | null
  bio: string | null
  avatar_url: string | null
  music_url: string | null
}

export function AdminProfileEditor({ profile }: { profile: Profile }) {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setSuccess(false)

    const formData = new FormData(e.currentTarget)

    const { error } = await supabase
      .from("profiles")
      .update({
        username: formData.get("username"),
        full_name: formData.get("full_name"),
        bio: formData.get("bio"),
        avatar_url: formData.get("avatar_url"),
        music_url: formData.get("music_url"),
      })
      .eq("id", profile.id)

    if (error) {
      alert("Błąd: " + error.message)
    } else {
      setSuccess(true)
      router.refresh()
    }

    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="username">Nazwa Użytkownika</Label>
          <Input
            id="username"
            name="username"
            defaultValue={profile.username || ""}
            className="bg-secondary/10 border-primary/30"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="full_name">Pełna Nazwa</Label>
          <Input
            id="full_name"
            name="full_name"
            defaultValue={profile.full_name || ""}
            className="bg-secondary/10 border-primary/30"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio">Bio / O Mnie</Label>
        <Textarea
          id="bio"
          name="bio"
          defaultValue={profile.bio || ""}
          className="bg-secondary/10 border-primary/30 min-h-[120px]"
          placeholder="Opowiedz coś o sobie..."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="avatar_url">URL Avatara</Label>
        <Input
          id="avatar_url"
          name="avatar_url"
          defaultValue={profile.avatar_url || ""}
          className="bg-secondary/10 border-primary/30"
          placeholder="https://example.com/avatar.jpg"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="music_url">URL Muzyki (MP3/Audio)</Label>
        <Input
          id="music_url"
          name="music_url"
          defaultValue={profile.music_url || ""}
          className="bg-secondary/10 border-primary/30"
          placeholder="https://example.com/track.mp3"
        />
        <p className="text-xs text-muted-foreground">Link będzie dostępny na stronie głównej.</p>
      </div>

      {success && (
        <div className="p-3 text-sm text-accent bg-accent/10 border border-accent/30 rounded">
          Profil zaktualizowany pomyślnie!
        </div>
      )}

      <Button
        type="submit"
        className="w-full bg-primary text-primary-foreground hover:shadow-[0_0_15px_var(--primary)] transition-all"
        disabled={loading}
      >
        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
        ZAPISZ ZMIANY
      </Button>
    </form>
  )
}
