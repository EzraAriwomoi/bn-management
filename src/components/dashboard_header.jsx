"use client"

import { HelpCircle, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"

export function DashboardHeader() {

  return (
    <header className="bg-primary text-primary-foreground border-b border-border/10 sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex items-center justify-between">
        <div className="min-w-0 flex-1">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold truncate">Rental Manager</h1>
          <p className="text-xs sm:text-sm text-primary-foreground/80 mt-1 truncate">Manage your Airbnb properties</p>
        </div>
        <div className="flex gap-1 sm:gap-2 flex-shrink-0 ml-4">
          <Button
            variant="ghost"
            size="icon"
            className="text-primary-foreground hover:bg-primary/20 h-9 w-9 sm:h-10 sm:w-10"
          >
            <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-primary-foreground hover:bg-primary/20 h-9 w-9 sm:h-10 sm:w-10"
          >
            <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
          </Button>
        </div>
      </div>
    </header>
  )
}
