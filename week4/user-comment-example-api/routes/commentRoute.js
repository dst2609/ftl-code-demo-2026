const express = require("express");
const router = express.Router();

const {
  getComments,
  getCommentById,
  createComment,
  updateComment,
  deleteComment,
} = require("../controllers/commentController");

router.get("/", getComments); // GET    /comments
router.get("/:id", getCommentById); // GET    /comments/1
router.post("/", createComment); // POST   /comments
router.put("/:id", updateComment); // PUT    /comments/:id
router.delete("/:id", deleteComment); // DELETE /comments/:id

module.exports = router;
