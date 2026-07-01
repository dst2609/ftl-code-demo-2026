const jwt = require("jsonwebtoken")
const { SECRET_KEY } = require("../config")

const generateToken = (data) => jwt.sign(data, SECRET_KEY)

const createUserJwt = (user) => {
  const payload = {
    id: user.id,
    email: user.email,
    isAdmin: user.isAdmin ?? user.is_admin ?? false,
  }

  return generateToken(payload)
}

const validateToken = (token) => {
  try {
    return jwt.verify(token, SECRET_KEY)
  } catch (err) {
    return {}
  }
}

module.exports = {
  generateToken,
  validateToken,
  createUserJwt,
}
