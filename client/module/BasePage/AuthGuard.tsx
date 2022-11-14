import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import { GenericProviderProps, userType } from "./type";

const routeException = [
  '/login'
]

export const UserContext = React.createContext<userType | null>({});

export const AuthGuard = ({children}: GenericProviderProps) => {
  const router = useRouter();
  const [user, setUser] = useState({})

  useEffect(() => {
    const localUser = localStorage.getItem('user')
    const isExcepted = routeException.reduce((result, route) => {
      return route === router.pathname || result
    }, false)

    if (!localUser && !isExcepted) {
      router.push('/login')
    } else if (localUser && !isExcepted) {
      try {
        setUser(JSON.parse(localUser))
      } catch {
        router.push('/login')
      }
    }

  }, [router])

  return <UserContext.Provider value={user}>{children}</UserContext.Provider>
}