const express = require("express")
const Product = require("../models/product")
const router = express.Router()

/**
 * GET /products
 * Fetch a list of all products.
 * Query params (optional): ?category=clothing  &sort=price|name
 */
router.get("/", async (req, res, next) => {
  try {
    const { category, sort } = req.query
    const products = await Product.listProducts({ category, sort })
    return res.status(200).json({ products })
  } catch (err) {
    next(err)
  }
})

/** GET /products/:id — fetch a single product by id. */
router.get("/:id", async (req, res, next) => {
  try {
    const product = await Product.fetchProductById(req.params.id)
    return res.status(200).json({ product })
  } catch (err) {
    next(err)
  }
})

/** POST /products — add a new product. */
router.post("/", async (req, res, next) => {
  try {
    const product = await Product.createProduct(req.body)
    return res.status(201).json({ product })
  } catch (err) {
    next(err)
  }
})

/** PUT /products/:id — update an existing product. */
router.put("/:id", async (req, res, next) => {
  try {
    const product = await Product.updateProduct(req.params.id, req.body)
    return res.status(200).json({ product })
  } catch (err) {
    next(err)
  }
})

/** DELETE /products/:id — remove a product (cascades to its order items). */
router.delete("/:id", async (req, res, next) => {
  try {
    const product = await Product.deleteProduct(req.params.id)
    return res.status(200).json({ product })
  } catch (err) {
    next(err)
  }
})

module.exports = router
