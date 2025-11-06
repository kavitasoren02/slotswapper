import { useState, useContext } from "react"
import { AuthContext } from "../context/AuthContext"
import { useNavigate, Link } from "react-router-dom"

const Signup = () => {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const { signup, loading } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    try {
      await signup(name, email, password);
      navigate("/")
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 px-4 py-10">
      <div className="w-full max-w-lg bg-white/95 backdrop-blur-xl border border-blue-100 shadow-2xl rounded-3xl p-10 sm:p-14 transition-transform duration-300 hover:scale-[1.01]">
        <div className="text-center mb-10 px-4">
          <h1 className="text-5xl font-extrabold text-blue-600 tracking-tight drop-shadow-sm">
            SlotSwapper
          </h1>
          <p className="text-gray-500 mt-3 text-lg">Create your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 px-4 sm:px-8">
          {error && (
            <div className="bg-red-50 text-red-600 border border-red-200 px-5 py-3 rounded-lg text-sm text-center shadow-sm">
              {error}
            </div>
          )}

          {/* Name */}
          <div className="space-y-3 px-2 sm:px-4">
            <label className="block text-base font-semibold text-gray-700 pl-1">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl text-gray-800 text-lg font-medium focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 placeholder-gray-400 transition-all duration-200 shadow-sm"
              placeholder="Enter your full name"
              required
            />
          </div>

          {/* Email */}
          <div className="space-y-3 px-2 sm:px-4">
            <label className="block text-base font-semibold text-gray-700 pl-1">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl text-gray-800 text-lg font-medium focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 placeholder-gray-400 transition-all duration-200 shadow-sm"
              placeholder="you@example.com"
              required
            />
          </div>

          {/* Password */}
          <div className="space-y-3 px-2 sm:px-4">
            <label className="block text-base font-semibold text-gray-700 pl-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl text-gray-800 text-lg font-medium focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 placeholder-gray-400 transition-all duration-200 shadow-sm"
              placeholder="Enter a strong password"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-4 mt-5 text-lg font-semibold text-white rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-blue-300 transition-all duration-300 disabled:opacity-70"
            disabled={loading}
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <p className="text-center text-gray-600 text-base mt-10 px-6 sm:px-10">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-600 font-semibold hover:underline hover:text-blue-700 transition-colors duration-200"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Signup
