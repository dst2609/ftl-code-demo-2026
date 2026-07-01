const prisma = require("../db")
const { BadRequestError, NotFoundError } = require("../utils/errors")

class Order {
  /**
   * List all orders, most recent first.
   *
   * Optional filter (stretch): pass a customer email to only return orders
   * placed by that user.
   */
  static async listOrders({ email } = {}) {
    const where = email ? { customer: { email: email.toLowerCase() } } : undefined

    return await prisma.order.findMany({
      where,
      orderBy: { created_at: "desc" },
      include: { orderItems: { include: { product: true } } },
    })
  }

  /**
   * Fetch a single order by id, including its line items (and each item's
   * product). Throws 404 if the order doesn't exist.
   */
  static async fetchOrderById(orderId) {
    const order = await prisma.order.findUnique({
      where: { order_id: Number(orderId) },
      include: { orderItems: { include: { product: true } } },
    })

    if (!order) {
      throw new NotFoundError(`No order found with order_id: ${orderId}`)
    }

    return order
  }

  /**
   * Create an order and all of its line items ATOMICALLY.
   *
   * See the "Transactional Flow" section of planning.md for the full spec.
   *
   * @param {Object}  order        - order metadata { customer_id, status? }
   * @param {Array}   items        - [{ product_id, quantity }, ...]
   *
   * Everything below runs inside prisma.$transaction: if any step throws (for
   * example, an item references a product that doesn't exist), the whole
   * transaction rolls back and no partial order is left in the database.
   */
  static async createOrder({ order, items }) {
    if (!order || order.customer_id === undefined || order.customer_id === null) {
      throw new BadRequestError("Missing required field - order.customer_id.")
    }
    if (!Array.isArray(items) || items.length === 0) {
      throw new BadRequestError("An order must include at least one item.")
    }

    return await prisma.$transaction(async (tx) => {
      // 1. Look up every referenced product so we can (a) validate it exists
      //    and (b) capture its current price for the line item.
      const productIds = items.map((item) => Number(item.product_id))
      const products = await tx.product.findMany({ where: { id: { in: productIds } } })
      const productsById = products.reduce((acc, p) => ({ ...acc, [p.id]: p }), {})

      // 2. Build the line items and compute the total price (in cents).
      let totalPrice = 0
      const orderItemsData = items.map((item) => {
        const product = productsById[Number(item.product_id)]
        if (!product) {
          // Throwing here aborts the transaction -> nothing is committed.
          throw new BadRequestError(`No product found with id: ${item.product_id}`)
        }
        const quantity = item.quantity ? Number(item.quantity) : 1
        totalPrice += product.price * quantity
        return { product_id: product.id, quantity, price: product.price }
      })

      // 3. Create the Order together with its nested OrderItems in one write.
      const created = await tx.order.create({
        data: {
          customer_id: Number(order.customer_id),
          status: order.status || "pending",
          total_price: totalPrice,
          orderItems: { create: orderItemsData },
        },
        include: { orderItems: { include: { product: true } } },
      })

      return created
    })
  }

  /** Update an order's metadata (e.g. change its status). Throws 404 if missing. */
  static async updateOrder(orderId, body) {
    await Order.fetchOrderById(orderId)

    const data = {}
    if (body.status !== undefined) data.status = body.status
    if (body.total_price !== undefined) data.total_price = Number(body.total_price)
    if (body.customer_id !== undefined) data.customer_id = Number(body.customer_id)

    return await prisma.order.update({
      where: { order_id: Number(orderId) },
      data,
      include: { orderItems: { include: { product: true } } },
    })
  }

  /**
   * Delete an order. Its OrderItem rows are automatically removed by the
   * `onDelete: Cascade` rule on the OrderItem <-> Order relation.
   */
  static async deleteOrder(orderId) {
    await Order.fetchOrderById(orderId)
    return await prisma.order.delete({ where: { order_id: Number(orderId) } })
  }
}

module.exports = Order
