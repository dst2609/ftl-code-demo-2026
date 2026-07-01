const prisma = require("../db")
const { BadRequestError, NotFoundError } = require("../utils/errors")

class OrderItem {
  /** Fetch every order item in the database (stretch: GET /order-items). */
  static async listOrderItems() {
    return await prisma.orderItem.findMany({
      include: { product: true },
    })
  }

  /** Fetch all order items belonging to a single order. */
  static async listOrderItemsForOrder(orderId) {
    return await prisma.orderItem.findMany({
      where: { order_id: Number(orderId) },
      include: { product: true },
    })
  }

  /**
   * Create a single order item on an existing order (stretch:
   * POST /orders/:order_id/items). The unit price is captured from the product
   * at purchase time.
   */
  static async createOrderItem(orderId, { product_id, quantity }) {
    if (product_id === undefined || product_id === null) {
      throw new BadRequestError("Missing required field - product_id - in request body.")
    }

    // Validate the referenced order and product both exist before inserting.
    const order = await prisma.order.findUnique({ where: { order_id: Number(orderId) } })
    if (!order) throw new NotFoundError(`No order found with order_id: ${orderId}`)

    const product = await prisma.product.findUnique({ where: { id: Number(product_id) } })
    if (!product) throw new BadRequestError(`No product found with id: ${product_id}`)

    return await prisma.orderItem.create({
      data: {
        order_id: Number(orderId),
        product_id: Number(product_id),
        quantity: quantity ? Number(quantity) : 1,
        price: product.price,
      },
      include: { product: true },
    })
  }
}

module.exports = OrderItem
