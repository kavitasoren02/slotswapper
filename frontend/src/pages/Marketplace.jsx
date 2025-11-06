
import { useContext, useEffect, useState } from "react"
import { EventsContext } from "../context/EventsContext"

const Marketplace = () => {
  const { swappableSlots, events, fetchSwappableSlots, createSwapRequest, error } = useContext(EventsContext)
  const [selectedSlotId, setSelectedSlotId] = useState(null)
  const [selectedMySlot, setSelectedMySlot] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [successMsg, setSuccessMsg] = useState("")

  const mySwappableSlots = events.filter((e) => e.status === "SWAPPABLE")

  useEffect(() => {
    fetchSwappableSlots()
  }, [])

  const handleRequestSwap = async () => {
    if (!selectedMySlot) {
      alert("Please select your slot to offer")
      return
    }

    try {
      await createSwapRequest(selectedMySlot, selectedSlotId)
      setSuccessMsg("Swap request sent!")
      setShowModal(false)
      setSelectedSlotId(null)
      setSelectedMySlot(null)
      setTimeout(() => setSuccessMsg(""), 3000)
      await fetchSwappableSlots()
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">Swappable Slots Marketplace</h1>

      {error && <div className="bg-red-100 text-red-700 px-4 py-2 rounded-lg mb-4">{error}</div>}
      {successMsg && <div className="bg-green-100 text-green-700 px-4 py-2 rounded-lg mb-4">{successMsg}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {swappableSlots.length === 0 ? (
          <p className="text-gray-600 col-span-full">No swappable slots available right now.</p>
        ) : (
          swappableSlots.map((slot) => (
            <div key={slot._id} className="bg-white rounded-lg border border-gray-200 p-4">
              <h3 className="font-bold text-gray-900">{slot.title}</h3>
              <p className="text-sm text-gray-600 mt-2">
                {new Date(slot.startTime).toLocaleString()} - {new Date(slot.endTime).toLocaleString()}
              </p>
              <p className="text-sm text-gray-600 mt-2">Owner: {slot.userId?.name}</p>
              <button
                onClick={() => {
                  setSelectedSlotId(slot._id)
                  setShowModal(true)
                }}
                className="w-full mt-4 px-4 py-2 rounded-lg font-medium transition-all cursor-pointer bg-blue-600 text-white hover:bg-blue-700"
              >
                Request Swap
              </button>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg border border-gray-200 p-4 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4 text-gray-900">Select Your Slot to Offer</h2>
            <div className="space-y-2 mb-4 max-h-64 overflow-y-auto">
              {mySwappableSlots.length === 0 ? (
                <p className="text-gray-600">You don't have any swappable slots. Create one first!</p>
              ) : (
                mySwappableSlots.map((slot) => (
                  <label
                    key={slot._id}
                    className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50"
                  >
                    <input
                      type="radio"
                      name="mySlot"
                      value={slot._id}
                      checked={selectedMySlot === slot._id}
                      onChange={(e) => setSelectedMySlot(e.target.value)}
                    />
                    <span className="ml-3 flex-1">
                      <strong>{slot.title}</strong>
                      <br />
                      <span className="text-sm text-gray-600">{new Date(slot.startTime).toLocaleString()}</span>
                    </span>
                  </label>
                ))
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2 rounded-lg font-medium transition-all cursor-pointer bg-gray-200 text-gray-900 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleRequestSwap}
                className="flex-1 px-4 py-2 rounded-lg font-medium transition-all cursor-pointer bg-blue-600 text-white hover:bg-blue-700"
              >
                Send Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Marketplace
