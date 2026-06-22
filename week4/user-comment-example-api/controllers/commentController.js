const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// get every comment -
const getComments = async (req, res) => {
  try {
    const comments = await prisma.comment.findMany({
      orderBy: { id: "asc" },
      include: { user: true }, //attach the user who wrote each comment
    });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch comments" });
  }
};

// get a single comment + the user who wrote it
const getCommentById = async (req, res) => {
  try {
    const { id } = req.params;
    const comment = await prisma.comment.findUnique({
      where: { id: parseInt(id) },
      include: { user: true },
    });

    //what if the comment with specific id is not found in the db?
    if (!comment) return res.status(404).json({ error: "Comment not found" });
    res.json(comment);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch comment" });
  }
};

// insert a new comment, row
const createComment = async (req, res) => {
  try {
    const newComment = await prisma.comment.create({
      data: {
        content: req.body.content,
        userId: parseInt(req.body.userId),
      },
    });
    res.status(201).json(newComment);
  } catch (err) {
    if (err.code === "P2003") {
      //foreign key failed - the userId does not point to a real user
      return res.status(400).json({ error: "User not found" });
    }
    res.status(500).json({ error: "Failed to create comment" });
  }
};

// change a comment's content
const updateComment = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedComment = await prisma.comment.update({
      where: { id: parseInt(id) },
      data: { content: req.body.content },
    });

    res.json(updatedComment);
  } catch (err) {
    if (err.code === "P2025") {
      //this is for comment not found, cannot update a comment if it is not there
      return res.status(303).json({ error: "Comment not found" });
    }
    res.status(500).json({ error: "Failed to update comment" });
  }
};

// remove a comment
const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.comment.delete({
      where: { id: parseInt(id) },
    });

    res.json({ message: "Comment deleted" });
  } catch (err) {
    if (err.code === "P2025") {
      //this is for comment not found, cannot delete a comment if it is not there
      return res.status(303).json({ error: "Comment not found" });
    }
    res.status(500).json({ error: "Failed to delete comment" });
  }
};

module.exports = {
  getComments,
  getCommentById,
  createComment,
  updateComment,
  deleteComment,
};
