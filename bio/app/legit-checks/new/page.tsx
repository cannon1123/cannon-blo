import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { NewLegitCheckForm } from "@/components/legit-check/new-form"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export default async function NewLegitCheckPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data: profile } = await supabase.from("profiles").select("can_add_legit_check").eq("id", user.id).single()

  if (!profile?.can_add_legit_check) {
    return (
      <div className="container mx-auto py-20 text-center">
        <h1 className="text-2xl text-red-500 font-bold mb-4">ACCESS_DENIED</h1>
        <p className="text-muted-foreground">Nie masz uprawnień do dodawania wpisów.</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-10 max-w-2xl">
      <Card className="border-primary/50 bg-black/50 backdrop-blur-xl box-glow">
        <CardHeader>
          <CardTitle className="text-2xl text-primary text-glow text-center">NOWY WPIS</CardTitle>
        </CardHeader>
        <CardContent>
          <NewLegitCheckForm userId={user.id} />
        </CardContent>
      </Card>
    </div>
  )
}
