"use client"

import type React from "react"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push("/")
      router.refresh()
    }
  }

  const handleSignUp = async () => {
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${location.origin}/auth/callback`,
        data: {
          full_name: email.split("@")[0],
          avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
        },
      },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      setError("Sprawdź email aby potwierdzić rejestrację!")
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center p-4">
      <Card className="w-full max-w-md border-primary/50 bg-black/50 backdrop-blur-xl box-glow">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-primary text-glow">ACCESS_CONTROL</CardTitle>
          <CardDescription>Zaloguj się aby zarządzać profilem</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="email"
                placeholder="user@neon.dev"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-secondary/10 border-primary/30 focus:border-primary"
                required
              />
            </div>
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-secondary/10 border-primary/30 focus:border-primary"
                required
              />
            </div>

            {error && (
              <div className="p-3 text-sm text-red-500 bg-red-500/10 border border-red-500/30 rounded">{error}</div>
            )}

            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-[0_0_15px_var(--primary)] transition-all"
                disabled={loading}
              >
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                LOGIN
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleSignUp}
                className="flex-1 border-primary text-primary hover:bg-primary/10 bg-transparent"
                disabled={loading}
              >
                SIGN UP
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
