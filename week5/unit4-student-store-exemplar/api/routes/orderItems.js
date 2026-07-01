const express = require("express")
const OrderItem = require("../models/orderItem")
const router = express.Router()

/**
 * GET /order-items  (stretch)
 * Fetch all order items in the database.
 */
router.get("/", async (req, res, next) => {
  try {
    const orderItems = await OrderItem.listOrderItems()
    return res.status(200).json({ orderItems })
  } catch (err) {
    next(err)
  }
})

module.exports = router
