const express = require("express");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzEBTz3tfaosnABdrFisbxmGzVCZjEwMlI172m-b5fXFPpaoZ3nNLgoQKJfR9owV1G1Bw/exec";

app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use(express.static(path.join(__dirname, "public")));

let phrases = [];
app.get("/api/phrases", (req, res) => {
  res.json(phrases);
});

app.post("/api/phrases", async (req, res) => {
  const { phrase } = req.body;

  if (!phrase || !phrase.trim()) {
    return res.status(400).json({ error: "Frase vacía" });
  }

  const cleanPhrase = phrase.trim().slice(0, 300);
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

  try {
    const r = await fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phrase: cleanPhrase, ip })
    });

    const out = await r.json();
    if (!out.ok) throw new Error(out.error || "Error en Apps Script");

    const item = {
      id: out.id,
      phrase: cleanPhrase,
      timestamp: out.timestamp
    };

    phrases.push(item);
    res.json(item);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "No se pudo guardar en Google Sheets" });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor listo en http://localhost:${PORT}`);
});





