const express = require("express");
const cors = require("cors");
require("dotenv").config();
const db = require("./db");
const lostRoutes = require("./routes/lostRoutes");
const foundRoutes = require("./routes/foundRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// db.query("SELECT 1", (err) => {
//   if (err) {
//     console.error("Database connection test failed:", err.message);
//     return;
//   }
//   console.log("Database connected successfully");
// });

(async () => {
  try {
    await db.query("SELECT 1");
    console.log("Database connected successfully");
  } catch (err) {
    console.error("Database connection failed:", err);
  }
})();

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

app.use("/lost-items", lostRoutes);
app.use("/found-items", foundRoutes);

const PORT = process.env.PORT ? Number(process.env.PORT) : 5000;

app.listen(PORT, () => {
  console.log(`Backend listening on port ${PORT}`);
});

