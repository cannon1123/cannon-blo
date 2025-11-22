"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { ArrowLeft, Copy, Download } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function ProjectDetailPage() {
  const params = useParams()
  const projectId = params.id as string
  const [project, setProject] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<"preview" | "code">("preview")
  const [copiedFile, setCopiedFile] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    const fetchProject = async () => {
      const { data, error } = await supabase.from("code_projects").select("*").eq("id", projectId).single()

      if (!error && data) {
        setProject(data)
      }
      setLoading(false)
    }

    fetchProject()
  }, [projectId])

  const downloadFile = (fileName: string, content: string) => {
    const element = document.createElement("a")
    element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(content))
    element.setAttribute("download", fileName)
    element.style.display = "none"
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  const downloadProject = async () => {
    const files = project.files || {}

    // Pobierz wszystkie pliki
    Object.entries(files).forEach(([fileName, content]: [string, any]) => {
      downloadFile(fileName, content)
    })
  }

  const copyToClipboard = (content: string, fileName: string) => {
    navigator.clipboard.writeText(content)
    setCopiedFile(fileName)
    setTimeout(() => setCopiedFile(null), 2000)
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 flex items-center justify-center h-64">
        <div className="text-primary text-glow animate-pulse">Ładowanie projektu...</div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Projekt nie znaleziony.</p>
          <Link href="/projects">
            <Button variant="outline">Wróć do projektów</Button>
          </Link>
        </div>
      </div>
    )
  }

  const files = project.files || {}
  const fileEntries = Object.entries(files)

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-8">
        <Link href="/projects" className="flex items-center gap-2 text-primary/70 hover:text-primary mb-4">
          <ArrowLeft className="h-4 w-4" />
          <span>Wróć do projektów</span>
        </Link>

        <h1 className="text-4xl font-bold text-primary text-glow mb-4">{project.title}</h1>
        <p className="text-muted-foreground max-w-2xl">{project.description}</p>

        {project.tags && project.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {project.tags.map((tag: string) => (
              <span key={tag} className="px-3 py-1 text-sm rounded border border-secondary/50 text-secondary">
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="mt-6 flex gap-3">
          <Button onClick={downloadProject} className="gap-2">
            <Download className="h-4 w-4" />
            Pobierz wszystkie pliki
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-8 flex gap-4 border-b border-primary/20">
        <button
          onClick={() => setActiveTab("preview")}
          className={`px-4 py-2 font-semibold transition-colors ${
            activeTab === "preview"
              ? "text-primary border-b-2 border-primary"
              : "text-muted-foreground hover:text-primary"
          }`}
        >
          Podgląd
        </button>
        <button
          onClick={() => setActiveTab("code")}
          className={`px-4 py-2 font-semibold transition-colors ${
            activeTab === "code" ? "text-primary border-b-2 border-primary" : "text-muted-foreground hover:text-primary"
          }`}
        >
          Kod
        </button>
      </div>

      {/* Content */}
      {activeTab === "preview" && project.preview_html && (
        <div className="border border-primary/30 rounded-lg overflow-hidden bg-background/50 backdrop-blur">
          <iframe
            srcDoc={project.preview_html}
            className="w-full h-[600px] border-none"
            sandbox="allow-scripts allow-same-origin"
          />
        </div>
      )}

      {activeTab === "code" && (
        <div className="space-y-4">
          {fileEntries.length > 0 ? (
            fileEntries.map(([fileName, content]: [string, any]) => (
              <div
                key={fileName}
                className="border border-primary/30 rounded-lg bg-background/50 backdrop-blur overflow-hidden"
              >
                <div className="flex items-center justify-between bg-primary/10 px-4 py-3 border-b border-primary/20">
                  <code className="font-mono text-sm text-primary font-semibold">{fileName}</code>
                  <div className="flex gap-2">
                    <button
                      onClick={() => copyToClipboard(content, fileName)}
                      className="p-2 rounded hover:bg-primary/20 transition-colors"
                      title="Kopiuj"
                    >
                      <Copy className="h-4 w-4 text-primary/70" />
                    </button>
                    <button
                      onClick={() => downloadFile(fileName, content)}
                      className="p-2 rounded hover:bg-primary/20 transition-colors"
                      title="Pobierz"
                    >
                      <Download className="h-4 w-4 text-primary/70" />
                    </button>
                  </div>
                </div>
                <pre className="p-4 overflow-x-auto text-sm text-muted-foreground bg-background/80 max-h-96">
                  <code>{content}</code>
                </pre>
              </div>
            ))
          ) : (
            <p className="text-muted-foreground">Brak plików do wyświetlenia.</p>
          )}
        </div>
      )}
    </div>
  )
}
