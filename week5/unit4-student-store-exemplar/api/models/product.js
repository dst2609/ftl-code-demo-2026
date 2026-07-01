const prisma = require("../db")
const { BadRequestError, NotFoundError } = require("../utils/errors")

class Product {
  /**
   * List all products.
   *
   * Supports optional filtering and sorting via query params (Milestone 2):
   *   - category: only return products in this category (e.g. "clothing")
   *   - sort:     order the results by "price" or "name" (ascending)
   *
   * With no options provided, returns every product in no particular order.
   */
  static async listProducts({ category, sort } = {}) {
    // Build the Prisma query dynamically from the provided options.
    const where = category ? { category } : undefined

    let orderBy
    if (sort === "price") orderBy = { price: "asc" }
    else if (sort === "name") orderBy = { name: "asc" }

    return await prisma.product.findMany({ where, orderBy })
  }

  /** Fetch a single product by its id. Throws 404 if it doesn't exist. */
  static async fetchProductById(id) {
    const product = await prisma.product.findUnique({
      where: { id: Number(id) },
    })

    if (!product) {
      throw new NotFoundError(`No product found with id: ${id}`)
    }

    return product
  }

  /** Create a new product. */
  static async createProduct(body) {
    const requiredFields = ["name", "description", "price"]
    requiredFields.forEach((field) => {
      if (body?.[field] === undefined || body?.[field] === null) {
        throw new BadRequestError(`Missing required field - ${field} - in request body.`)
      }
    })

    return await prisma.product.create({
      data: {
        name: body.name,
        description: body.description,
        price: Number(body.price),
        image_url: body.image_url ?? null,
        category: body.category ?? "misc",
      },
    })
  }

  /** Update an existing product. Throws 404 if it doesn't exist. */
  static async updateProduct(id, body) {
    // Confirm the product exists first so we can return a clean 404.
    await Product.fetchProductById(id)

    const data = {}
    if (body.name !== undefined) data.name = body.name
    if (body.description !== undefined) data.description = body.description
    if (body.price !== undefined) data.price = Number(body.price)
    if (body.image_url !== undefined) data.image_url = body.image_url
    if (body.category !== undefined) data.category = body.category

    return await prisma.product.update({
      where: { id: Number(id) },
      data,
    })
  }

  /**
   * Delete a product by id. Any OrderItem rows that reference this product are
   * automatically removed by the `onDelete: Cascade` rule on the OrderItem <->
   * Product relation (see prisma/schema.prisma).
   */
  static async deleteProduct(id) {
    await Product.fetchProductById(id)
    return await prisma.product.delete({ where: { id: Number(id) } })
  }
}

module.exports = Product
