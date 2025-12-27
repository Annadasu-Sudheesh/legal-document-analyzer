const mongoose = require("mongoose");

const AnalysisSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    summary: { type: String, default: "" },
    clauses: { type: [String], default: [] },
    risks: { type: [String], default: [] }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Analysis", AnalysisSchema);
