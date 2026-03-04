"use client"

import { useState } from "react"
import { cn } from "@/src/lib/utils"
import { Menu } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/src/components/ui/sheet"
import { Button } from "@/src/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar"
import { Sidebar } from "./Sidebar";
import { sidebarItems } from "./sidebar-items"

interface AppLayoutProps {
  activeSection: string
  onSectionChange: (id: string) => void
  darkMode: boolean
  onToggleDarkMode: () => void
  children: React.ReactNode
}

export function AppLayout({
  activeSection,
  onSectionChange,
  darkMode,
  onToggleDarkMode,
  children,
}: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleSelect = (id: string) => {
    onSectionChange(id)
    setSidebarOpen(false) // cierra en mobile
  }

  return (
    <div className={cn("flex h-screen", darkMode && "dark")}>

      {/* Sidebar desktop — visible en md en adelante */}
      <div className="hidden md:flex">
        <Sidebar
          items={sidebarItems}
          activeSection={activeSection}
          onSelect={handleSelect}
        />
      </div>

      {/* Área principal */}
      <div className="flex flex-col flex-1 overflow-hidden">

        {/* Header */}
        <header className="flex items-center justify-between px-4 py-3 border-b bg-card">

          {/* Hamburger — solo mobile */}
          <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <Sidebar
                items={sidebarItems}
                activeSection={activeSection}
                onSelect={handleSelect}
              />
            </SheetContent>
          </Sheet>

          <span className="font-semibold text-sm">Mis Finanzas</span>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={onToggleDarkMode}>
              {darkMode ? "☀️" : "🌙"}
            </Button>
            <Avatar className="w-8 h-8">
              <AvatarImage src="" />
              <AvatarFallback>JG</AvatarFallback>
            </Avatar>
          </div>
        </header>

        {/* Contenido de la sección activa */}
        <main className="flex-1 overflow-auto p-4 bg-background">
          {children}
        </main>

      </div>
    </div>
  )
}
