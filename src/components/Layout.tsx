import type { ReactNode } from "react"
import { Footer } from "./Footer"
import { Header } from "./Header"

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6">
        {children}
      </main>
      <Footer />
    </div>
  )
}
