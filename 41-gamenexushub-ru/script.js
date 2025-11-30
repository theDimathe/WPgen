const yearEl = document.getElementById("year");
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

const progressBars = document.querySelectorAll(".progress");
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        const value = bar.getAttribute("data-value");
        let filler = bar.querySelector(".progress__fill");
        if (!filler) {
          filler = document.createElement("span");
          filler.className = "progress__fill";
          filler.dataset.value = value;
          bar.appendChild(filler);
          requestAnimationFrame(() => {
            filler.style.width = `${value}%`;
          });
        }
        observer.unobserve(bar);
      }
    });
  },
  { threshold: 0.4 }
);

progressBars.forEach((bar) => observer.observe(bar));
