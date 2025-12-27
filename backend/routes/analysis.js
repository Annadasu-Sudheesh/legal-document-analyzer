const express = require("express");
const router = express.Router();
const Groq = require("groq-sdk");
const Analysis = require("../models/AnalysisModel");

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

router.post("/analyze", async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || text.trim() === "") {
      return res.status(400).json({ error: "Empty text" });
    }

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",

      response_format: { type: "json_object" },

      messages: [
        {
          role: "user",
          content: `
Analyze this legal / contract document.
Return ONLY valid JSON in exactly this format:

{
 "summary": "short 3–5 line overview",
 "clauses": ["clause1","clause2","clause3"],
 "risks": ["risk1","risk2","risk3"]
}

Document:
${text}
`
        }
      ]
    });

    const aiText = completion.choices[0].message.content.trim();

    console.log("RAW AI RESPONSE:", aiText);

    let json;
    try {
      json = JSON.parse(aiText);
    } catch {
      return res.json({
        summary: "No summary returned",
        clauses: [],
        risks: []
      });
    }

    await Analysis.create({
      text,
      summary: json.summary || "",
      clauses: json.clauses || [],
      risks: json.risks || []
    });

    res.json(json);

  } catch (err) {
    console.error("ANALYZE ERROR:", err?.response?.data || err);
    res.status(500).json({ error: "AI failed" });
  }
});

module.exports = router;
