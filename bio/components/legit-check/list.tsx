import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Clock, Calendar } from "lucide-react"

export async function LegitCheckList() {
  const supabase = await createClient()

  const { data: checks, error } = await supabase
    .from("legit_checks")
    .select(`
      *,
      profiles:author_id (username, avatar_url)
    `)
    .order("created_at", { ascending: false })

  if (error) {
    return <div className="text-red-500">Błąd ładowania danych: {error.message}</div>
  }

  if (!checks || checks.length === 0) {
    return <div className="text-center text-muted-foreground py-20">Baza jest pusta. Oczekiwanie na dane...</div>
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {checks.map((check) => (
        <Card
          key={check.id}
          className="bg-card/50 border-primary/20 hover:border-primary/60 transition-all duration-300 flex flex-col"
        >
          <CardHeader>
            <div className="flex justify-between items-start gap-4">
              <CardTitle className="text-lg font-mono text-primary truncate">{check.product_name}</CardTitle>
              <Badge variant="outline" className="border-primary text-primary shrink-0">
                {check.rating}/5
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="flex-1 space-y-4">
            <div className="flex text-yellow-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`h-4 w-4 ${i < check.rating ? "fill-current" : "text-muted/20"}`} />
              ))}
            </div>

            <p className="text-sm text-muted-foreground line-clamp-3">{check.product_description || "Brak opisu."}</p>

            {check.screenshot_base64 && (
              <div className="relative h-40 w-full overflow-hidden rounded border border-primary/10 bg-black">
                <img
                  src={check.screenshot_base64 || "/placeholder.svg"}
                  alt="Dowód"
                  className="object-cover w-full h-full opacity-80 hover:opacity-100 transition-opacity"
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground font-mono pt-2">
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>Czas: {check.wait_time || "-"}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>{new Date(check.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          </CardContent>

          {check.additional_data && (
            <CardFooter className="pt-2 border-t border-primary/10">
              <p className="text-xs text-muted-foreground font-mono truncate w-full">INFO: {check.additional_data}</p>
            </CardFooter>
          )}
        </Card>
      ))}
    </div>
  )
}
