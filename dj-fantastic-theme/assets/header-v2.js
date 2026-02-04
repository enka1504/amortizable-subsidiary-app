(() => {
  // Countdown
  const nodes = document.querySelectorAll("[data-countdown]");
  nodes.forEach((el) => {
    const endRaw = el.getAttribute("data-end");
    const end = endRaw ? new Date(endRaw).getTime() : NaN;
    if (!Number.isFinite(end)) return;

    const $d = el.querySelector("[data-days]");
    const $h = el.querySelector("[data-hours]");
    const $m = el.querySelector("[data-mins]");
    const $s = el.querySelector("[data-secs]");

    const pad = (n) => String(Math.max(0, n)).padStart(2, "0");

    const tick = () => {
      const now = Date.now();
      let diff = Math.max(0, end - now);

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      diff -= days * (1000 * 60 * 60 * 24);
      const hours = Math.floor(diff / (1000 * 60 * 60));
      diff -= hours * (1000 * 60 * 60);
      const mins = Math.floor(diff / (1000 * 60));
      diff -= mins * (1000 * 60);
      const secs = Math.floor(diff / 1000);

      if ($d) $d.textContent = pad(days);
      if ($h) $h.textContent = pad(hours);
      if ($m) $m.textContent = pad(mins);
      if ($s) $s.textContent = pad(secs);
    };

    tick();
    const t = setInterval(tick, 1000);
    // stop if removed
    const obs = new MutationObserver(() => {
      if (!document.body.contains(el)) {
        clearInterval(t);
        obs.disconnect();
      }
    });
    obs.observe(document.body, { childList: true, subtree: true });
  });

  // Drawer menu
  const menuBtn = document.querySelector("[data-hdr2-menu]");
  const drawer = document.querySelector("[data-hdr2-drawer]");
  const closeBtns = document.querySelectorAll("[data-hdr2-close]");
  const open = () => { if (drawer) drawer.hidden = false; };
  const close = () => { if (drawer) drawer.hidden = true; };

  if (menuBtn && drawer) {
    menuBtn.addEventListener("click", open);
    closeBtns.forEach((b) => b.addEventListener("click", close));
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") close();
    });
  }

  // Localization auto-submit
  const locForm = document.getElementById("hdr2Localization");
  if (locForm) {
    const sel = locForm.querySelector("select");
    if (sel) sel.addEventListener("change", () => locForm.submit());
  }

  // Optional theme toggle hook (no-op by default)
  const themeBtn = document.querySelector("[data-hdr2-theme]");
  if (themeBtn) {
    themeBtn.addEventListener("click", () => {
      document.documentElement.classList.toggle("theme-dark");
    });
  }
})();
