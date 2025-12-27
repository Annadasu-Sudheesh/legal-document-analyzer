import React, { useState } from "react";
import { FaFilePdf, FaMagic, FaShieldAlt, FaListUl } from "react-icons/fa";
import { MdDangerous } from "react-icons/md";

function App() {
  const [file, setFile] = useState(null);
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const uploadFile = async () => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("http://localhost:5000/upload", {
      method: "POST",
      body: formData
    });

    const data = await res.json();
    setText(data.text);
  };

  const analyze = async () => {
    setLoading(true);

    const res = await fetch("http://localhost:5000/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text })
    });

    const data = await res.json();
    setResult(data);

    setLoading(false);
  };

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>
        <FaFilePdf /> Legal Document Analyzer
      </h1>

      {/* Upload section */}
      <div style={styles.card}>
        <h2>Upload PDF</h2>

        <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        <button style={styles.primaryBtn} onClick={uploadFile}>
          Upload & Extract Text
        </button>
      </div>

      {/* Extracted text */}
      <div style={styles.card}>
        <h2>Extracted Text</h2>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          style={styles.textarea}
        />

        <button style={styles.analyzeBtn} onClick={analyze}>
          {loading ? "Analyzing..." : <><FaMagic /> Analyze Document</>}
        </button>
      </div>

      {/* Result section */}
      {result && (
        <>
          <div style={styles.card}>
            <h2>Summary</h2>
            <p>{result.summary}</p>
          </div>

          <div style={styles.card}>
            <h2><FaListUl /> Clauses</h2>
            {result.clauses?.map((c, i) => (
              <div key={i} style={styles.badge}>{c}</div>
            ))}
          </div>

          <div style={styles.card}>
            <h2><MdDangerous /> Risks</h2>
            {result.risks?.map((r, i) => (
              <div key={i} style={styles.dangerBadge}>{r}</div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    padding: "30px",
    background:
      "linear-gradient(135deg, #e3f2fd, #f3e5f5)"
  },

  title: {
    textAlign: "center",
    marginBottom: "20px",
    fontSize: "36px",
    fontWeight: "bold"
  },

  card: {
    background: "rgba(255,255,255,0.8)",
    backdropFilter: "blur(12px)",
    padding: "20px",
    borderRadius: "18px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
    marginBottom: "20px"
  },

  textarea: {
    width: "100%",
    minHeight: "130px",
    padding: "10px",
    fontSize: "14px",
    borderRadius: "10px"
  },

  primaryBtn: {
    marginTop: "10px",
    padding: "8px 12px",
    borderRadius: "10px",
    background: "#1976d2",
    color: "white",
    border: "none",
    cursor: "pointer"
  },

  analyzeBtn: {
    marginTop: "10px",
    padding: "10px 16px",
    borderRadius: "50px",
    background: "#2ecc71",
    color: "white",
    border: "none",
    cursor: "pointer",
    fontWeight: "bold"
  },

  badge: {
    padding: "6px 10px",
    background: "#e3f2fd",
    borderRadius: "8px",
    margin: "4px 0"
  },

  dangerBadge: {
    padding: "6px 10px",
    background: "#ffebee",
    color: "#c62828",
    borderRadius: "8px",
    margin: "4px 0"
  }
};

export default App;
