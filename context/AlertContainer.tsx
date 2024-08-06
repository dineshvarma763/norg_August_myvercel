"use client"

import Alert from "@/sites/norg-website/components/Alert"
import React, { createContext, useEffect, useRef, useState } from "react"

export const AlertContext = createContext<{
  success: (message: any, onClose?: any) => void
  error: (message: any, onClose?: any) => void
  warning: (message: any, onClose?: any) => void
  info: (message: any, onClose?: any) => void
} | null>(null)

export function AlertContainer({ children }: { children: React.ReactNode }) {
  const [alerts, setAlerts] = useState<any[]>([])
  const timers = useRef<any[]>([])

  const showAlert = (type: string, message: any, onClose: () => void) => {
    const id = Math.random()
    const newAlert = {
      id,
      type,
      message,
      onDismiss: () => {
        if (onClose) onClose()
        dismissAlert(id)
      },
    }

    setAlerts((prev) => [...prev, newAlert])
    const timeout: any = setTimeout(() => dismissAlert(id, timeout), 3000)
    timers.current.push(timeout)
  }

  const dismissAlert = (id: number, timeout = -1) => {
    setAlerts((prev) => {
      return prev.filter((alert) => alert.id !== id)
    })

    if (timeout > -1) {
      clearTimeout(timeout)
      timers.current = timers.current.filter((t) => t !== timeout)
    }
  }

  useEffect(() => {
    return () => {
      timers.current.forEach((timer) => clearTimeout(timer))
    }
  }, [])

  const success = (message: any, onClose: any) =>
    showAlert("success", message, onClose)
  const error = (message: any, onClose: any) =>
    showAlert("error", message, onClose)
  const warning = (message: any, onClose: any) =>
    showAlert("warning", message, onClose)
  const info = (message: any, onClose: any) =>
    showAlert("info", message, onClose)

  return (
    <AlertContext.Provider value={{ success, error, warning, info }}>
      {children}
      <div
        className="flex flex-col gap-5"
        style={{
          position: "fixed",
          top: `20px`,
          right: "20px",
          zIndex: "1000",
        }}
      >
        {alerts.map((alert, index) => (
          <Alert
            className="flex-1 py-3"
            key={`alert-${index}-${alert.id}`}
            type={alert.type}
            onDismiss={alert.onDismiss}
          >
            {alert.message}
          </Alert>
        ))}
      </div>
    </AlertContext.Provider>
  )
}
