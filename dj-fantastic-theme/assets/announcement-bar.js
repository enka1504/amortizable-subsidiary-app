(function () {
  const root = document.querySelector('[data-annbar]');
  if (!root) return;

  const track = root.querySelector('[data-annbar-track]');
  const slides = root.querySelectorAll('[data-annbar-slide]');
  let index = 0;
  const interval = Number(root.dataset.interval || 3000);

  function go(i) {
    index = (i + slides.length) % slides.length;
    track.style.transform = `translateX(${-index * 100}%)`;
  }

  setInterval(() => {
    if (slides.length > 1) go(index + 1);
  }, interval);

  // Countdown
  function pad(n) { return String(n).padStart(2, '0'); }

  setInterval(() => {
    document.querySelectorAll('[data-countdown]').forEach(el => {
      const end = new Date(el.dataset.end);
      const diff = Math.max(0, end - new Date());
      const s = Math.floor(diff / 1000);

      el.querySelector('[data-dd]').textContent = Math.floor(s / 86400);
      el.querySelector('[data-hh]').textContent = pad(Math.floor((s % 86400) / 3600));
      el.querySelector('[data-mm]').textContent = pad(Math.floor((s % 3600) / 60));
      el.querySelector('[data-ss]').textContent = pad(s % 60);
    });
  }, 1000);
})();