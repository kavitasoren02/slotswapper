import { createContext, useState, useCallback } from "react"

export const EventsContext = createContext()

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"

export const EventsProvider = ({ children }) => {
  const [events, setEvents] = useState([])
  const [swappableSlots, setSwappableSlots] = useState([])
  const [incomingRequests, setIncomingRequests] = useState([])
  const [outgoingRequests, setOutgoingRequests] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const getToken = () => localStorage.getItem("token")

  // ✅ Fetch Events
  const fetchEvents = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`${BACKEND_URL}/api/events`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      })
      if (!response.ok) throw new Error("Failed to fetch events")
      const data = await response.json()
      setEvents(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  // ✅ Create Event
  const createEvent = useCallback(
    async (title, startTime, endTime) => {
      setError(null)
      try {
        const response = await fetch(`${BACKEND_URL}/api/events`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
          },
          body: JSON.stringify({ title, startTime, endTime }),
        })
        if (!response.ok) throw new Error("Failed to create event")
        const newEvent = await response.json()
        setEvents([...events, newEvent])
        return newEvent
      } catch (err) {
        setError(err.message)
        throw err
      }
    },
    [events],
  )

  // ✅ Update Event Status
  const updateEventStatus = useCallback(
    async (eventId, status) => {
      setError(null)
      try {
        const response = await fetch(`${BACKEND_URL}/api/events/${eventId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
          },
          body: JSON.stringify({ status }),
        })
        if (!response.ok) throw new Error("Failed to update event")
        const updatedEvent = await response.json()
        setEvents(events.map((e) => (e._id === eventId ? updatedEvent : e)))
        return updatedEvent
      } catch (err) {
        setError(err.message)
        throw err
      }
    },
    [events],
  )

  // ✅ Delete Event
  const deleteEvent = useCallback(
    async (eventId) => {
      setError(null)
      try {
        const response = await fetch(`${BACKEND_URL}/api/events/${eventId}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${getToken()}` },
        })
        if (!response.ok) throw new Error("Failed to delete event")
        setEvents(events.filter((e) => e._id !== eventId))
      } catch (err) {
        setError(err.message)
        throw err
      }
    },
    [events],
  )

  // ✅ Fetch Swappable Slots
  const fetchSwappableSlots = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`${BACKEND_URL}/api/swaps/swappable-slots`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      })
      if (!response.ok) throw new Error("Failed to fetch swappable slots")
      const data = await response.json()
      setSwappableSlots(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  // ✅ Create Swap Request
  const createSwapRequest = useCallback(
    async (mySlotId, theirSlotId) => {
      setError(null)
      try {
        const response = await fetch(`${BACKEND_URL}/api/swaps/swap-request`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
          },
          body: JSON.stringify({ mySlotId, theirSlotId }),
        })
        if (!response.ok) throw new Error("Failed to create swap request")
        const swapRequest = await response.json()
        setOutgoingRequests([...outgoingRequests, swapRequest])
        await fetchSwappableSlots()
        await fetchEvents()
        return swapRequest
      } catch (err) {
        setError(err.message)
        throw err
      }
    },
    [outgoingRequests],
  )

  // ✅ Fetch Incoming Requests
  const fetchIncomingRequests = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`${BACKEND_URL}/api/swaps/incoming-requests`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      })
      if (!response.ok) throw new Error("Failed to fetch incoming requests")
      const data = await response.json()
      setIncomingRequests(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  // ✅ Fetch Outgoing Requests
  const fetchOutgoingRequests = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`${BACKEND_URL}/api/swaps/outgoing-requests`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      })
      if (!response.ok) throw new Error("Failed to fetch outgoing requests")
      const data = await response.json()
      setOutgoingRequests(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  // ✅ Respond to Swap Request
  const respondToSwapRequest = useCallback(async (requestId, accept) => {
    setError(null)
    try {
      const response = await fetch(`${BACKEND_URL}/api/swaps/swap-response/${requestId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ accept }),
      })
      if (!response.ok) throw new Error("Failed to respond to swap request")
      await fetchIncomingRequests()
      await fetchEvents()
      return await response.json()
    } catch (err) {
      setError(err.message)
      throw err
    }
  }, [])

  return (
    <EventsContext.Provider
      value={{
        events,
        swappableSlots,
        incomingRequests,
        outgoingRequests,
        loading,
        error,
        fetchEvents,
        createEvent,
        updateEventStatus,
        deleteEvent,
        fetchSwappableSlots,
        createSwapRequest,
        fetchIncomingRequests,
        fetchOutgoingRequests,
        respondToSwapRequest,
      }}
    >
      {children}
    </EventsContext.Provider>
  )
}
