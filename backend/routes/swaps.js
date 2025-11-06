const express = require("express")
const Event = require("../models/Event")
const SwapRequest = require("../models/SwapRequest")
const User = require("../models/User")
const authMiddleware = require("../middleware/auth")

const router = express.Router()

// Get all swappable slots from other users
router.get("/swappable-slots", authMiddleware, async (req, res) => {
  try {
    const slots = await Event.find({
      status: "SWAPPABLE",
      userId: { $ne: req.userId },
    }).populate("userId", "name email")

    res.json(slots)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Create a swap request
router.post("/swap-request", authMiddleware, async (req, res) => {
  try {
    const { mySlotId, theirSlotId } = req.body

    if (!mySlotId || !theirSlotId) {
      return res.status(400).json({ error: "mySlotId and theirSlotId are required" })
    }

    // Verify both slots exist and are swappable
    const mySlot = await Event.findOne({ _id: mySlotId, userId: req.userId })
    const theirSlot = await Event.findById(theirSlotId)

    if (!mySlot) {
      return res.status(404).json({ error: "Your slot not found" })
    }

    if (!theirSlot) {
      return res.status(404).json({ error: "Their slot not found" })
    }

    if (mySlot.status !== "SWAPPABLE") {
      return res.status(400).json({ error: "Your slot must be swappable" })
    }

    if (theirSlot.status !== "SWAPPABLE") {
      return res.status(400).json({ error: "Their slot is no longer swappable" })
    }

    // Create swap request
    const swapRequest = new SwapRequest({
      requesterUserId: req.userId,
      requesterSlotId: mySlotId,
      receiverUserId: theirSlot.userId,
      receiverSlotId: theirSlotId,
      status: "PENDING",
    })

    // Update slot statuses
    mySlot.status = "SWAP_PENDING"
    theirSlot.status = "SWAP_PENDING"

    await mySlot.save()
    await theirSlot.save()
    await swapRequest.save()

    res.status(201).json(swapRequest)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Get incoming swap requests
router.get("/incoming-requests", authMiddleware, async (req, res) => {
  try {
    const requests = await SwapRequest.find({
      receiverUserId: req.userId,
      status: "PENDING",
    })
      .populate("requesterUserId", "name email")
      .populate("requesterSlotId")
      .populate("receiverSlotId")

    res.json(requests)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Get outgoing swap requests
router.get("/outgoing-requests", authMiddleware, async (req, res) => {
  try {
    const requests = await SwapRequest.find({
      requesterUserId: req.userId,
    })
      .populate("receiverUserId", "name email")
      .populate("requesterSlotId")
      .populate("receiverSlotId")

    res.json(requests)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Respond to a swap request
router.post("/swap-response/:requestId", authMiddleware, async (req, res) => {
  try {
    const { accept } = req.body

    if (typeof accept !== "boolean") {
      return res.status(400).json({ error: "accept must be a boolean" })
    }

    const swapRequest = await SwapRequest.findById(req.params.requestId)
    if (!swapRequest) {
      return res.status(404).json({ error: "Swap request not found" })
    }

    if (swapRequest.receiverUserId.toString() !== req.userId) {
      return res.status(403).json({ error: "Unauthorized" })
    }

    const requesterSlot = await Event.findById(swapRequest.requesterSlotId)
    const receiverSlot = await Event.findById(swapRequest.receiverSlotId)

    if (!requesterSlot || !receiverSlot) {
      return res.status(404).json({ error: "One or both slots not found" })
    }

    if (accept) {
      // Accept the swap - exchange slot ownership
      const tempUserId = requesterSlot.userId
      requesterSlot.userId = receiverSlot.userId
      receiverSlot.userId = tempUserId

      requesterSlot.status = "BUSY"
      receiverSlot.status = "BUSY"

      swapRequest.status = "ACCEPTED"
      swapRequest.respondedAt = new Date()
    } else {
      // Reject the swap
      requesterSlot.status = "SWAPPABLE"
      receiverSlot.status = "SWAPPABLE"

      swapRequest.status = "REJECTED"
      swapRequest.respondedAt = new Date()
    }

    await requesterSlot.save()
    await receiverSlot.save()
    await swapRequest.save()

    res.json({
      message: accept ? "Swap accepted" : "Swap rejected",
      swapRequest,
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

module.exports = router
