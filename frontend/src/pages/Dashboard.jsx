
import { useContext, useEffect, useState } from "react"
import { EventsContext } from "../context/EventsContext"

const Dashboard = () => {
  const { events, fetchEvents, createEvent, updateEventStatus, deleteEvent, error } = useContext(EventsContext)
  const [title, setTitle] = useState("")
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [successMsg, setSuccessMsg] = useState("")

  useEffect(() => {
    fetchEvents()
  }, [])

  const handleCreateEvent = async (e) => {
    e.preventDefault()
    try {
      await createEvent(title, startTime, endTime)
      setTitle("")
      setStartTime("")
      setEndTime("")
      setSuccessMsg("Event created successfully!")
      setTimeout(() => setSuccessMsg(""), 3000)
    } catch (err) {
      console.error(err)
    }
  }

  const toggleSwappable = async (eventId, currentStatus) => {
    const newStatus = currentStatus === "BUSY" ? "SWAPPABLE" : "BUSY"
    try {
      await updateEventStatus(eventId, newStatus)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">My Calendar</h1>

      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-8">
        <h2 className="text-xl font-bold mb-4 text-gray-900">Create New Event</h2>
        <form onSubmit={handleCreateEvent} className="space-y-4">
          {error && <div className="bg-red-100 text-red-700 px-4 py-2 rounded-lg">{error}</div>}
          {successMsg && <div className="bg-green-100 text-green-700 px-4 py-2 rounded-lg">{successMsg}</div>}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Event Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
              <input
                type="datetime-local"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
              <input
                type="datetime-local"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            className="px-4 py-2 rounded-lg font-medium transition-all cursor-pointer bg-blue-600 text-white hover:bg-blue-700"
          >
            Create Event
          </button>
        </form>
      </div>

      {/* Events List */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-gray-900">Your Events</h2>
        {events.length === 0 ? (
          <p className="text-gray-600">No events yet. Create one to get started!</p>
        ) : (
          events.map((event) => (
            <div
              key={event._id}
              className="bg-white rounded-lg border border-gray-200 p-4 flex justify-between items-start"
            >
              <div className="flex-1">
                <h3 className="font-bold text-gray-900">{event.title}</h3>
                <p className="text-sm text-gray-600">
                  {new Date(event.startTime).toLocaleString()} - {new Date(event.endTime).toLocaleString()}
                </p>
                <span
                  className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium ${
                    event.status === "BUSY"
                      ? "bg-gray-200 text-gray-800"
                      : event.status === "SWAPPABLE"
                        ? "bg-green-200 text-green-800"
                        : "bg-yellow-200 text-yellow-800"
                  }`}
                >
                  {event.status}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => toggleSwappable(event._id, event.status)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all cursor-pointer text-sm ${event.status === "BUSY" ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-gray-200 text-gray-900 hover:bg-gray-300"}`}
                >
                  {event.status === "BUSY" ? "Make Swappable" : "Make Busy"}
                </button>
                <button
                  onClick={() => deleteEvent(event._id)}
                  className="px-4 py-2 rounded-lg font-medium transition-all cursor-pointer text-sm bg-red-600 text-white hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default Dashboard
