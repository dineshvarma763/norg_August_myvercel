"use client"

import React from "react"
import { ThemeProvider as NextThemeProvider } from "next-themes"

export default function ThemeProvider({ children }) {
  return (
    // <NextThemeProvider attribute="class" defaultTheme="system" enableSystem>
    <NextThemeProvider attribute="class" defaultTheme="light" enableSystem>
      {children}
    </NextThemeProvider>
  )
}
