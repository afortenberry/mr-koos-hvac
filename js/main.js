(function () {
  "use strict";

  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- Mobile nav toggle ---- */
  var navToggle = document.querySelector(".nav-toggle");
  var mobileNav = document.querySelector(".mobile-nav");

  if (navToggle && mobileNav) {
    navToggle.addEventListener("click", function () {
      var isOpen = navToggle.getAttribute("aria-expanded") === "true";
      navToggle.setAttribute("aria-expanded", String(!isOpen));
      mobileNav.classList.toggle("is-open", !isOpen);
      document.body.style.overflow = !isOpen ? "hidden" : "";
    });

    mobileNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        navToggle.setAttribute("aria-expanded", "false");
        mobileNav.classList.remove("is-open");
        document.body.style.overflow = "";
      });
    });

    // Escape closes the mobile menu (keyboard escape route)
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && mobileNav.classList.contains("is-open")) {
        navToggle.setAttribute("aria-expanded", "false");
        mobileNav.classList.remove("is-open");
        document.body.style.overflow = "";
        navToggle.focus();
      }
    });
  }

  /* ---- Active nav link highlighting ---- */
  var currentPath = window.location.pathname.replace(/\/index\.html$/, "/").replace(/\/$/, "") || "/";
  document.querySelectorAll("[data-nav-link]").forEach(function (link) {
    var linkPath = link
      .getAttribute("href")
      .replace(/\/index\.html$/, "/")
      .replace(/^\.\//, "/")
      .replace(/\/$/, "") || "/";
    if (linkPath === currentPath || (linkPath !== "/" && currentPath.endsWith(linkPath))) {
      link.setAttribute("aria-current", "page");
    }
  });

  /* ---- Scroll reveal ---- */
  var revealEls = document.querySelectorAll(".reveal");
  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  } else {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el, i) {
      el.style.setProperty("--stagger-i", i % 6);
      revealObserver.observe(el);
    });

    // Safety net: if the observer never fires (unusual embedding context,
    // throttled background tab, etc.), don't leave content hidden forever.
    setTimeout(function () {
      revealEls.forEach(function (el) { el.classList.add("is-visible"); });
      revealObserver.disconnect();
    }, 2500);
  }

  /* ---- Accordion (service FAQs) ---- */
  document.querySelectorAll(".accordion-trigger").forEach(function (trigger) {
    trigger.addEventListener("click", function () {
      var panel = document.getElementById(trigger.getAttribute("aria-controls"));
      var isOpen = trigger.getAttribute("aria-expanded") === "true";
      trigger.setAttribute("aria-expanded", String(!isOpen));
      if (panel) panel.classList.toggle("is-open", !isOpen);
    });
  });

  /* ---- Footer year ---- */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });

  /* ---- Contact form (front-end only — no backend wired up yet) ---- */
  var contactForm = document.getElementById("contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var valid = true;

      contactForm.querySelectorAll("[data-required]").forEach(function (field) {
        var wrapper = field.closest(".field");
        var filled = field.value.trim().length > 0;
        if (field.type === "email" && filled) {
          filled = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value.trim());
        }
        if (wrapper) wrapper.classList.toggle("has-error", !filled);
        if (!filled) valid = false;
      });

      if (!valid) {
        var firstError = contactForm.querySelector(".has-error input, .has-error select, .has-error textarea");
        if (firstError) firstError.focus();
        return;
      }

      var successBox = document.getElementById("form-success");
      contactForm.setAttribute("hidden", "hidden");
      if (successBox) {
        successBox.classList.add("is-visible");
        successBox.setAttribute("tabindex", "-1");
        successBox.focus();
      }
    });

    contactForm.querySelectorAll("[data-required]").forEach(function (field) {
      field.addEventListener("input", function () {
        var wrapper = field.closest(".field");
        if (wrapper) wrapper.classList.remove("has-error");
      });
    });
  }
})();
