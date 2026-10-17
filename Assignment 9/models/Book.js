const mongoose = require("mongoose");

const READING_STATUSES = ["Want to Read", "Reading", "Completed"];

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please enter a book title."],
      trim: true,
    },
    author: {
      type: String,
      required: [true, "Please enter the author's name."],
      trim: true,
    },
    genre: {
      type: String,
      required: [true, "Please enter a genre."],
      trim: true,
    },
    status: {
      type: String,
      required: [true, "Please choose a reading status."],
      enum: {
        values: READING_STATUSES,
        message: "Reading status must be Want to Read, Reading, or Completed.",
      },
      default: "Want to Read",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Book", bookSchema);
