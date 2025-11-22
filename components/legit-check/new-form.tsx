"use client"

import type React from "react"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Loader2, Star, Plus } from "lucide-react"
import { convertToBase64 } from "@/lib/utils"

export function NewLegitCheckForm({ userId }: { userId: string }) {
  const [loading, setLoading] = useState(false)
  const [rating, setRating] = useState(5)
  const [screenshot, setScreenshot] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)

    const { error } = await supabase.from("legit_checks").insert({
      author_id: userId,
      product_name: formData.get("product_name"),
      product_description: formData.get("product_description"),
      additional_data: formData.get("additional_data"),
      wait_time: formData.get("wait_time"),
      rating: rating,
      screenshot_base64: screenshot,
    })

    if (error) {
      alert("Błąd: " + error.message)
      setLoading(false)
    } else {
      router.push("/legit-checks")
      router.refresh()
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      try {
        const base64 = await convertToBase64(file)
        setScreenshot(base64)
      } catch (err) {
        console.error(err)
        alert("Błąd przetwarzania pliku")
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="product_name">Nazwa Produktu / Usługi *</Label>
        <Input id="product_name" name="product_name" required className="bg-secondary/10 border-primary/30" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="product_description">Opis</Label>
        <Textarea
          id="product_description"
          name="product_description"
          className="bg-secondary/10 border-primary/30 min-h-[100px]"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="wait_time">Czas Oczekiwania</Label>
          <Input
            id="wait_time"
            name="wait_time"
            placeholder="np. 2 dni"
            className="bg-secondary/10 border-primary/30"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="additional_data">Dodatkowe Dane (Opcjonalne)</Label>
          <Input id="additional_data" name="additional_data" className="bg-secondary/10 border-primary/30" />
        </div>
      </div>

      <div className="space-y-4 p-4 border border-primary/20 rounded bg-primary/5">
        <Label>Ocena: {rating}/5</Label>
        <div className="flex items-center gap-4">
          <Slider value={[rating]} min={1} max={5} step={1} onValueChange={(v) => setRating(v[0])} className="flex-1" />
          <div className="flex text-yellow-500">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`h-4 w-4 ${i < rating ? "fill-current" : "text-muted/20"}`} />
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="screenshot">Dowód (Screenshot)</Label>
        <div className="flex items-center gap-4">
          <Input
            id="screenshot"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="cursor-pointer file:bg-primary file:text-primary-foreground file:border-0 file:rounded-sm file:mr-4 hover:file:bg-primary/90"
          />
        </div>
        {screenshot && (
          <div className="mt-2 h-20 w-20 overflow-hidden rounded border border-primary/50">
            <img src={screenshot || "/placeholder.svg"} alt="Preview" className="h-full w-full object-cover" />
          </div>
        )}
      </div>

      <Button
        type="submit"
        className="w-full bg-primary text-primary-foreground hover:shadow-[0_0_15px_var(--primary)] transition-all"
        disabled={loading}
      >
        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
        DODAJ WPIS DO BAZY
      </Button>
    </form>
  )
}
