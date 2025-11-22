"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Github, Twitter, Linkedin, Mail, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useMusic } from "@/context/music-context"

interface Profile {
  full_name: string | null
  bio: string | null
  avatar_url: string | null
  music_url: string | null
}

export function AboutBio() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const { setTrackUrl, togglePlay } = useMusic()
  const supabase = createClient()

  useEffect(() => {
    const fetchAdminProfile = async () => {
      // Fetch the admin profile specifically (we need to know WHO is the main user)
      // For now, we'll fetch the first user who is an admin, or just a placeholder if none
      // In a real scenario, you'd filter by a specific username or ID
      const { data, error } = await supabase
        .from("profiles")
        .select("full_name, bio, avatar_url, music_url")
        .eq("is_admin", true)
        .limit(1)
        .single()

      if (data) {
        setProfile(data)
        if (data.music_url) {
          setTrackUrl(data.music_url)
        }
      }
    }

    fetchAdminProfile()
  }, [])

  const playMyJam = () => {
    if (profile?.music_url) {
      setTrackUrl(profile.music_url)
      togglePlay()
    }
  }

  return (
    <section id="about" className="py-16 bg-background/50">
      <div className="container mx-auto px-4">
        <div className="grid gap-12 md:grid-cols-2 items-center">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-full blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
            <Avatar className="relative h-64 w-64 mx-auto md:mx-0 border-4 border-primary/50 shadow-[0_0_30px_var(--primary)]">
              <AvatarImage src={profile?.avatar_url || "https://github.com/shadcn.png"} alt="Profile" />
              <AvatarFallback>DEV</AvatarFallback>
            </Avatar>
          </div>

          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-glow text-primary">&lt;ABOUT_ME /&gt;</h2>
            <div className="space-y-4 text-muted-foreground text-lg leading-relaxed border-l-2 border-primary/20 pl-4">
              <p>
                {profile?.bio ||
                  "Cześć! Jestem programistą full-stack z pasją do tworzenia nowoczesnych, bezpiecznych i wydajnych aplikacji internetowych. Specjalizuję się w React, Next.js oraz bazach danych SQL. Moim celem jest dostarczanie kodu najwyższej jakości."}
              </p>
            </div>

            <div className="flex gap-4 pt-4">
              <SocialButton icon={<Github className="h-5 w-5" />} href="#" />
              <SocialButton icon={<Twitter className="h-5 w-5" />} href="#" />
              <SocialButton icon={<Linkedin className="h-5 w-5" />} href="#" />
              <SocialButton icon={<Mail className="h-5 w-5" />} href="#" />
            </div>

            {profile?.music_url && (
              <Button
                onClick={playMyJam}
                variant="outline"
                className="mt-6 border-secondary text-secondary hover:bg-secondary/20 w-full md:w-auto bg-transparent"
              >
                <Play className="mr-2 h-4 w-4" /> Odtwórz moją muzę
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

function SocialButton({ icon, href }: { icon: React.ReactNode; href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="p-3 rounded-full border border-primary/30 bg-primary/5 text-primary hover:bg-primary hover:text-background hover:shadow-[0_0_15px_var(--primary)] transition-all duration-300"
    >
      {icon}
    </a>
  )
}
