/* =========================================================
   Scroll reveal — quiet fade/rise for elements marked .reveal
   ========================================================= */
function initScrollReveal() {
  const targets = document.querySelectorAll(".reveal");
  if (!targets.length) return;

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    targets.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
  );

  targets.forEach((el) => observer.observe(el));
}

/* =========================================================
   Contact form — real submission via Formspree
   ========================================================= */
function initContactForm() {
  const form = document.querySelector(".contact-form");
  if (!form) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const submitBtn = form.querySelector("button[type='submit']");
    const originalLabel = submitBtn.innerHTML;

    let note = form.querySelector(".form-note");
    if (!note) {
      note = document.createElement("p");
      note.className = "form-note";
      form.appendChild(note);
    }

    if (form.action.includes("YOUR_FORM_ID")) {
      note.textContent = "Form isn't connected yet — add your Formspree endpoint in contact.html.";
      note.style.color = "#f87171";
      note.classList.remove("form-note--show");
      void note.offsetWidth;
      note.classList.add("form-note--show");
      return;
    }

    submitBtn.disabled = true;
    submitBtn.innerHTML = "Sending…";

    try {
      const response = await fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      });

      if (response.ok) {
        note.textContent = "// message received — thank you!";
        note.style.color = "var(--green)";
        form.reset();
      } else {
        note.textContent = "Something went wrong — please try again or email me directly.";
        note.style.color = "#f87171";
      }
    } catch (err) {
      note.textContent = "Something went wrong — please check your connection and try again.";
      note.style.color = "#f87171";
    }

    note.classList.remove("form-note--show");
    void note.offsetWidth;
    note.classList.add("form-note--show");

    submitBtn.disabled = false;
    submitBtn.innerHTML = originalLabel;
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initScrollReveal();
  initContactForm();
});
