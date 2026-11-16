(function () {
  const W = window.WEDDING;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const store = {
    get(k, d) { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* private mode */ } }
  };
  function toast(msg) {
    const t = $("#toast"); t.textContent = msg; t.classList.add("show");
    clearTimeout(toast._t); toast._t = setTimeout(() => t.classList.remove("show"), 2200);
  }

  /* ---------- Điền nội dung từ config ---------- */
  const keys = {
    groomName: W.groom.name, brideName: W.bride.name,
    groomIntro: W.groom.intro, brideIntro: W.bride.intro, dateText: W.dateText, lunarText: W.lunarText
  };
  $$("[data-k]").forEach(el => { el.textContent = keys[el.dataset.k] ?? ""; });
  $$("[data-src-k]").forEach(el => {
    const p = { groomPhoto: W.groom.photo, bridePhoto: W.bride.photo }[el.dataset.srcK];
    el.srcset = `${p} 1066w, ${p.replace(/\.jpg$/, "-lg.jpg")} 1466w`;
    el.sizes = "(min-width: 900px) 420px, 80vw";
    el.src = p;
  });

  // Tên khách: ?to=Anh%20Tu%E1%BA%A5n
  // Một số app (Messenger, Zalo) mã hoá link thêm lần nữa → giải mã tới khi hết "%xx".
  function cleanName(raw) {
    let s = raw || "";
    for (let i = 0; i < 3 && /%[0-9a-f]{2}/i.test(s); i++) {
      try { s = decodeURIComponent(s); } catch { break; }
    }
    return s.replace(/\+/g, " ").replace(/\s+/g, " ").trim().slice(0, 60);
  }
  const guest = cleanName(new URLSearchParams(location.search).get("to"));
  if (guest) {
    $("#guestName").textContent = guest;
    $("#guestLine").hidden = false;
  }

  /* ---------- Mở thiệp ---------- */
  const audio = $("#music"), musicBtn = $("#musicBtn");
  if (W.music) {
    audio.src = W.music;
    audio.addEventListener("error", () => { musicBtn.hidden = true; });
    musicBtn.hidden = false;
  }
  function setPlaying(on) { musicBtn.classList.toggle("playing", on); }
  function playMusic() { if (!W.music) return; audio.play().then(() => setPlaying(true)).catch(() => setPlaying(false)); }
  musicBtn.addEventListener("click", () => { if (audio.paused) playMusic(); else { audio.pause(); setPlaying(false); } });

  $("#openBtn").addEventListener("click", () => {
    const op = $("#opener");
    op.classList.add("open");
    document.body.classList.remove("locked");
    $("#fab").hidden = false;
    playMusic();
    Petals.start();
    WishToast.start();
    setTimeout(() => op.classList.add("gone"), 1700);
  });

  /* ---------- Scroll reveal ---------- */
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
  }), { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });
  const observeReveal = root => $$("[data-reveal]", root).forEach(el => io.observe(el));

  /* ---------- Lịch tháng ---------- */
  (function calendar() {
    const { year, month, highlight } = W.calendar;
    const first = new Date(year, month - 1, 1).getDay(); // 0 = CN
    const days = new Date(year, month, 0).getDate();
    const offset = (first + 6) % 7; // tuần bắt đầu từ Thứ 2
    let h = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"].map(d => `<span class="dow">${d}</span>`).join("");
    for (let i = 0; i < offset; i++) h += "<span></span>";
    for (let d = 1; d <= days; d++) h += `<span class="d${highlight.includes(d) ? " hl" : ""}">${d}</span>`;
    $("#calendar").innerHTML = h;
  })();

  /* ---------- Đếm ngược ---------- */
  (function countdown() {
    const target = new Date(W.countdownTo).getTime();
    const pad = n => String(n).padStart(2, "0");
    function tick() {
      let s = Math.max(0, Math.floor((target - Date.now()) / 1000));
      const d = Math.floor(s / 86400); s %= 86400;
      const h = Math.floor(s / 3600); s %= 3600;
      $("#cd-d").textContent = d; $("#cd-h").textContent = pad(h);
      $("#cd-m").textContent = pad(Math.floor(s / 60)); $("#cd-s").textContent = pad(s % 60);
    }
    tick(); setInterval(tick, 1000);
  })();

  /* ---------- Sự kiện ---------- */
  $("#eventList").innerHTML = W.events.map((e, i) => {
    const slots = (e.slots || []).map(s => `<li>
        <span class="slot-time">${esc(s.time)}</span>
        <span class="slot-date">${esc(s.date)}<small>${esc(s.lunar || "")}</small></span>
      </li>`).join("");
    return `<article class="event" data-reveal="${i % 2 ? "right" : "left"}">
      <div class="side">${esc(e.side)}</div>
      <h3>${esc(e.title)}</h3>
      ${slots ? `<ul class="slots">${slots}</ul>` : `<p class="when tbd">Thời gian đang cập nhật</p>`}
      <p class="place">${esc(e.place)}</p>
      <p class="addr">${esc(e.address)}</p>
      <a class="btn" href="${esc(e.map)}" target="_blank" rel="noopener">📍 Xem chỉ đường</a>
    </article>`;
  }).join("");

  /* ---------- Album + lightbox ---------- */
  $("#album").innerHTML = W.album.map((src, i) =>
    `<button data-i="${i}" data-reveal="zoom" aria-label="Xem ảnh ${i + 1}"><img src="${esc(src)}" alt="Ảnh cưới ${i + 1}" loading="lazy" decoding="async"></button>`
  ).join("");
  const lb = $("#lightbox"), lbImg = $("img", lb);
  let cur = 0;
  const show = i => { cur = (i + W.album.length) % W.album.length; lbImg.src = W.album[cur]; };
  $("#album").addEventListener("click", e => {
    const b = e.target.closest("button[data-i]"); if (!b) return;
    show(+b.dataset.i); lb.hidden = false;
  });
  $(".prev", lb).onclick = () => show(cur - 1);
  $(".next", lb).onclick = () => show(cur + 1);
  lb.addEventListener("click", e => { if (e.target === lb || e.target.closest("[data-close]")) lb.hidden = true; });
  let sx = null;
  lb.addEventListener("touchstart", e => { sx = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener("touchend", e => {
    if (sx === null) return;
    const dx = e.changedTouches[0].clientX - sx; sx = null;
    if (Math.abs(dx) > 40) show(cur + (dx < 0 ? 1 : -1));
  });

  /* ---------- Gửi dữ liệu lên Google Sheet ---------- */
  async function send(type, data) {
    if (!W.sheetEndpoint) return false;
    await fetch(W.sheetEndpoint, { method: "POST", mode: "no-cors", headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ type, ...data, guestLink: guest, at: new Date().toISOString() }) });
    return true;
  }

  /* ---------- Lời chúc ---------- */
  const wishList = $("#wishList");
  function renderWishes(list) {
    wishList.innerHTML = list.length
      ? list.map(w => `<div class="wish"><b>${esc(w.name)}</b><p>${esc(w.message)}</p></div>`).join("")
      : `<p class="wish-empty">Hãy là người đầu tiên gửi lời chúc tới cô dâu chú rể ♥</p>`;
  }

  // 💡 Gợi ý lời chúc
  const IDEAS = [
    "Chúc hai bạn trăm năm hạnh phúc, đầu bạc răng long 💕",
    "Chúc Khang & Hằng mãi yêu thương, sớm có tin vui nhé 👶",
    "Chúc mừng hạnh phúc! Chúc hai bạn luôn bên nhau qua mọi thăng trầm ❤️",
    "Chúc cô dâu chú rể bách niên giai lão, sắt son trọn đời 🥰",
    "Chúc gia đình nhỏ luôn ngập tràn tiếng cười và bình an 🏡",
    "Chúc hai bạn mãi giữ được nụ cười như trong ngày cưới hôm nay 😊",
    "Happy wedding! Chúc hai bạn hạnh phúc viên mãn 🎉"
  ];
  let ideaIdx = Math.floor(Math.random() * IDEAS.length);
  $("#ideaBtn").addEventListener("click", () => {
    const ta = $("#wishForm [name=message]");
    ta.value = IDEAS[ideaIdx++ % IDEAS.length];
    ta.focus();
  });

  // Thông báo lời chúc chạy lần lượt ở góc màn hình
  const WishToast = (function () {
    const el = $("#wishToast");
    let i = 0, timer = null;
    function next() {
      if (!wishes.length) { timer = setTimeout(next, 4000); return; }
      const w = wishes[i++ % wishes.length];
      $(".wt-name", el).textContent = w.name;
      $(".wt-msg", el).textContent = w.message;
      el.classList.remove("show"); void el.offsetWidth; el.classList.add("show");
      timer = setTimeout(() => { el.classList.remove("show"); timer = setTimeout(next, 2500); }, 4500);
    }
    return { start() { if (!timer) timer = setTimeout(next, 3500); } };
  })();
  let wishes = store.get("wishes", []);
  renderWishes(wishes);
  if (W.sheetEndpoint) {
    fetch(W.sheetEndpoint + (W.sheetEndpoint.includes("?") ? "&" : "?") + "type=wishes")
      .then(r => r.json()).then(list => { if (Array.isArray(list)) { wishes = list; renderWishes(list); } })
      .catch(() => {});
  }
  $("#wishForm").addEventListener("submit", async e => {
    e.preventDefault();
    const f = e.target, msg = $(".form-msg", f), btn = $(".wish-submit", f);
    const w = { name: f.elements.name.value.trim(), message: f.elements.message.value.trim() };
    if (!w.name || !w.message) return;
    btn.disabled = true;
    try {
      const remote = await send("wish", w);
      wishes = [w, ...wishes];
      if (!remote) store.set("wishes", wishes);
      renderWishes(wishes);
      f.elements.message.value = "";
      wishList.scrollTop = 0;
      msg.textContent = "Cảm ơn lời chúc của bạn ♥";
      Petals.burst();
    } catch { msg.textContent = "Gửi chưa được, bạn thử lại giúp mình nhé."; }
    btn.disabled = false;
  });

  /* ---------- Hộp mừng cưới (VietQR) ---------- */
  function drawQR(text, caption) {
    const qr = qrcode(0, "M"); qr.addData(text); qr.make();
    const n = qr.getModuleCount(), cell = 10, pad = 40, size = n * cell + pad * 2, capH = caption ? 90 : 0;
    const c = document.createElement("canvas"); c.width = size; c.height = size + capH;
    const g = c.getContext("2d");
    g.fillStyle = "#fff"; g.fillRect(0, 0, c.width, c.height);
    g.fillStyle = "#2f3a2e";
    for (let r = 0; r < n; r++) for (let col = 0; col < n; col++) if (qr.isDark(r, col)) g.fillRect(pad + col * cell, pad + r * cell, cell, cell);
    if (caption) {
      g.textAlign = "center"; g.fillStyle = "#7a2e3a";
      g.font = "600 30px 'Be Vietnam Pro', sans-serif"; g.fillText(caption[0], size / 2, size + 22);
      g.fillStyle = "#2b2b2b"; g.font = "400 26px 'Be Vietnam Pro', sans-serif"; g.fillText(caption[1], size / 2, size + 62);
    }
    return c;
  }
  function buildGifts() {
    const box = $("#giftCards"); box.innerHTML = "";
    W.gifts.forEach(gft => {
      const card = document.createElement("div"); card.className = "gift-card";
      const bankName = VietQR.bankName(gft.bank);
      const data = gft.qr || (bankName ? VietQR.payload(gft.bank, gft.account, "Mung cuoi") : null);
      card.innerHTML = `<h4>${esc(gft.label)}</h4><div class="qr-slot"></div>
        <p class="holder">${esc(gft.holder)}</p><p class="acc">${esc(gft.account)}</p>
        <p class="bank">${esc(bankName || "Ngân hàng: đang cập nhật")}</p>
        <div class="gift-actions"><button class="btn ghost" data-copy>Sao chép STK</button>${data ? `<button class="btn" data-dl>Tải ảnh QR</button>` : ""}</div>`;
      const slot = $(".qr-slot", card);
      let canvas = null;
      if (data && typeof qrcode === "function") {
        canvas = drawQR(data, [gft.holder, `${bankName} · ${gft.account}`]);
        slot.appendChild(canvas);
      } else {
        slot.innerHTML = `<div class="qr-missing">Mã QR sẽ hiển thị khi cập nhật ngân hàng</div>`;
      }
      $("[data-copy]", card).onclick = () => {
        const done = () => toast("Đã sao chép số tài khoản");
        if (navigator.clipboard) navigator.clipboard.writeText(gft.account).then(done, () => toast(gft.account));
        else toast(gft.account);
      };
      const dl = $("[data-dl]", card);
      if (dl && canvas) dl.onclick = () => {
        const a = document.createElement("a");
        a.href = canvas.toDataURL("image/png"); a.download = `QR-mung-cuoi-${gft.holder.replace(/\s+/g, "-")}.png`; a.click();
      };
      box.appendChild(card);
    });
  }
  const modal = $("#giftModal");
  let giftsBuilt = false;
  $$("[data-open-gift]").forEach(b => b.addEventListener("click", () => {
    if (!giftsBuilt) { buildGifts(); giftsBuilt = true; }
    modal.hidden = false;
  }));
  modal.addEventListener("click", e => { if (e.target === modal || e.target.closest("[data-close]")) modal.hidden = true; });
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") { modal.hidden = true; lb.hidden = true; }
    if (!lb.hidden && e.key === "ArrowRight") show(cur + 1);
    if (!lb.hidden && e.key === "ArrowLeft") show(cur - 1);
  });

  /* ---------- Cánh hoa rơi ---------- */
  const Petals = (function () {
    const cv = $("#petals"), ctx = cv.getContext("2d");
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const colors = ["#f6d6d6", "#fbe9e7", "#ffffff", "#e8c4c4", "#f3e3c3"];
    let ps = [], running = false, dpr = 1;
    function resize() { dpr = Math.min(2, devicePixelRatio || 1); cv.width = innerWidth * dpr; cv.height = innerHeight * dpr; }
    function make(y) {
      return { x: Math.random() * innerWidth, y: y ?? -20, r: 5 + Math.random() * 7, vy: .5 + Math.random() * 1.1,
        vx: -.3 + Math.random() * .6, a: Math.random() * 6.28, va: -.03 + Math.random() * .06, sw: Math.random() * 6.28,
        c: colors[(Math.random() * colors.length) | 0] };
    }
    function frame() {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      ps.forEach(p => {
        p.sw += .02; p.x += p.vx + Math.sin(p.sw) * .6; p.y += p.vy; p.a += p.va;
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.a); ctx.globalAlpha = .85;
        ctx.fillStyle = p.c; ctx.beginPath(); ctx.ellipse(0, 0, p.r, p.r * .55, 0, 0, 6.28); ctx.fill(); ctx.restore();
      });
      ps = ps.filter(p => p.y < innerHeight + 30);
      while (ps.filter(p => !p.extra).length < 22) ps.push(make());
      if (running) requestAnimationFrame(frame);
    }
    addEventListener("resize", resize);
    return {
      start() { if (reduce || running) return; resize(); ps = Array.from({ length: 22 }, () => make(Math.random() * innerHeight)); running = true; frame(); },
      burst() { if (!running) return; for (let i = 0; i < 30; i++) ps.push(Object.assign(make(-10 - Math.random() * 200), { extra: true, vy: 1.5 + Math.random() * 2 })); }
    };
  })();

  observeReveal(document);
})();
