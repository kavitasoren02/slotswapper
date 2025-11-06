const express = require("express")
const Event = require("../models/Event")
const authMiddleware = require("../middleware/auth")

const router = express.Router()

// Get all events for the logged-in user
router.get("/", authMiddleware, async (req, res) => {
  try {
    const events = await Event.find({ userId: req.userId }).sort({ startTime: 1 })
    res.json(events)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Create a new event
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, startTime, endTime } = req.body

    if (!title || !startTime || !endTime) {
      return res.status(400).json({ error: "Title, startTime, and endTime are required" })
    }

    if (new Date(startTime) >= new Date(endTime)) {
      return res.status(400).json({ error: "startTime must be before endTime" })
    }

    const event = new Event({
      title,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      userId: req.userId,
      status: "BUSY",
    })

    await event.save()
    res.status(201).json(event)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Update event status
router.patch("/:eventId", authMiddleware, async (req, res) => {
  try {
    const { status } = req.body

    if (!["BUSY", "SWAPPABLE", "SWAP_PENDING"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" })
    }

    const event = await Event.findOne({ _id: req.params.eventId, userId: req.userId })
    if (!event) {
      return res.status(404).json({ error: "Event not found" })
    }

    event.status = status
    await event.save()
    res.json(event)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Delete an event
router.delete("/:eventId", authMiddleware, async (req, res) => {
  try {
    const event = await Event.findOneAndDelete({ _id: req.params.eventId, userId: req.userId })
    if (!event) {
      return res.status(404).json({ error: "Event not found" })
    }
    res.json({ message: "Event deleted" })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

module.exports = router
