const express = require("express");
const router = express.Router();
const { register } = require("../controllers/userController");

router.get("/", () => {});
router.get("/:id", () => {});
router.post("/register", register);
router.put("/:id", () => {});
router.delete("/:id", () => {});

module.exports = router;
