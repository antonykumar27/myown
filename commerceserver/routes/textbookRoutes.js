const express = require("express");
const {
  createTextBook,
  getTextBooks,
  getTextBookById,
  updateTextBook,
  deleteTextBook,
  searchTextBooks,
  getUserSubjects,
  getAllTextChapter,
  textBookContentCreate,
  getLastCount,
  getTextContentSpecific,
  textBookContentUpdate,
  deleteTextBookChapter,
} = require("../controllers/textbookController.js");

const { isAuthenticatedUser } = require("../middleware/authMiddleware.js");
const { multerMiddleware } = require("../config/cloudinaryCourse");

const router = express.Router();

// Protect all routes
router.use(isAuthenticatedUser);

// Search routes
router.get("/search", searchTextBooks);
router.get("/subjects", getUserSubjects);

// GET all textbooks
router.get("/", getTextBooks);

// CREATE textbook (image upload)
router.post("/", multerMiddleware, isAuthenticatedUser, createTextBook);
router.post(
  "/textContent",
  multerMiddleware,
  isAuthenticatedUser,
  textBookContentCreate,
);
router.put(
  "/textBookContent/:lessonId",
  multerMiddleware,
  textBookContentUpdate,
);

// GET textbook by id
router.get("/:id", getTextBookById);
router.get("/textContentSpecific/:lessonId", getTextContentSpecific);

router.get("/textContent/:chapterId", getAllTextChapter);
router.get("/textContentCount/:chapterId", getLastCount);
// UPDATE textbook (image upload optional)
router.put("/:id", multerMiddleware, isAuthenticatedUser, updateTextBook);

// DELETE textbook
router.delete("/delete/:id", deleteTextBook);
// DELETE textbook
router.delete("/:id", deleteTextBookChapter);

module.exports = router;
