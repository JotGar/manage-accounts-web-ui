"use client"

import { cn } from "@/src/lib/utils"
import { LucideIcon } from "lucide-react"

interface SidebarItem {
  id: string
  label: string
  icon: LucideIcon
}

interface SidebarProps {
  items: SidebarItem[]
  activeSection: string
  onSelect: (id: string) => void
}

export function Sidebar({ items, activeSection, onSelect }: SidebarProps) {
  return (
    <aside className="flex flex-col w-64 h-screen bg-card border-r p-4 gap-1">
      {items.map((item) => {
        const Icon = item.icon
        return (
          <button
            key={item.id}
            onClick={() => onSelect(item.id)}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors w-full text-left",
              activeSection === item.id
                ? "bg-primary text-primary-foreground"
                : "hover:bg-muted text-muted-foreground"
            )}
          >
            <Icon className="w-4 h-4" />
            {item.label}
          </button>
        )
      })}
    </aside>
  )
}
