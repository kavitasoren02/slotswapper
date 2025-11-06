"use client"

import { useContext } from "react"
import { AuthContext } from "../context/AuthContext"
import { Link } from "react-router-dom"

const Navbar = () => {
  const { user, logout } = useContext(AuthContext)

  if (!user) return null

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <div className="text-xl font-bold text-blue-600">SlotSwapper</div>
        <div className="flex gap-4 items-center">
          <Link to="/" className="hover:text-blue-600">
            Dashboard
          </Link>
          <Link to="/marketplace" className="hover:text-blue-600">
            Marketplace
          </Link>
          <Link to="/requests" className="hover:text-blue-600">
            Requests
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">{user.name}</span>
            <button
              onClick={logout}
              className="px-4 py-2 rounded-lg font-medium transition-all cursor-pointer text-sm bg-gray-200 text-gray-900 hover:bg-gray-300"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
