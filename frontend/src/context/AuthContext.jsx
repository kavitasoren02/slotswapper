
import { useEffect } from "react"
import { createContext, useState, useCallback } from "react"

export const AuthContext = createContext()

const getToken = () => localStorage.getItem("token")
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem("token"))
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const signup = useCallback(async (name, email, password) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error)
      }

      const data = await response.json()
      localStorage.setItem("token", data.token)
      setToken(data.token)
      setUser(data.user)
      return data
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const login = useCallback(async (email, password) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error)
      }

      const data = await response.json()
      localStorage.setItem("token", data.token)
      setToken(data.token)
      setUser(data.user)
      return data
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const selfLogin = useCallback(async () => {
    setLoading(true);
    setError(null);
    try{
      const res = await fetch(`${BACKEND_URL}/api/auth/me`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}` 
        }
      })
      const data = await res.json();
      setUser(data.user)
      console.log({
        toke: getToken()
      })
      setToken(getToken())
    }
    catch (error) {

    }
    finally{
      setLoading(false);
    }
  }, [])

  useEffect(() => {
    selfLogin()
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem("token")
    setToken(null)
    setUser(null)
    setError(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, token, loading, error, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
