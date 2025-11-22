"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { Code2, ExternalLink } from "lucide-react"

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchProjects = async () => {
      const { data, error } = await supabase.from("code_projects").select("*").order("created_at", { ascending: false })

      if (!error && data) {
        setProjects(data)
      }
      setLoading(false)
    }

    fetchProjects()
  }, [])

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-primary text-glow mb-4">CODE_PROJECTS</h1>
        <p className="text-muted-foreground">Kolekcja praktycznych snippetów i komponentów do pobrania i użytku.</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-primary text-glow animate-pulse">Ładowanie projektów...</div>
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-12">
          <Code2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Brak dostępnych projektów. Wróć później!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Link
              key={project.id}
              href={`/projects/${project.id}`}
              className="group relative overflow-hidden rounded-lg border border-primary/30 bg-background/50 p-6 backdrop-blur transition-all duration-300 hover:border-primary hover:bg-primary/5 hover:shadow-[0_0_20px_rgba(0,243,255,0.3)]"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="relative z-10">
                <h3 className="text-lg font-semibold text-primary group-hover:text-glow mb-2 line-clamp-2">
                  {project.title}
                </h3>

                <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{project.description || "Brak opisu"}</p>

                {project.tags && project.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.slice(0, 3).map((tag: string) => (
                      <span
                        key={tag}
                        className="inline-block px-2 py-1 text-xs rounded border border-secondary/50 text-secondary"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-2 text-sm text-primary/70 group-hover:text-primary">
                  <span>Podgląd</span>
                  <ExternalLink className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
