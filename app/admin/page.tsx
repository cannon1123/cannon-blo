import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Settings, Users, Code2 } from "lucide-react"
import { AdminProfileEditor } from "@/components/admin/profile-editor"
import { AdminUserManager } from "@/components/admin/user-manager"
import { ProjectsManager } from "@/components/admin/projects-manager"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default async function AdminPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  if (!profile?.is_admin) {
    return (
      <div className="container mx-auto py-20 text-center">
        <h1 className="text-2xl text-red-500 font-bold mb-4">ACCESS_DENIED</h1>
        <p className="text-muted-foreground">Tylko administratorzy mają dostęp do tego panelu.</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-10 space-y-8">
      <div className="flex items-center gap-4">
        <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center border-2 border-primary animate-pulse">
          <Settings className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-primary text-glow">ADMIN_PANEL</h1>
          <p className="text-muted-foreground font-mono text-sm">Kontrola systemu i uprawnień</p>
        </div>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-secondary/20">
          <TabsTrigger
            value="profile"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <Settings className="h-4 w-4 mr-2" />
            Mój Profil
          </TabsTrigger>
          <TabsTrigger
            value="users"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <Users className="h-4 w-4 mr-2" />
            Zarządzanie Użytkownikami
          </TabsTrigger>
          <TabsTrigger
            value="projects"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <Code2 className="h-4 w-4 mr-2" />
            Projekty
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-6">
          <Card className="border-primary/50 bg-black/50 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-primary text-glow">EDYCJA PROFILU</CardTitle>
            </CardHeader>
            <CardContent>
              <AdminProfileEditor profile={profile} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="mt-6">
          <Card className="border-primary/50 bg-black/50 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-primary text-glow">UPRAWNIENIA UŻYTKOWNIKÓW</CardTitle>
            </CardHeader>
            <CardContent>
              <AdminUserManager currentUserId={user.id} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="projects" className="mt-6">
          <Card className="border-primary/50 bg-black/50 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-primary text-glow">ZARZĄDZANIE PROJEKTAMI</CardTitle>
            </CardHeader>
            <CardContent>
              <ProjectsManager />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
