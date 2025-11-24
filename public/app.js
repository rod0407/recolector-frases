const API = "/api/phrases";
const form = document.getElementById("phraseForm");
const input = document.getElementById("phraseInput");
const container = document.getElementById("phrasesContainer");
const statusEl = document.getElementById("status");
const counter = document.getElementById("counter");

// paleta para post-its
const stickyColors = ["--p1","--p2","--p3","--p4","--p5"];

function setStatus(msg, ok=true){
  statusEl.textContent = msg;
  statusEl.className = "status " + (ok ? "ok" : "err");
  if(msg) setTimeout(()=>{ statusEl.textContent=""; statusEl.className="status"; }, 2500);
}

input.addEventListener("input", ()=>{
  counter.textContent = `${input.value.length} / 300`;
});

// random determinístico según id (para que no cambie al recargar)
function mulberry32(seed){
  return function(){
    let t = seed += 0x6D2B79F5;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }
}

function randomRotation(rng){
  const deg = (rng()*10 - 5).toFixed(2); // -5 a 5 grados
  return `${deg}deg`;
}

function randomPosition(rng){
  // dejamos margen para que no salgan pegadas al borde
  const x = 5 + rng()*90; // 5% a 95%
  const y = 4 + rng()*88; // 4% a 92%
  return { x, y };
}

function pickSticky(rng){
  const idx = Math.floor(rng()*stickyColors.length);
  return `var(${stickyColors[idx]})`;
}

function formatTime(iso){
  try{
    const d = new Date(iso);
    return d.toLocaleString();
  }catch{
    return iso;
  }
}

function escapeHtml(str){
  return str
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;");
}

function renderPhrase(p){
  const rng = mulberry32(Number(p.id) * 999); // seed por id
  const { x, y } = randomPosition(rng);

  const note = document.createElement("div");
  note.className = "note";
  note.style.setProperty("--rot", randomRotation(rng));
  note.style.setProperty("--sticky", pickSticky(rng));

  // posiciones absolutas
  note.style.left = `${x}%`;
  note.style.top  = `${y}%`;

  note.innerHTML = `
    <div class="text">${escapeHtml(p.phrase)}</div>
    <div class="meta">
      <span>#${p.id}</span>
      <span>${formatTime(p.timestamp)}</span>
    </div>
  `;

  container.appendChild(note);
}

async function loadPhrases(){
  const res = await fetch(API);
  const data = await res.json();
  container.innerHTML = "";
  data.forEach(renderPhrase);
}

form.addEventListener("submit", async (e)=>{
  e.preventDefault();
  const phrase = input.value.trim();
  if(!phrase){
    setStatus("Escribe algo 🙂", false);
    return;
  }

  try{
    const res = await fetch(API, {
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body: JSON.stringify({ phrase })
    });

    if(!res.ok){
      const err = await res.json().catch(()=>({error:"Error"}));
      throw new Error(err.error || "Error al guardar");
    }

    const saved = await res.json();
    renderPhrase(saved);

    input.value="";
    counter.textContent="0 / 300";
    setStatus("¡Frase guardada!");
  }catch(err){
    setStatus(err.message, false);
  }
});

loadPhrases();
