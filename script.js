const root = document.documentElement;
const body = document.body;
const header = document.querySelector("[data-header]");
const navToggle = document.querySelector("[data-nav-toggle]");
const navLinks = Array.from(document.querySelectorAll("[data-nav] a"));
const themeToggle = document.querySelector("[data-theme-toggle]");
const themeIcon = document.querySelector("[data-theme-icon]");
const bookingForm = document.querySelector("[data-booking-form]");
const yearSlot = document.querySelector("[data-year]");

const phoneNumber = "243812420260";

function setHeaderState() {
  header?.classList.toggle("is-scrolled", window.scrollY > 24);
}

function closeNav() {
  body.classList.remove("nav-open");
  navToggle?.setAttribute("aria-expanded", "false");
}

function setTheme(theme) {
  root.dataset.theme = theme;
  localStorage.setItem("la-case-theme", theme);
  themeIcon.textContent = theme === "dark" ? "☾" : "☀";
  themeToggle?.setAttribute("aria-label", theme === "dark" ? "Passer en mode clair" : "Passer en mode sombre");
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", theme === "dark" ? "#17110d" : "#fff8f5");
}

setTheme(root.dataset.theme || "light");

themeToggle?.addEventListener("click", () => {
  setTheme(root.dataset.theme === "dark" ? "light" : "dark");
});

navToggle?.addEventListener("click", () => {
  const nextState = !body.classList.contains("nav-open");
  body.classList.toggle("nav-open", nextState);
  navToggle.setAttribute("aria-expanded", String(nextState));
});

navLinks.forEach((link) => link.addEventListener("click", closeNav));
window.addEventListener("scroll", setHeaderState, { passive: true });
setHeaderState();

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((link) => {
        link.classList.toggle("is-active", link.getAttribute("href") === `#${entry.target.id}`);
      });
    });
  },
  { rootMargin: "-42% 0px -48% 0px", threshold: 0.01 }
);

navLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean)
  .forEach((section) => sectionObserver.observe(section));

bookingForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(bookingForm);
  const name = data.get("name")?.toString().trim() || "Client";
  const request = data.get("request")?.toString().trim() || "reserver";
  const details = data.get("details")?.toString().trim();
  const message = [
    `Bonjour La Case, je m'appelle ${name}.`,
    `Je souhaite ${request}.`,
    details ? `Details : ${details}` : "",
  ]
    .filter(Boolean)
    .join(" ");

  window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, "_blank", "noopener");
});

if (yearSlot) {
  yearSlot.textContent = new Date().getFullYear();
}
