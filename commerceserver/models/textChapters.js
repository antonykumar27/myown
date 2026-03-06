const mongoose = require("mongoose");
const { Schema } = mongoose;

// Version history sub-schema
const versionSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    changeNote: {
      type: String,
      default: "Content updated",
    },
  },
  { _id: false },
);

// MAIN STANDARD PAGE SCHEMA
const ChapterSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 200,
  },
  content: {
    type: String,
    required: true,
    trim: true,
  },
  subject: {
    type: String,
    enum: ["maths", "physics", "chemistry", "biology", "other"],
    default: "maths",
  },
  // Media array
  media: [
    {
      url: {
        type: String,
        required: true,
      },
      public_id: {
        type: String,
        required: true,
      },
      type: {
        type: String,
        enum: ["image", "video", "pdf"],
        default: "image",
      },
      pdfUrl: String,
      size: Number,
    },
  ],

  // References
  chapterId: {
    // 🔴 ADD THIS MISSING FIELD!
    type: Schema.Types.ObjectId,
    ref: "TextBook", // Or whatever your chapter/chapter group is
    required: true,
  },

  pageNumber: {
    type: Number,
    required: true,
  },

  textBookId: {
    type: Schema.Types.ObjectId,
    ref: "TextBook",
    required: true,
  },

  // Version history
  versions: [versionSchema],

  // Stats
  views: {
    type: Number,
    default: 0,
  },

  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  lastAccessed: {
    type: Date,
  },

  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Pre-save middleware
ChapterSchema.pre("save", function (next) {
  this.updatedAt = Date.now();

  // Add to version history if content changed
  if (this.isModified("content")) {
    if (!this.versions) this.versions = [];

    this.versions.push({
      content: this.content,
      updatedAt: new Date(),
    });

    // Keep only last 5 versions
    if (this.versions.length > 5) {
      this.versions = this.versions.slice(-5);
    }
  }

  next();
});

// Unique compound index - NOW IT WILL WORK PROPERLY
ChapterSchema.index({ chapterId: 1, pageNumber: 1 }, { unique: true });

// Additional indexes for performance
ChapterSchema.index({ createdBy: 1 });

module.exports = mongoose.model("TextChapter", ChapterSchema);
