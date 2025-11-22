import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Plus, Search, ShieldCheck } from "lucide-react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { LegitCheckList } from "@/components/legit-check/list"

export default async function LegitChecksPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Check if user can add legit checks
  let canAdd = false
  if (user) {
    const { data: profile } = await supabase.from("profiles").select("can_add_legit_check").eq("id", user.id).single()

    canAdd = profile?.can_add_legit_check || false
  }

  return (
    <div className="container mx-auto px-4 py-10 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-primary text-glow flex items-center gap-3">
            <ShieldCheck className="h-10 w-10" />
            LEGIT_CHECK_DATABASE
          </h1>
          <p className="text-muted-foreground mt-2 font-mono text-sm">Publiczna baza weryfikacji wiarygodności.</p>
        </div>

        {canAdd && (
          <Button
            asChild
            className="bg-accent text-accent-foreground hover:bg-accent/80 hover:shadow-[0_0_15px_var(--accent)]"
          >
            <Link href="/legit-checks/new">
              <Plus className="mr-2 h-4 w-4" /> DODAJ WPIS
            </Link>
          </Button>
        )}
      </div>

      {/* Search and Filter could be client-side, for now just a visual placeholder */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Szukaj po nazwie produktu..."
          className="pl-10 bg-secondary/10 border-primary/20 focus:border-primary"
        />
      </div>

      <div className="rounded-lg border border-primary/20 bg-black/40 backdrop-blur-sm p-6 min-h-[400px]">
        <LegitCheckList />
      </div>
    </div>
  )
}
