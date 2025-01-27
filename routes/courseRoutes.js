const express = require("express");
const { protect, restrictTo } = require("../controllers/authController");
const {
  getAll,
  getOne,
  postOne,
  updateOne,
  deleteOne,
} = require("../controllers/courseController");

const router = express.Router();

router.use(protect);

router.get("/:id", getOne);
router.get("/", getAll);

router.use(restrictTo("admin"));

router.post("/", postOne);
router.put("/:id", updateOne);
router.delete("/:id", deleteOne);

module.exports = router;
