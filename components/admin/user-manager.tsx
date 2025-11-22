"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Loader2, ShieldCheck, ShieldOff } from "lucide-react"

interface UserProfile {
  id: string
  username: string | null
  full_name: string | null
  avatar_url: string | null
  can_add_legit_check: boolean
}

export function AdminUserManager({ currentUserId }: { currentUserId: string }) {
  const [users, setUsers] = useState<UserProfile[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    const { data, error } = await supabase
      .from("profiles")
      .select("id, username, full_name, avatar_url, can_add_legit_check")
      .neq("id", currentUserId) // Don't show current admin
      .order("created_at", { ascending: false })

    if (data) {
      setUsers(data)
    }
    setLoading(false)
  }

  const togglePermission = async (userId: string, currentValue: boolean) => {
    const { error } = await supabase.from("profiles").update({ can_add_legit_check: !currentValue }).eq("id", userId)

    if (!error) {
      setUsers(users.map((u) => (u.id === userId ? { ...u, can_add_legit_check: !currentValue } : u)))
    } else {
      alert("Błąd: " + error.message)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (users.length === 0) {
    return <div className="text-center py-10 text-muted-foreground">Brak innych użytkowników w systemie.</div>
  }

  return (
    <div className="space-y-4">
      {users.map((user) => (
        <div
          key={user.id}
          className="flex items-center justify-between p-4 rounded-lg border border-primary/20 bg-secondary/5 hover:bg-secondary/10 transition-colors"
        >
          <div className="flex items-center gap-4">
            <Avatar className="h-10 w-10 border border-primary/30">
              <AvatarImage src={user.avatar_url || undefined} />
              <AvatarFallback>{user.username?.[0]?.toUpperCase() || "U"}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-mono font-medium text-foreground">{user.username || user.full_name || "Użytkownik"}</p>
              <p className="text-xs text-muted-foreground font-mono">ID: {user.id.slice(0, 8)}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              {user.can_add_legit_check ? (
                <ShieldCheck className="h-4 w-4 text-accent" />
              ) : (
                <ShieldOff className="h-4 w-4 text-muted-foreground" />
              )}
              <span className="text-sm font-mono text-muted-foreground hidden sm:inline">
                {user.can_add_legit_check ? "DOSTĘP" : "BRAK"}
              </span>
            </div>
            <Switch
              checked={user.can_add_legit_check}
              onCheckedChange={() => togglePermission(user.id, user.can_add_legit_check)}
              className="data-[state=checked]:bg-accent"
            />
          </div>
        </div>
      ))}
    </div>
  )
}
