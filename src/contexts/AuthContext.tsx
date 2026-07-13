import { useQuery } from "@tanstack/react-query"
import { createContext } from "react"
import { BeatLoader } from "react-spinners"
import mockUser from "../mocks/user.json"
import api from "../services/api"
import type { User } from "../types/User"

interface AuthContextProps {
  user: User | null | undefined
}

const ENV = import.meta.env.VITE_ENV

// Base do SSO da intranet (login do BB).
const SSO_LOGIN_URL = "https://login.intranet.bb.com.br/sso/XUI/#login/&goto="

export const AuthContext = createContext({} as AuthContextProps)

export default function AuthContextProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: user, isLoading } = useQuery<User | null>({
    queryKey: ["auth-user"],
    queryFn: getAuth,
  })

  async function getAuth() {
    // Em desenvolvimento (VITE_ENV) usa o usuário mockado, sem chamar o SSO.
    if (ENV) {
      return JSON.parse(JSON.stringify(mockUser))
    }

    const user = await api
      .get("/auth")
      .then((res) => res.data)
      .catch(() => {
        // Preserva o caminho atual no `goto` para o usuário voltar à mesma
        // página após o login (em vez de cair sempre na raiz).
        const goto = encodeURIComponent(window.location.href)
        window.location.href = `${SSO_LOGIN_URL}${goto}`
        return null
      })

    return user
  }

  if (isLoading)
    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center">
        <BeatLoader color="#005f96" />
      </div>
    )

  return <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
}
