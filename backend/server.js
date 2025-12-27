const express = require("express");
const cors = require("cors");
const multer = require("multer");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

// ---------- CREATE APP ----------
const app = express();
app.use(express.json());
app.use(cors());

// ---------- ROUTES ----------
const analysisRoutes = require("./routes/analysis");
app.use("/", analysisRoutes);

// ---------- OPTIONAL PDF CANVAS FIX ----------
global.DOMMatrix = require("canvas").DOMMatrix;

const pdfParse = require("pdf-parse-fixed");
const mammoth = require("mammoth");

// ---------- MONGO CONNECTION ----------
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("Mongo error:", err.message));

// ---------- MULTER ----------
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ---------- UPLOAD ROUTE ----------
app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    let text = "";

    if (req.file.mimetype === "application/pdf") {
      const data = await pdfParse(req.file.buffer).catch(() => ({ text: "" }));
      text = data.text || "";
    } else {
      const result = await mammoth
        .extractRawText({ buffer: req.file.buffer })
        .catch(() => ({ value: "" }));
      text = result.value || "";
    }

    res.json({ text });
  } catch (err) {
    console.error("UPLOAD ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

// ---------- START SERVER ----------
app.listen(process.env.PORT || 5000, () =>
  console.log(`Server running on port ${process.env.PORT || 5000}`)
);
