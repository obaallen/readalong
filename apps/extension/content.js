/**
 * ReadAlong content script: extract page text, show overlay reader, TTS via SpeechSynthesis.
 * Injected when user clicks "Read this page" in popup. Overlay-first MVP.
 */
(function () {
  const OVERLAY_ID = "readalong-overlay-root";

  function getPageText() {
    const main = document.querySelector("article, main, [role='main'], .post-content, .article-body");
    const raw = main ? main.innerText : document.body.innerText;
    return raw || "";
  }

  function splitSentences(text) {
    const parts = text.split(/([.!?]+[\s]+)/g);
    const sentences = [];
    let current = "";
    for (let i = 0; i < parts.length; i++) {
      current += parts[i];
      if (/[.!?]\s*$/.test(current.trim())) {
        const t = current.trim();
        if (t.length > 0) sentences.push(t);
        current = "";
      }
    }
    if (current.trim().length > 0) sentences.push(current.trim());
    return sentences.length > 0 ? sentences : [text.trim() || "(no text)"];
  }

  function createOverlay(sentences) {
    if (document.getElementById(OVERLAY_ID)) {
      document.getElementById(OVERLAY_ID).style.display = "block";
      return;
    }
    const root = document.createElement("div");
    root.id = OVERLAY_ID;
    root.style.cssText = "position:fixed;inset:0;z-index:2147483647;background:rgba(0,0,0,0.85);color:#f5f5f5;font-family:system-ui;overflow:auto;padding:2rem;";
    const shadow = root.attachShadow({ mode: "closed" });
    shadow.innerHTML = `
      <style>
        .toolbar { display:flex; gap:0.5rem; align-items:center; margin-bottom:1rem; flex-wrap:wrap; }
        .toolbar button { padding:0.4rem 0.8rem; border-radius:6px; border:1px solid #666; background:#333; color:#fff; cursor:pointer; }
        .toolbar button:hover { background:#444; }
        .close { margin-left:auto; }
        .content { max-width:42rem; margin:0 auto; line-height:1.6; }
        [data-chunk-id] { cursor:pointer; border-radius:2px; padding:0 2px; }
        [data-chunk-id]:hover { background:rgba(255,255,255,0.08); }
        [data-chunk-id].current { background:rgba(251,191,36,0.35); }
      </style>
      <div class="toolbar">
        <button type="button" id="ra-play">Play</button>
        <button type="button" id="ra-pause">Pause</button>
        <button type="button" id="ra-close" class="close">Close</button>
      </div>
      <div class="content" id="ra-content"></div>
    `;
    const content = shadow.getElementById("ra-content");
    sentences.forEach((text, i) => {
      const span = document.createElement("span");
      span.setAttribute("data-chunk-id", String(i));
      span.textContent = text + (i < sentences.length - 1 ? " " : "");
      content.appendChild(span);
    });
    let currentIndex = 0;
    let playing = false;
    const synth = window.speechSynthesis;
    function speak(index) {
      if (index >= sentences.length) return;
      synth.cancel();
      currentIndex = index;
      shadow.querySelectorAll("[data-chunk-id].current").forEach((el) => el.classList.remove("current"));
      const el = shadow.querySelector(`[data-chunk-id="${index}"]`);
      if (el) {
        el.classList.add("current");
        el.scrollIntoView({ block: "center", behavior: "smooth" });
      }
      const u = new SpeechSynthesisUtterance(sentences[index]);
      u.rate = 1;
      u.onend = () => {
        if (playing && index + 1 < sentences.length) speak(index + 1);
        else playing = false;
      };
      synth.speak(u);
    }
    shadow.getElementById("ra-play").onclick = () => {
      playing = true;
      speak(currentIndex);
    };
    shadow.getElementById("ra-pause").onclick = () => {
      playing = false;
      synth.cancel();
    };
    shadow.getElementById("ra-close").onclick = () => {
      playing = false;
      synth.cancel();
      root.style.display = "none";
    };
    content.addEventListener("click", (e) => {
      const t = e.target.closest("[data-chunk-id]");
      if (t) {
        const id = parseInt(t.getAttribute("data-chunk-id"), 10);
        playing = true;
        speak(id);
      }
    });
    document.body.appendChild(root);
  }

  const text = getPageText();
  const sentences = splitSentences(text);
  createOverlay(sentences);
})();
