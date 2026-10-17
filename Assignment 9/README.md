# BookBuddy — Personal Book Collection

BookBuddy is a small full-stack app for keeping a personal list of books. Add a title, author, genre, and reading status; browse your shelf, search by title or author, edit details, or remove a book. The layout adapts to phones and desktop screens.

## What is in this project?

- `server.js` starts Express, serves `public/`, connects to MongoDB, and handles the REST API.
- `models/Book.js` describes a book and validates its fields with Mongoose.
- `public/index.html` contains the page structure and add/edit form.
- `public/styles.css` contains the responsive visual design.
- `public/app.js` loads books and calls the API from the browser.
- `.env.example` is a safe template for local configuration. It contains no real credentials.

## Prerequisites

1. Install Node.js (LTS) and npm.
2. Have MongoDB running locally, or create a MongoDB Atlas database and its connection string.
3. Use a terminal opened in the `Assignment 9` folder.

## Setup and run

1. Install the project packages:

   ```bash
   npm install
   ```

2. Create your environment file by copying `.env.example` to `.env`.

   Windows PowerShell:

   ```powershell
   Copy-Item .env.example .env
   ```

   macOS/Linux:

   ```bash
   cp .env.example .env
   ```

3. Open `.env`. For local MongoDB, the example URI is already suitable when the MongoDB service is running:

   ```env
   MONGODB_URI=mongodb://127.0.0.1:27017/bookbuddy
   PORT=3000
   ```

   For MongoDB Atlas, replace the URI with the connection string from your own Atlas cluster. Put your own username and password in `.env` only. Do not share it or commit it. If the password contains special URL characters, URL-encode them. Make sure your Atlas network access settings allow your computer to connect.

4. Start the app:

   ```bash
   npm start
   ```

   For development with Node's automatic restart:

   ```bash
   npm run dev
   ```

5. Open <http://localhost:3000> in your browser. Stop the server with `Ctrl+C`.

The server waits for MongoDB before it starts listening. If the URI is missing or MongoDB cannot connect, the terminal prints a helpful message. API requests also return a clear database connection error if the database becomes unavailable.

## Book data

Every book has four required fields:

- `title`: book title (text)
- `author`: author's name (text)
- `genre`: genre (text)
- `status`: one of `Want to Read`, `Reading`, or `Completed`

The server trims text and checks required fields and status values. The browser also gives a quick validation message, but server validation is what protects the stored data.

## REST API

All routes use JSON. Book objects include MongoDB's `_id` plus `createdAt` and `updatedAt` dates.

| Method | Route | Purpose |
| --- | --- | --- |
| `GET` | `/api/books` | List all books |
| `GET` | `/api/books?search=haig` | Search titles or authors, without case sensitivity |
| `POST` | `/api/books` | Add a book |
| `PUT` | `/api/books/:id` | Update a book |
| `DELETE` | `/api/books/:id` | Delete a book |

Example request body for adding or updating:

```json
{
  "title": "The Midnight Library",
  "author": "Matt Haig",
  "genre": "Fiction",
  "status": "Want to Read"
}
```

A successful create returns `201 Created` and the saved book. List and update return `200 OK`. Delete returns a confirmation message. Missing or invalid fields return `400 Bad Request`; a well-formed ID with no matching book returns `404 Not Found`. A malformed MongoDB ID is reported as a clear `400` error.

## How the parts work together

The browser displays the page from the `public` folder. Its JavaScript sends `fetch()` requests to Express at `/api/books`. Express checks the request, then uses the Mongoose `Book` model to read or change documents in MongoDB. Express sends JSON back, and the browser updates the shelf. The browser never connects to MongoDB directly, so the database connection string stays on the server in `.env`.

## Viva: quick explanation

**What is BookBuddy?**  
A personal book tracker where I can add, view, edit, delete, filter, and search books.

**What does Express do?**  
Express serves the frontend files and provides HTTP API routes for book operations.

**Why use Mongoose?**  
Mongoose maps JavaScript objects to MongoDB documents and lets me define a schema and validation rules.

**What is CRUD?**  
Create, Read, Update, and Delete—the four main operations supported by the API.

**How does search work?**  
The `search` query parameter is matched against title and author, without case sensitivity.

**Why is MongoDB configured with an environment variable?**  
It keeps machine-specific connection details out of the source code. `.env` is ignored by Git; `.env.example` documents the expected setting without secrets.

**What happens if the user enters an invalid status?**  
The server rejects it with a validation message. Only the three listed statuses are allowed.

**How are invalid book IDs handled?**  
The API checks whether an ID is a valid MongoDB ObjectId before querying. Invalid IDs return a readable `400` response.
