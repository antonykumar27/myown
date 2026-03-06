const TextBook = require("../models/textBook");
const TextChapter = require("../models/textChapters.js");
const cloudinary = require("cloudinary").v2; // 🟢 ADD THIS LINE!
const mongoose = require("mongoose");
const {
  sanitizeLessonContent,
  sanitizeText,
  validateMathContent,
  convertInlineToBlockMath,
} = require("../models/sanitize.js");
const fs = require("fs");
const { uploadFileToCloudinary } = require("../config/cloudinaryCourse");
// @desc    Create a new textbook
// @route   POST /api/textbooks
// @access  Private
exports.createTextBook = async (req, res) => {
  try {
    const { title, subject } = req.body;

    if (!title || !subject) {
      return res.status(400).json({
        success: false,
        message: "Please provide both title and subject",
      });
    }

    const mediaFiles = req.files?.media || [];
    const mediaUrls = [];

    for (const file of mediaFiles) {
      const uploaded = await uploadFileToCloudinary(file);

      if (uploaded?.url) {
        mediaUrls.push({
          url: uploaded.url,
          public_id: uploaded.public_id,
          type: uploaded.type,
          pdfUrl: uploaded.pdfUrl || null,
          size: uploaded.size,
        });
      }

      // remove temp file
      fs.unlink(file.path, () => {});
    }

    const textbook = await TextBook.create({
      title,
      subject,
      media: mediaUrls,
      createdBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Textbook created successfully",
      data: textbook,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create textbook",
    });
  }
};

// @desc    Get all textbooks for logged-in user
// @route   GET /api/textbooks
// @access  Private
exports.getTextBooks = async (req, res) => {
  try {
    const textbooks = await TextBook.find({ createdBy: req.user._id }).sort(
      "-createdAt",
    ); // Most recent first

    res.status(200).json({
      success: true,
      count: textbooks.length,
      data: textbooks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch textbooks",
    });
  }
};

// @desc    Get single textbook
// @route   GET /api/textbooks/:id
// @access  Private
exports.getTextBookById = async (req, res) => {
  try {
    const textbook = await TextBook.findOne({
      _id: req.params.id,
      createdBy: req.user._id,
    });

    if (!textbook) {
      return res.status(404).json({
        success: false,
        message: "Textbook not found",
      });
    }

    res.status(200).json({
      success: true,
      data: textbook,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch textbook",
    });
  }
};

// @desc    Update textbook
// @route   PUT /api/textbooks/:id
// @access  Private
exports.updateTextBook = async (req, res) => {
  try {
    console.log("========== UPDATE TEXTBOOK DEBUG ==========");
    console.log("1️⃣ req.body:", req.body);
    console.log("2️⃣ req.files:", req.files);
    console.log("==========================================");

    const { title, subject } = req.body;

    // Find textbook
    const textbook = await TextBook.findOne({
      _id: req.params.id,
      createdBy: req.user._id,
    });

    if (!textbook) {
      return res.status(404).json({
        success: false,
        message: "Textbook not found",
      });
    }

    // Save old media for rollback if needed
    const oldMedia = [...textbook.media];
    const resumeFiles = req.files?.media || [];
    const resumeUrls = [];
    const failedUploads = [];

    // Upload files with better error handling
    for (const file of resumeFiles) {
      try {
        console.log("📤 Uploading file:", file.originalname);
        const uploaded = await uploadFileToCloudinary(file);

        if (uploaded?.url) {
          resumeUrls.push({
            url: uploaded.url,
            public_id: uploaded.public_id,
            type: uploaded.type,
            size: file.size,
          });
          console.log("✅ Uploaded:", uploaded.public_id);
        }
      } catch (uploadError) {
        console.error(`❌ Failed to upload ${file.originalname}:`, uploadError);
        failedUploads.push(file.originalname);

        // 🟢 Don't stop, continue with other files
      } finally {
        // Clean up temp file
        fs.unlink(file.path, (err) => {
          if (err) console.error("Error deleting temp file:", err);
        });
      }
    }

    // Update fields
    if (title) textbook.title = title;
    if (subject) textbook.subject = subject;

    if (resumeUrls.length > 0) {
      // 🗑️ Delete old media from Cloudinary
      for (const media of oldMedia) {
        if (media.public_id) {
          try {
            await cloudinary.uploader.destroy(media.public_id);
            console.log("✅ Deleted old media:", media.public_id);
          } catch (deleteError) {
            console.error("Error deleting old media:", deleteError);
          }
        }
      }

      textbook.media = resumeUrls;
    }

    await textbook.save();

    // Prepare response message
    let message = "Textbook updated successfully";
    if (failedUploads.length > 0) {
      message += `. ${failedUploads.length} file(s) failed to upload: ${failedUploads.join(", ")}`;
    }

    res.status(200).json({
      success: true,
      message,
      data: textbook,
      failedUploads: failedUploads.length > 0 ? failedUploads : undefined,
    });
  } catch (error) {
    console.error("❌ Update error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update textbook",
    });
  }
};

// ============================================
// HELPER FUNCTION: Extract public_id from Cloudinary URL
// ============================================
function extractPublicIdFromUrl(url) {
  try {
    // URL format: https://res.cloudinary.com/dmfaaroor/image/upload/v1234567/public_id.extension
    const matches = url.match(/\/upload\/v\d+\/(.+)\./);
    if (matches && matches[1]) {
      return matches[1];
    }

    // Alternative pattern
    const parts = url.split("/");
    const lastPart = parts[parts.length - 1];
    return lastPart.split(".")[0];
  } catch (error) {
    console.error("Error extracting public_id:", error);
    return null;
  }
}

// @desc    Delete textbook
// @route   DELETE /api/textbooks/:id
// @access  Private
exports.deleteTextBook = async (req, res) => {
  try {
    // Check if textbook has content
    const isHaveText = await TextChapter.findOne({
      textBookId: req.params.id,
      createdBy: req.user._id,
    });

    // If content exists → block delete
    if (isHaveText) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete textbook because it has chapters",
      });
    }

    // Delete textbook
    const textbook = await TextBook.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user._id,
    });

    if (!textbook) {
      return res.status(404).json({
        success: false,
        message: "Textbook not found or you do not have permission",
      });
    }

    res.status(200).json({
      success: true,
      message: "Textbook deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to delete textbook",
    });
  }
};

// @desc    Search textbooks by title or subject
// @route   GET /api/textbooks/search
// @access  Private
exports.searchTextBooks = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({
        success: false,
        message: "Please provide search query",
      });
    }

    const textbooks = await TextBook.find({
      createdBy: req.user._id,
      $or: [
        { title: { $regex: query, $options: "i" } },
        { subject: { $regex: query, $options: "i" } },
      ],
    }).sort("-createdAt");

    res.status(200).json({
      success: true,
      count: textbooks.length,
      data: textbooks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to search textbooks",
    });
  }
};

// @desc    Get all unique subjects for user
// @route   GET /api/textbooks/subjects
// @access  Private
exports.getUserSubjects = async (req, res) => {
  try {
    const subjects = await TextBook.distinct("subject", {
      createdBy: req.user._id,
    });

    res.status(200).json({
      success: true,
      data: subjects,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch subjects",
    });
  }
};
exports.getAllTextChapter = async (req, res) => {
  try {
    const { chapterId } = req.params;

    /* ---------- 1. FIND TEXTBOOK ---------- */
    const chapter = await TextBook.findById(chapterId);

    if (!chapter) {
      return res.status(404).json({
        success: false,
        message: "TextBook not found",
      });
    }

    /* ---------- 2. FIND ALL TEXT CHAPTERS ---------- */
    const pages = await TextChapter.find({
      textBookId: chapterId, // 🔥 important
    }).sort({ createdAt: 1 });

    /* ---------- 3. RESPONSE ---------- */
    res.status(200).json({
      success: true,
      data: {
        chapter,
        pages,
      },
    });
  } catch (error) {
    console.error("Error fetching chapters:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};
exports.getLastCount = async (req, res) => {
  try {
    const { chapterId } = req.params;

    /* ---------- FIND LAST PAGE ---------- */
    const lastPage = await TextChapter.findOne({
      textBookId: chapterId,
    }).sort({ pageNumber: -1 });

    const lastPageNumber = lastPage ? lastPage.pageNumber : 0;

    res.status(200).json({
      success: true,
      data: {
        nextPageNumber: lastPageNumber + 1,
      },
    });
  } catch (error) {
    console.error("Error fetching page count:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};
// @desc    Update textbook
// @route   PUT /api/textbooks/:id
// @access  Private

exports.textBookContentUpdate = async (req, res) => {
  const startTime = Date.now();
  const userId = req.user.id;
  const { lessonId } = req.params;
  const session = await mongoose.startSession();

  try {
    const {
      title,
      content,
      pageNumber,
      imageNames,
      imagesToDelete, // 🟢 Get this from frontend!
    } = req.body;

    /* ---------- VALIDATION ---------- */
    if (!lessonId) {
      return res.status(400).json({
        success: false,
        message: "lessonId is required in URL params",
      });
    }

    session.startTransaction();

    // Find existing lesson
    const existingLesson =
      await TextChapter.findById(lessonId).session(session);

    if (!existingLesson) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({
        success: false,
        error: "Lesson not found",
      });
    }

    // Permission check
    if (existingLesson.createdBy.toString() !== userId.toString()) {
      await session.abortTransaction();
      session.endSession();
      return res.status(403).json({
        success: false,
        error: "You don't have permission to update this lesson",
      });
    }

    // ============================================
    // 1. PARSE imagesToDelete ARRAY
    // ============================================
    let imagesToDeleteArray = [];
    if (imagesToDelete) {
      try {
        imagesToDeleteArray = JSON.parse(imagesToDelete);
        console.log("🗑️ Images to delete (IDs):", imagesToDeleteArray);
      } catch (e) {
        imagesToDeleteArray = Array.isArray(imagesToDelete)
          ? imagesToDelete
          : [imagesToDelete];
      }
    }

    // ============================================
    // 2. BASIC VALIDATION
    // ============================================
    if (!title || !title.trim()) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        success: false,
        error: "Lesson title is required",
      });
    }

    if (!content || !content.trim()) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        success: false,
        error: "Lesson content cannot be empty",
      });
    }

    // ============================================
    // 3. MATH VALIDATION
    // ============================================
    const validation = validateMathContent(content);
    let contentToSanitize = content;

    if (!validation.isValid && validation.warnings.length > 0) {
      console.warn("⚠️ Math validation warnings:", validation.warnings);
      contentToSanitize = convertInlineToBlockMath(content);
    }

    // ============================================
    // 4. SANITIZATION
    // ============================================
    const sanitizedContent = sanitizeLessonContent(contentToSanitize);
    const sanitizedTitle = sanitizeText(title.trim());

    // ============================================
    // 5. PARSE IMAGE NAMES FOR NEW FILES
    // ============================================
    const mediaFiles = req.files?.media || [];
    let imageNamesArray = [];
    if (imageNames) {
      if (typeof imageNames === "string") {
        try {
          imageNamesArray = JSON.parse(imageNames);
        } catch {
          imageNamesArray = imageNames.includes(",")
            ? imageNames.split(",").map((name) => name.trim())
            : [imageNames];
        }
      } else if (Array.isArray(imageNames)) {
        imageNamesArray = imageNames;
      }
    }

    console.log("📁 Media files:", mediaFiles.length);
    console.log("📝 Image names:", imageNamesArray);

    // ============================================
    // 6. TRACK FILES
    // ============================================
    const uploadedFiles = [];
    let finalContent = sanitizedContent;
    const oldMedia = [...existingLesson.media]; // Save old media

    // ============================================
    // 7. 🗑️ DELETE MARKED IMAGES FROM CLOUDINARY FIRST
    // ============================================
    const mediaToDelete = oldMedia.filter(
      (m) =>
        imagesToDeleteArray.includes(m._id.toString()) ||
        imagesToDeleteArray.includes(m.url),
    );

    console.log("🗑️ Media to delete:", mediaToDelete.length);

    // Delete them from Cloudinary (before transaction)
    for (const media of mediaToDelete) {
      try {
        if (media.public_id) {
          await cloudinary.uploader.destroy(media.public_id);
          console.log(`✅ Deleted from Cloudinary: ${media.public_id}`);
        }
      } catch (error) {
        console.error(`❌ Failed to delete ${media.public_id}:`, error);
      }
    }

    // ============================================
    // 8. UPLOAD NEW MEDIA
    // ============================================
    if (mediaFiles.length > 0) {
      console.log(`📤 Uploading ${mediaFiles.length} new files...`);

      for (let i = 0; i < mediaFiles.length; i++) {
        const file = mediaFiles[i];

        try {
          const uploaded = await uploadFileToCloudinary(file);

          if (uploaded?.url) {
            const type = file.mimetype.includes("video")
              ? "video"
              : file.mimetype.includes("pdf")
                ? "pdf"
                : "image";

            const localFilename = imageNamesArray[i] || file.originalname;

            // 🔥 Replace filename in content with Cloudinary URL
            const markdownPattern = new RegExp(
              `(!\\[.*?\\]\\()${escapeRegExp(localFilename)}(\\))`,
              "g",
            );
            finalContent = finalContent.replace(
              markdownPattern,
              `$1${uploaded.url}$2`,
            );

            // Also handle plain parentheses
            const plainPattern = new RegExp(
              `\\(${escapeRegExp(localFilename)}\\)`,
              "g",
            );
            finalContent = finalContent.replace(
              plainPattern,
              `(${uploaded.url})`,
            );

            const mediaItem = {
              url: uploaded.url,
              public_id: uploaded.public_id,
              type,
              pdfUrl: type === "pdf" ? uploaded.pdfUrl || uploaded.url : null,
              originalFilename: localFilename,
              size: uploaded.size,
            };

            uploadedFiles.push(mediaItem);
            console.log(`✅ Uploaded: ${localFilename} -> ${uploaded.url}`);
          }
        } catch (uploadError) {
          console.error(`❌ Upload failed:`, uploadError);

          // Rollback uploaded files
          for (const file of uploadedFiles) {
            if (file.public_id) {
              await cloudinary.uploader.destroy(file.public_id);
            }
          }

          // Cleanup temp files
          mediaFiles.forEach((f) => fs.unlink(f.path, () => {}));

          await session.abortTransaction();
          session.endSession();

          return res.status(500).json({
            success: false,
            error: "Failed to upload media files. Changes rolled back.",
          });
        } finally {
          fs.unlink(file.path, () => {});
        }
      }
    } else {
      finalContent = sanitizedContent;
    }

    // ============================================
    // 9. 🎯 FINAL MEDIA ARRAY
    // ============================================

    // Keep media that are NOT in imagesToDelete
    let finalMedia = oldMedia.filter(
      (m) =>
        !imagesToDeleteArray.includes(m._id.toString()) &&
        !imagesToDeleteArray.includes(m.url),
    );

    // Add new uploaded files
    finalMedia = [...finalMedia, ...uploadedFiles];

    console.log(`📸 Final media count: ${finalMedia.length}`);
    console.log(
      `📸 Final media IDs:`,
      finalMedia.map((m) => m._id),
    );

    // ============================================
    // 10. UPDATE DATABASE
    // ============================================
    try {
      // Update lesson
      existingLesson.title = sanitizedTitle;
      existingLesson.pageNumber = pageNumber || existingLesson.pageNumber;
      existingLesson.content = finalContent;
      existingLesson.media = finalMedia;
      existingLesson.updatedAt = new Date();

      // Add version history
      existingLesson.versions.push({
        content: finalContent,
        changeNote: req.body.changeNote || "Content updated",
        updatedAt: new Date(),
      });

      // Keep only last 10 versions
      if (existingLesson.versions.length > 10) {
        existingLesson.versions = existingLesson.versions.slice(-10);
      }

      await existingLesson.save({ session });

      // Commit transaction
      await session.commitTransaction();
      session.endSession();

      console.log("✅ Transaction committed");

      // ============================================
      // 11. RESPONSE
      // ============================================
      const hasLatex = checkForLatex(finalContent);

      res.status(200).json({
        success: true,
        message: "Lesson updated successfully",
        data: {
          lessonId: existingLesson._id,
          title: existingLesson.title,
          updatedAt: existingLesson.updatedAt,
          mediaCount: existingLesson.media.length,
          mediaAdded: uploadedFiles.length,
          mediaRemoved: mediaToDelete.length, // ✅ Now this is accurate!
          contentLength: existingLesson.content.length,
          hasLaTeX: hasLatex,
          versionCount: existingLesson.versions.length,
          deletedMediaIds: imagesToDeleteArray, // Show what was deleted
          preview:
            existingLesson.content.substring(0, 150) +
            (existingLesson.content.length > 150 ? "..." : ""),
        },
      });
    } catch (dbError) {
      // Database update failed - rollback
      console.error("❌ Database update failed:", dbError);

      await session.abortTransaction();
      session.endSession();

      // Rollback uploaded Cloudinary files
      for (const file of uploadedFiles) {
        if (file.public_id) {
          await cloudinary.uploader.destroy(file.public_id);
        }
      }

      throw dbError;
    }
  } catch (error) {
    // Ensure transaction is aborted
    if (session.inTransaction()) {
      await session.abortTransaction();
      session.endSession();
    }

    console.error("\n❌ LESSON UPDATE FAILED:", error);

    res.status(500).json({
      success: false,
      error: "Failed to update lesson",
      message: error.message,
    });
  }
};

// Helper function
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function checkForLatex(content) {
  return (
    content.includes("$$") ||
    content.includes("\\begin{") ||
    content.includes("\\frac") ||
    content.includes("\\[") ||
    content.includes("\\(")
  );
}

// Check for LaTeX in content
function checkForLatex(content) {
  return (
    content.includes("$$") ||
    content.includes("\\begin{") ||
    content.includes("\\frac") ||
    content.includes("\\[") ||
    content.includes("\\(")
  );
}

// Rollback Cloudinary files
async function rollbackCloudinaryFiles(files) {
  if (files.length === 0) return;

  console.log("🔄 Rolling back Cloudinary uploads...");

  for (const file of files) {
    try {
      if (file.public_id) {
        await cloudinary.uploader.destroy(file.public_id);
        console.log(`✅ Rollback deleted: ${file.public_id}`);
      }
    } catch (error) {
      console.error(`❌ Rollback failed for ${file.public_id}:`, error);
    }
  }
}

// Escape regex special characters
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
exports.textBookContentCreate = async (req, res) => {
  const startTime = Date.now();
  const userId = req.user.id;

  try {
    console.log("hai", req.body);
    const { title, content, chapterId, pageNumber, imageNames } = req.body;
    console.log("hai", chapterId);
    /* ---------- VALIDATION ---------- */
    if (!chapterId) {
      return res.status(400).json({
        success: false,
        message: "chapterId is required 808",
      });
    }

    // 1️⃣ Get chapter
    const chapterDoc = await TextBook.findById(chapterId);

    if (!chapterDoc) {
      return res.status(404).json({
        success: false,
        error: "Chapter not found",
      });
    }

    // ============================================
    // 1. VALIDATION
    // ============================================
    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        error: "Lesson title is required",
      });
    }

    if (!content || !content.trim()) {
      return res.status(400).json({
        success: false,
        error: "Lesson content cannot be empty",
      });
    }

    if (title.length > 200) {
      return res.status(400).json({
        success: false,
        error: "Title must be less than 200 characters",
      });
    }

    if (content.length > 50000) {
      return res.status(400).json({
        success: false,
        error: "Content too large (max 50,000 characters)",
      });
    }

    // ============================================
    // 2. MATH VALIDATION (BEFORE SANITIZATION)
    // ============================================
    const validation = validateMathContent(content);
    let contentToSanitize = content;

    if (!validation.isValid && validation.warnings.length > 0) {
      console.warn("⚠️ Math validation warnings:", validation.warnings);
      contentToSanitize = convertInlineToBlockMath(content);
    }

    // ============================================
    // 3. SANITIZATION
    // ============================================
    const sanitizedContent = sanitizeLessonContent(contentToSanitize);
    const sanitizedTitle = sanitizeText(title.trim());

    // ============================================
    // 4. MEDIA UPLOAD & CONTENT REPLACEMENT (FIXED)
    // ============================================
    console.log("📁 req.files:", req.files?.media);
    const mediaFiles = req.files?.media || [];
    const media = [];

    // 🔥 FIX: Parse imageNames correctly
    let imageNamesArray = [];
    if (imageNames) {
      // If it's a string, split by comma or make it an array
      if (typeof imageNames === "string") {
        // Check if it's a JSON string
        try {
          imageNamesArray = JSON.parse(imageNames);
        } catch {
          // If not JSON, treat as single filename or comma-separated
          if (imageNames.includes(",")) {
            imageNamesArray = imageNames.split(",").map((name) => name.trim());
          } else {
            imageNamesArray = [imageNames];
          }
        }
      } else if (Array.isArray(imageNames)) {
        imageNamesArray = imageNames;
      }
    }

    console.log("📝 imageNamesArray:", imageNamesArray);

    // Start with sanitized content
    let finalContent = sanitizedContent;

    // Upload files and REPLACE filenames in content
    for (let i = 0; i < mediaFiles.length; i++) {
      const file = mediaFiles[i];

      try {
        // Upload to Cloudinary
        const uploaded = await uploadFileToCloudinary(file);

        if (uploaded?.url) {
          let type = "image";
          if (file.mimetype.includes("video")) type = "video";
          if (file.mimetype.includes("pdf")) type = "pdf";

          // Get the original filename
          const localFilename = imageNamesArray[i] || file.originalname;

          console.log(`🔄 Replacing: ${localFilename} -> ${uploaded.url}`);

          // 🔥 FIX: Better regex to match markdown image syntax
          // Match: ![alt text](filename) or just (filename)
          const markdownPattern = new RegExp(
            `(!\\[.*?\\]\\()${escapeRegExp(localFilename)}(\\))`,
            "g",
          );

          finalContent = finalContent.replace(
            markdownPattern,
            `$1${uploaded.url}$2`,
          );

          // Also match plain parentheses (for other uses)
          const plainPattern = new RegExp(
            `\\(${escapeRegExp(localFilename)}\\)`,
            "g",
          );
          finalContent = finalContent.replace(
            plainPattern,
            `(${uploaded.url})`,
          );

          // Add to media array WITH PUBLIC_ID
          media.push({
            url: uploaded.url,
            public_id: uploaded.public_id,
            type,
            pdfUrl: type === "pdf" ? uploaded.pdfUrl || uploaded.url : null,
            originalFilename: localFilename,
            size: uploaded.size,
          });

          console.log(`✅ Uploaded: ${localFilename} -> ${uploaded.public_id}`);
        }
      } catch (uploadError) {
        console.error(`❌ Failed to upload file ${i}:`, uploadError);
      } finally {
        // Cleanup temp file
        fs.unlink(file.path, () => {});
      }
    }

    console.log("📸 Final content preview:", finalContent.substring(0, 200));
    console.log("📸 Media with public_ids:", media);

    // Check if content has meaningful LaTeX
    const hasLatex =
      finalContent.includes("$$") ||
      finalContent.includes("\\begin{") ||
      finalContent.includes("\\frac") ||
      finalContent.includes("\\[") ||
      finalContent.includes("\\(");

    // ============================================
    // 5. SAVE TO DATABASE - 🔴 FIXED HERE
    // ============================================

    // 🔴 IMPORTANT: Check if this chapterId + pageNumber combination already exists
    const existingPage = await TextChapter.findOne({
      chapterId: chapterId, // Now using the correct field name
      pageNumber: pageNumber,
    });

    if (existingPage) {
      return res.status(400).json({
        success: false,
        error: `Page ${pageNumber} already exists for this chapter`,
      });
    }

    const lesson = new TextChapter({
      title: sanitizedTitle,
      pageNumber: pageNumber,
      content: finalContent,
      media: media,
      chapterId: chapterId, // 🔴 ADD THIS - it was missing!
      textBookId: chapterId, // Keep this too if needed
      views: 0,
      createdBy: userId,
      versions: [
        {
          content: finalContent,
          changeNote: "Initial version",
          updatedAt: new Date(),
        },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    console.log("📝 Lesson to save:", {
      title: lesson.title,
      chapterId: lesson.chapterId, // Now this will be set
      pageNumber: lesson.pageNumber,
      mediaCount: lesson.media.length,
      mediaPublicIds: lesson.media.map((m) => m.public_id),
    });

    await lesson.save();

    // ============================================
    // 6. RESPONSE
    // ============================================
    res.status(201).json({
      success: true,
      message: "Lesson saved successfully",
      data: {
        lessonId: lesson._id,
        title: lesson.title,
        chapterId: lesson.chapterId,
        pageNumber: lesson.pageNumber,
        createdAt: lesson.createdAt,
        mediaCount: lesson.media.length,
        mediaPublicIds: lesson.media.map((m) => m.public_id),
        contentLength: lesson.content.length,
        hasLaTeX: hasLatex,
        preview:
          lesson.content.substring(0, 150) +
          (lesson.content.length > 150 ? "..." : ""),
      },
    });
  } catch (error) {
    const elapsedTime = Date.now() - startTime;

    console.error("\n❌ LESSON CREATION FAILED");
    console.error("══════════════════════════════════");
    console.error(`⏱️  Time before error: ${elapsedTime}ms`);
    console.error(`💥 Error: ${error.message}`);
    console.error(`📋 Stack: ${error.stack}`);
    console.error("══════════════════════════════════\n");

    // Handle duplicate key error specifically
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        error: "A page with this number already exists for this chapter",
        details: "Duplicate chapterId + pageNumber combination",
      });
    }

    const isValidationError = error.name === "ValidationError";
    const statusCode = isValidationError ? 400 : 500;

    res.status(statusCode).json({
      success: false,
      error: isValidationError
        ? "Invalid lesson data"
        : "Failed to save lesson. Please try again.",
      details:
        process.env.NODE_ENV === "development"
          ? { message: error.message, stack: error.stack }
          : undefined,
    });
  }
};

// Helper function for escaping regex
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Helper function for escaping regex
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
// 🔥 Helper function to escape special characters in regex
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
exports.getTextContentSpecific = async (req, res) => {
  try {
    const { lessonId } = req.params;

    // 1️⃣ Get lesson
    const lesson = await TextChapter.findById(lessonId);

    if (!lesson) {
      return res.status(404).json({
        success: false,
        error: "Lesson not found",
      });
    }

    res.json({
      success: true,
      lesson,
    });
  } catch (error) {
    console.error("Error fetching lesson:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// @desc    Delete textbook
// @route   DELETE /api/textbooks/:id
// @access  Private
exports.deleteTextBookChapter = async (req, res) => {
  try {
    const chapter = await TextChapter.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user._id,
    });

    if (!chapter) {
      return res.status(404).json({
        success: false,
        message: "Chapter not found or you don't have permission",
      });
    }

    res.status(200).json({
      success: true,
      message: "Chapter deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to delete chapter",
    });
  }
};
