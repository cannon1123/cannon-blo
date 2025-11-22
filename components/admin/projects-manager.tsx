"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Trash2, Save } from "lucide-react"

export function ProjectsManager() {
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    tags: "",
    preview_html: "",
    files: {
      "index.html": "",
      "style.css": "",
      "script.js": "",
    },
  })
  const supabase = createClient()

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    const { data } = await supabase.from("code_projects").select("*").order("created_at", { ascending: false })

    if (data) {
      setProjects(data)
    }
    setLoading(false)
  }

  const handleSave = async () => {
    if (!formData.title.trim()) {
      alert("Tytuł projektu jest wymagany")
      return
    }

    const tagsArray = formData.tags
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0)

    const projectData = {
      title: formData.title,
      description: formData.description,
      tags: tagsArray,
      preview_html: formData.preview_html,
      files: formData.files,
    }

    if (editing) {
      // Update
      const { error } = await supabase.from("code_projects").update(projectData).eq("id", editing)

      if (!error) {
        setEditing(null)
        fetchProjects()
        resetForm()
      }
    } else {
      // Insert
      const { error } = await supabase.from("code_projects").insert([projectData])

      if (!error) {
        fetchProjects()
        resetForm()
      }
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm("Czy na pewno chcesz usunąć ten projekt?")) {
      await supabase.from("code_projects").delete().eq("id", id)
      fetchProjects()
    }
  }

  const handleEdit = (project: any) => {
    setFormData({
      title: project.title,
      description: project.description || "",
      tags: project.tags?.join(", ") || "",
      preview_html: project.preview_html || "",
      files: project.files || { "index.html": "", "style.css": "", "script.js": "" },
    })
    setEditing(project.id)
  }

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      tags: "",
      preview_html: "",
      files: {
        "index.html": "",
        "style.css": "",
        "script.js": "",
      },
    })
    setEditing(null)
  }

  const handleFileChange = (fileName: string, content: string) => {
    setFormData({
      ...formData,
      files: {
        ...formData.files,
        [fileName]: content,
      },
    })
  }

  return (
    <div className="space-y-6">
      <div className="border border-primary/30 rounded-lg p-6 bg-background/50 backdrop-blur">
        <h3 className="text-xl font-bold text-primary mb-4">{editing ? "Edytuj projekt" : "Dodaj nowy projekt"}</h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-primary/80 mb-2">Tytuł *</label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="np. Custom Login Button"
              className="border-primary/30"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-primary/80 mb-2">Opis</label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Krótki opis projektu"
              className="border-primary/30"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-primary/80 mb-2">Tagi (oddzielone przecinkami)</label>
            <Input
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              placeholder="button, login, custom"
              className="border-primary/30"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-primary/80 mb-2">Podgląd HTML</label>
            <Textarea
              value={formData.preview_html}
              onChange={(e) => setFormData({ ...formData, preview_html: e.target.value })}
              placeholder="Wklej pełny HTML do podglądu w iframe"
              className="border-primary/30 font-mono text-xs h-32"
            />
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-semibold text-primary/80 mb-2">Pliki projektu</label>

            {Object.entries(formData.files).map(([fileName, content]) => (
              <div key={fileName}>
                <label className="block text-xs text-muted-foreground mb-1">{fileName}</label>
                <Textarea
                  value={content as string}
                  onChange={(e) => handleFileChange(fileName, e.target.value)}
                  placeholder={`Wklej zawartość ${fileName}`}
                  className="border-primary/30 font-mono text-xs h-24"
                />
              </div>
            ))}
          </div>

          <div className="flex gap-3 pt-4">
            <Button onClick={handleSave} className="gap-2">
              <Save className="h-4 w-4" />
              {editing ? "Aktualizuj" : "Dodaj"} projekt
            </Button>
            {editing && (
              <Button onClick={resetForm} variant="outline" className="gap-2 bg-transparent">
                Anuluj
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Lista projektów */}
      <div>
        <h3 className="text-xl font-bold text-primary mb-4">Istniejące projekty</h3>
        {loading ? (
          <p className="text-muted-foreground">Ładowanie...</p>
        ) : projects.length === 0 ? (
          <p className="text-muted-foreground">Brak projektów.</p>
        ) : (
          <div className="space-y-3">
            {projects.map((project) => (
              <div
                key={project.id}
                className="border border-primary/30 rounded-lg p-4 bg-background/50 backdrop-blur flex items-center justify-between"
              >
                <div>
                  <p className="font-semibold text-primary">{project.title}</p>
                  <p className="text-xs text-muted-foreground">{project.description}</p>
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => handleEdit(project)} variant="outline" size="sm" className="border-primary/30">
                    Edytuj
                  </Button>
                  <Button
                    onClick={() => handleDelete(project.id)}
                    variant="outline"
                    size="sm"
                    className="border-red-500/30 text-red-500 hover:bg-red-500/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
