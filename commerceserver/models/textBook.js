const mongoose = require("mongoose");
const textbookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Book title is required"],
      trim: true,

      index: true,
    },
    subject: {
      type: String,
      required: [true, "Subject is required"],
      trim: true,

      index: true,
    },
    media: [
      {
        url: {
          type: String,
          required: true,
        },
        public_id: {
          // 🟢 Make sure this field exists!
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
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Creator is required"],
      index: true,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  },
);

// Compound index for faster queries
textbookSchema.index({ createdBy: 1, title: 1 });

module.exports = mongoose.model("TextBook", textbookSchema);
