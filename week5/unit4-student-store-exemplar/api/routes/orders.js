const express = require("express")
const Order = require("../models/order")
const OrderItem = require("../models/orderItem")
const router = express.Router()

/**
 * GET /orders
 * Fetch a list of all orders (each with its items).
 * Query param (optional, stretch): ?email=someone@example.com to filter by the
 * customer who placed the order.
 */
router.get("/", async (req, res, next) => {
  try {
    const { email } = req.query
    const orders = await Order.listOrders({ email })
    return res.status(200).json({ orders })
  } catch (err) {
    next(err)
  }
})

/** GET /orders/:order_id — fetch a single order including its order items. */
router.get("/:order_id", async (req, res, next) => {
  try {
    const order = await Order.fetchOrderById(req.params.order_id)
    return res.status(200).json({ order })
  } catch (err) {
    next(err)
  }
})

/**
 * POST /orders
 * Create a new order with its items, atomically.
 * Body: { order: { customer_id, status? }, items: [{ product_id, quantity }] }
 */
router.post("/", async (req, res, next) => {
  try {
    const order = await Order.createOrder({
      order: req.body.order,
      items: req.body.items,
    })
    return res.status(201).json({ order })
  } catch (err) {
    next(err)
  }
})

/** PUT /orders/:order_id — update an order (e.g. change its status). */
router.put("/:order_id", async (req, res, next) => {
  try {
    const order = await Order.updateOrder(req.params.order_id, req.body)
    return res.status(200).json({ order })
  } catch (err) {
    next(err)
  }
})

/** DELETE /orders/:order_id — remove an order (cascades to its order items). */
router.delete("/:order_id", async (req, res, next) => {
  try {
    const order = await Order.deleteOrder(req.params.order_id)
    return res.status(200).json({ order })
  } catch (err) {
    next(err)
  }
})

/**
 * POST /orders/:order_id/items  (stretch)
 * Add a new order item to an existing order.
 * Body: { product_id, quantity }
 */
router.post("/:order_id/items", async (req, res, next) => {
  try {
    const orderItem = await OrderItem.createOrderItem(req.params.order_id, req.body)
    return res.status(201).json({ orderItem })
  } catch (err) {
    next(err)
  }
})

module.exports = router
