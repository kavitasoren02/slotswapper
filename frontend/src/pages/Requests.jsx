
import { useContext, useEffect } from "react"
import { EventsContext } from "../context/EventsContext"

// const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"

const Requests = () => {
  const {
    incomingRequests,
    outgoingRequests,
    fetchIncomingRequests,
    fetchOutgoingRequests,
    respondToSwapRequest,
    error,
  } = useContext(EventsContext)

  useEffect(() => {
    fetchIncomingRequests()
    fetchOutgoingRequests()
  }, [])

  const handleAccept = async (requestId) => {
    try {
      await respondToSwapRequest(requestId, true)
    } catch (err) {
      console.error(err)
    }
  }

  const handleReject = async (requestId) => {
    try {
      await respondToSwapRequest(requestId, false)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">Swap Requests</h1>

      {error && <div className="bg-red-100 text-red-700 px-4 py-2 rounded-lg mb-4">{error}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Incoming Requests */}
        <div>
          <h2 className="text-xl font-bold mb-4 text-gray-900">Incoming Requests</h2>
          <div className="space-y-4">
            {incomingRequests.length === 0 ? (
              <p className="text-gray-600">No incoming requests.</p>
            ) : (
              incomingRequests.map((request) => (
                <div key={request._id} className="bg-white rounded-lg border border-gray-200 p-4">
                  <p className="text-sm font-medium text-gray-600 mb-2">From: {request.requesterUserId?.name}</p>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-600">They're offering:</p>
                      <p className="font-bold text-gray-900">{request.requesterSlotId?.title}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(request.requesterSlotId?.startTime).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">For your:</p>
                      <p className="font-bold text-gray-900">{request.receiverSlotId?.title}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(request.receiverSlotId?.startTime).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAccept(request._id)}
                      className="flex-1 px-4 py-2 rounded-lg font-medium transition-all cursor-pointer text-sm bg-green-600 text-white hover:bg-green-700"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleReject(request._id)}
                      className="flex-1 px-4 py-2 rounded-lg font-medium transition-all cursor-pointer text-sm bg-red-600 text-white hover:bg-red-700"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Outgoing Requests */}
        <div>
          <h2 className="text-xl font-bold mb-4 text-gray-900">Outgoing Requests</h2>
          <div className="space-y-4">
            {outgoingRequests.length === 0 ? (
              <p className="text-gray-600">No outgoing requests.</p>
            ) : (
              outgoingRequests.map((request) => (
                <div key={request._id} className="bg-white rounded-lg border border-gray-200 p-4">
                  <p className="text-sm font-medium text-gray-600 mb-2">To: {request.receiverUserId?.name}</p>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-600">You're offering:</p>
                      <p className="font-bold text-gray-900">{request.requesterSlotId?.title}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(request.requesterSlotId?.startTime).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">For their:</p>
                      <p className="font-bold text-gray-900">{request.receiverSlotId?.title}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(request.receiverSlotId?.startTime).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                      request.status === "PENDING"
                        ? "bg-yellow-200 text-yellow-800"
                        : request.status === "ACCEPTED"
                          ? "bg-green-200 text-green-800"
                          : "bg-red-200 text-red-800"
                    }`}
                  >
                    {request.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Requests
