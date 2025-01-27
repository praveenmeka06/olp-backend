const express = require("express");
const {
  signup,
  login,
  protect,
  restrictTo,
  getMe,
} = require("../controllers/authController");
const {
  getAll,
  getOne,
  postOne,
  updateOne,
  deleteOne,
} = require("../controllers/studentController");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/getMe", getMe);

router.use(protect);

router.put("/:id", updateOne);

router.use(restrictTo("admin"));

router.get("/:id", getOne);
router.get("/", getAll);
router.post("/", postOne);
router.delete("/:id", deleteOne);

module.exports = router;
