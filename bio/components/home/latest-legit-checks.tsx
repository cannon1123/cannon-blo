import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Star, Clock, ShieldCheck } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export async function LatestLegitChecks() {
  const supabase = await createClient()

  // Fetch last 3 legit checks
  const { data: checks } = await supabase
    .from("legit_checks")
    .select(`
      id,
      product_name,
      rating,
      created_at,
      author_id,
      screenshot_base64
    `)
    .order("created_at", { ascending: false })
    .limit(3)

  return (
    <section className="py-16 container mx-auto px-4">
      <div className="flex items-center justify-between mb-10">
        <h2 className="text-3xl font-bold text-glow text-primary flex items-center gap-3">
          <ShieldCheck className="h-8 w-8" />
          LATEST_LOGS
        </h2>
        <Badge variant="outline" className="border-primary text-primary animate-pulse">
          LIVE_FEED
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {checks && checks.length > 0 ? (
          checks.map((check) => (
            <Card
              key={check.id}
              className="bg-card/50 border-primary/20 backdrop-blur-sm hover:border-primary/60 transition-all duration-300 group"
            >
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl font-mono truncate text-primary group-hover:text-glow">
                    {check.product_name}
                  </CardTitle>
                  <div className="flex text-yellow-500">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i < (check.rating || 0) ? "fill-current" : "text-muted/20"}`}
                      />
                    ))}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {check.screenshot_base64 && (
                    <div className="relative h-32 w-full overflow-hidden rounded-md border border-primary/10 bg-black/50">
                      {/* Base64 Image Render - Optimally should use Next/Image but base64 is requested */}
                      <img
                        src={check.screenshot_base64 || "/placeholder.svg"}
                        alt="Proof"
                        className="object-cover w-full h-full opacity-70 group-hover:opacity-100 transition-opacity"
                      />
                    </div>
                  )}
                  <div className="flex items-center justify-between text-xs text-muted-foreground font-mono">
                    <span>ID: {check.id.slice(0, 8)}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {new Date(check.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-3 text-center py-12 text-muted-foreground border border-dashed border-primary/20 rounded-lg bg-primary/5">
            <p className="font-mono">NO_DATA_FOUND: System oczekuje na pierwsze wpisy...</p>
          </div>
        )}
      </div>
    </section>
  )
}
