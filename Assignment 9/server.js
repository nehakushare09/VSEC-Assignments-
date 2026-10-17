const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const Book = require("./models/Book");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

function databaseUnavailable(res) {
  return res.status(503).json({
    message: "The book database is not connected. Check your MongoDB server and MONGODB_URI, then try again.",
  });
}

function validId(id) {
  return mongoose.isValidObjectId(id);
}

function validationMessage(error) {
  if (error.name === "ValidationError") {
    return Object.values(error.errors).map((item) => item.message).join(" ");
  }
  return error.message || "Something went wrong. Please try again.";
}

// GET /api/books?search=... searches title and author.
app.get("/api/books", async (req, res) => {
  if (mongoose.connection.readyState !== 1) return databaseUnavailable(res);
  try {
    const search = String(req.query.search || "").trim();
    const filter = search
      ? { $or: [
          { title: { $regex: escapeRegex(search), $options: "i" } },
          { author: { $regex: escapeRegex(search), $options: "i" } },
        ] }
      : {};
    const books = await Book.find(filter).sort({ createdAt: -1 });
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: "Could not load books. Please try again." });
  }
});

// Treat search text as plain text rather than a regular-expression pattern.
function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

app.post("/api/books", async (req, res) => {
  if (mongoose.connection.readyState !== 1) return databaseUnavailable(res);
  try {
    const book = await Book.create(req.body);
    res.status(201).json(book);
  } catch (error) {
    const status = error.name === "ValidationError" ? 400 : 500;
    res.status(status).json({ message: validationMessage(error) });
  }
});

app.put("/api/books/:id", async (req, res) => {
  if (!validId(req.params.id)) {
    return res.status(400).json({ message: "That book ID is not valid." });
  }
  if (mongoose.connection.readyState !== 1) return databaseUnavailable(res);
  try {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
      context: "query",
    });
    if (!book) return res.status(404).json({ message: "Book not found." });
    res.json(book);
  } catch (error) {
    const status = error.name === "ValidationError" ? 400 : 500;
    res.status(status).json({ message: validationMessage(error) });
  }
});

app.delete("/api/books/:id", async (req, res) => {
  if (!validId(req.params.id)) {
    return res.status(400).json({ message: "That book ID is not valid." });
  }
  if (mongoose.connection.readyState !== 1) return databaseUnavailable(res);
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found." });
    res.json({ message: "Book deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Could not delete this book. Please try again." });
  }
});

async function startServer() {
  if (!process.env.MONGODB_URI) {
    console.error("MONGODB_URI is missing. Copy .env.example to .env and configure MongoDB.");
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected successfully.");
    app.listen(PORT, () => console.log(`BookBuddy is ready at http://localhost:${PORT}`));
  } catch (error) {
    console.error("Could not connect to MongoDB:", error.message);
    console.error("Check that MongoDB is running and MONGODB_URI in .env is correct.");
    process.exit(1);
  }
}

startServer();
