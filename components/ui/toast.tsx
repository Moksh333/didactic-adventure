"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

const ToastContext = React.createContext<any>(null)

export function useToast() {
  return React.useContext(ToastContext)
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<any[]>([])

  function toast({ title, description, variant = "default" }: any) {
    const id = Math.random().toString(36).slice(2)

    setToasts((prev) => [
      ...prev,
      { id, title, description, variant },
    ])

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 3500)
  }

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}

      <div className="fixed bottom-4 right-4 flex flex-col gap-2 z-50">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={cn(
              "rounded-md px-4 py-3 shadow-lg bg-background border w-72 animate-in fade-in slide-in-from-right",
              t.variant === "destructive" && "border-red-500 text-red-600"
            )}
          >
            <p className="font-semibold">{t.title}</p>
            {t.description && (
              <p className="text-sm opacity-80">{t.description}</p>
            )}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
