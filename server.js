const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use(express.static(path.join(__dirname, "public")));

const CSV_PATH = path.join(__dirname, "phrases.csv");

function ensureCsv() {
  if (!fs.existsSync(CSV_PATH)) {
    fs.writeFileSync(CSV_PATH, "id,phrase,timestamp,ip\n", "utf8");
  }
}

let phrases = [];
ensureCsv();

try {
  const csv = fs.readFileSync(CSV_PATH, "utf8").trim().split("\n");
  for (let i = 1; i < csv.length; i++) {
    const line = csv[i];
    if (!line) continue;

    const firstComma = line.indexOf(",");
    const secondComma = line.indexOf(",", firstComma + 1);
    const thirdComma = line.indexOf(",", secondComma + 1);

    const id = line.slice(0, firstComma);
    const phraseRaw = line.slice(firstComma + 1, secondComma);
    const phrase = phraseRaw.replace(/^"|"$/g, "").replace(/""/g, '"');
    const timestamp = line.slice(secondComma + 1, thirdComma);

    phrases.push({ id: Number(id), phrase, timestamp });
  }
} catch (e) {}

app.get("/api/phrases", (req, res) => {
  res.json(phrases);
});

app.post("/api/phrases", (req, res) => {
  const { phrase } = req.body;
  if (!phrase || !phrase.trim()) {
    return res.status(400).json({ error: "Frase vacía" });
  }

  const cleanPhrase = phrase.trim().slice(0, 300);
  const timestamp = new Date().toISOString();
  const id = phrases.length ? phrases[phrases.length - 1].id + 1 : 1;
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

  const item = { id, phrase: cleanPhrase, timestamp };
  phrases.push(item);

  ensureCsv();
  const escaped = `"${cleanPhrase.replace(/"/g, '""')}"`;
  fs.appendFileSync(CSV_PATH, `${id},${escaped},${timestamp},${ip}\n`, "utf8");

  res.json(item);
});

app.get("/api/phrases.csv", (req, res) => {
  ensureCsv();
  res.download(CSV_PATH, "phrases.csv");
});

app.listen(PORT, () => {
  console.log(`Servidor listo en http://localhost:${PORT}`);
});
