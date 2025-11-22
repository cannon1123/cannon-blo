"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Home, ShieldCheck, LogIn, LogOut, Settings, Code2 } from "lucide-react"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"

export function Navbar() {
  const pathname = usePathname()
  const [user, setUser] = useState<any>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)

      if (user) {
        const { data: profile } = await supabase.from("profiles").select("is_admin").eq("id", user.id).single()

        setIsAdmin(profile?.is_admin || false)
      }
    }

    checkUser()
  }, [pathname])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = "/"
  }

  const links = [
    { href: "/", label: "HOME", icon: Home },
    { href: "/legit-checks", label: "LEGIT_CHECKS", icon: ShieldCheck },
    { href: "/projects", label: "PROJECTS", icon: Code2 },
  ]

  if (isAdmin) {
    links.push({ href: "/admin", label: "ADMIN", icon: Settings })
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-primary/30 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="text-2xl font-bold tracking-tighter text-primary text-glow">
          NEON_DEV
        </Link>
        <div className="flex gap-6 items-center">
          {links.map((link) => {
            const Icon = link.icon
            const isActive = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary",
                  isActive ? "text-primary drop-shadow-[0_0_5px_var(--primary)]" : "text-muted-foreground",
                )}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{link.label}</span>
              </Link>
            )
          })}

          {user ? (
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="border-primary/50 text-primary hover:bg-primary hover:text-background bg-transparent"
            >
              <LogOut className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">LOGOUT</span>
            </Button>
          ) : (
            <Button
              asChild
              variant="outline"
              size="sm"
              className="border-primary/50 text-primary hover:bg-primary hover:text-background bg-transparent"
            >
              <Link href="/login">
                <LogIn className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">LOGIN</span>
              </Link>
            </Button>
          )}
        </div>
      </div>
    </nav>
  )
}
