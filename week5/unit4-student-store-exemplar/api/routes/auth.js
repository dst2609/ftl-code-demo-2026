const express = require("express")
const User = require("../models/user")
const { createUserJwt } = require("../utils/tokens")
const security = require("../middleware/security")
const router = express.Router()

/** GET /auth/me — return the currently logged-in user. */
router.get("/me", security.requireAuthenticatedUser, async (req, res, next) => {
  try {
    const { email } = res.locals.user
    const user = await User.fetchUserByEmail(email)
    return res.status(200).json({ user: User.makePublicUser(user) })
  } catch (err) {
    next(err)
  }
})

/** POST /auth/login */
router.post("/login", async (req, res, next) => {
  try {
    const user = await User.login(req.body)
    const token = createUserJwt(user)
    return res.status(200).json({ user, token })
  } catch (err) {
    next(err)
  }
})

/** POST /auth/register */
router.post("/register", async (req, res, next) => {
  try {
    const user = await User.register({ ...req.body, isAdmin: false })
    const token = createUserJwt(user)
    return res.status(201).json({ user, token })
  } catch (err) {
    next(err)
  }
})

module.exports = router
