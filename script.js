const header = document.getElementById("site-header");
const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.getElementById("site-nav");
const copyButton = document.querySelector("[data-copy-email]");
const copyFeedback = document.querySelector("[data-copy-feedback]");
const revealItems = document.querySelectorAll(".reveal");
const hoverName = document.querySelector("[data-hover-name]");
const hoverTooltip = document.querySelector("[data-name-tooltip]");
const cursorTooltipTriggers = document.querySelectorAll("[data-cursor-tooltip]");
let copyFeedbackTimeout = null;
let isCopyTooltipPinned = false;
let isNameTooltipActive = false;
let floatingTooltip = null;
let cursorTooltip = null;
let isCursorTooltipActive = false;

function updateHeaderState() {
  if (!header) {
    return;
  }

  header.classList.toggle("is-scrolled", window.scrollY > 24);
}

function closeNav() {
  if (!header || !navToggle || !siteNav) {
    return;
  }

  header.classList.remove("is-open");
  document.body.classList.remove("nav-open");
  navToggle.setAttribute("aria-expanded", "false");
}

function toggleNav() {
  if (!header || !navToggle || !siteNav) {
    return;
  }

  const isOpen = header.classList.toggle("is-open");
  document.body.classList.toggle("nav-open", isOpen);
  navToggle.setAttribute("aria-expanded", String(isOpen));
}

async function copyEmailToClipboard() {
  const email = "magdabszcz@gmail.com";

  if (!copyFeedback || !copyButton) {
    return;
  }

  if (copyFeedbackTimeout) {
    window.clearTimeout(copyFeedbackTimeout);
  }

  try {
    await navigator.clipboard.writeText(email);
    copyFeedback.textContent = "Email copied";
    copyFeedback.classList.add("is-visible", "is-success");
  } catch (error) {
    copyFeedback.textContent = "Copy failed. Please copy the address manually.";
    copyFeedback.classList.add("is-visible");
    copyFeedback.classList.remove("is-success");
  }

  isCopyTooltipPinned = true;

  copyFeedbackTimeout = window.setTimeout(() => {
    isCopyTooltipPinned = false;
    copyFeedback.textContent = "Copy email";
    copyFeedback.classList.remove("is-visible", "is-success");
  }, 2200);
}

function initCopyTooltip() {
  if (!copyButton || !copyFeedback || window.matchMedia("(hover: none)").matches) {
    return;
  }

  copyButton.addEventListener("mouseenter", () => {
    if (isCopyTooltipPinned) {
      return;
    }

    copyFeedback.textContent = "Copy email";
    copyFeedback.classList.remove("is-success");
    copyFeedback.classList.add("is-visible");
  });

  copyButton.addEventListener("mouseleave", () => {
    if (isCopyTooltipPinned) {
      return;
    }

    copyFeedback.classList.remove("is-visible", "is-success");
  });

  copyButton.addEventListener("focus", () => {
    if (isCopyTooltipPinned) {
      return;
    }

    copyFeedback.textContent = "Copy email";
    copyFeedback.classList.remove("is-success");
    copyFeedback.classList.add("is-visible");
  });

  copyButton.addEventListener("blur", () => {
    if (isCopyTooltipPinned) {
      return;
    }

    copyFeedback.classList.remove("is-visible", "is-success");
  });
}

function initRevealAnimations() {
  if (!revealItems.length || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
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
    {
      threshold: 0.14,
      rootMargin: "0px 0px -40px 0px"
    }
  );

  revealItems.forEach((item) => observer.observe(item));
}

function updateNameTooltipPosition(pointerClientX, pointerClientY) {
  if (!floatingTooltip || !isNameTooltipActive) {
    return;
  }

  const offsetX = 20;
  const offsetY = 20;
  const tooltipHeight = floatingTooltip.offsetHeight || 70;
  const left = pointerClientX + offsetX;
  const top = pointerClientY - tooltipHeight - offsetY;

  floatingTooltip.style.left = `${left}px`;
  floatingTooltip.style.top = `${top}px`;
}

function initNameTooltip() {
  if (!hoverName || !hoverTooltip || window.matchMedia("(hover: none)").matches) {
    return;
  }

  floatingTooltip = document.createElement("div");
  floatingTooltip.className = "hero-name-tooltip-floating";
  floatingTooltip.setAttribute("aria-hidden", "true");
  floatingTooltip.innerHTML = hoverTooltip.innerHTML;
  document.body.appendChild(floatingTooltip);

  const syncTooltipToCursor = (event) => {
    updateNameTooltipPosition(event.clientX, event.clientY);
  };

  hoverName.addEventListener("mouseenter", (event) => {
    isNameTooltipActive = true;
    floatingTooltip.classList.add("is-active");
    syncTooltipToCursor(event);
  });

  hoverName.addEventListener("mousemove", syncTooltipToCursor);

  hoverName.addEventListener("mouseleave", () => {
    isNameTooltipActive = false;
    floatingTooltip.classList.remove("is-active");
  });
}

function updateCursorTooltipPosition(pointerClientX, pointerClientY) {
  if (!cursorTooltip || !isCursorTooltipActive) {
    return;
  }

  const offsetX = 20;
  const offsetY = 20;
  const tooltipHeight = cursorTooltip.offsetHeight || 48;
  cursorTooltip.style.left = `${pointerClientX + offsetX}px`;
  cursorTooltip.style.top = `${pointerClientY - tooltipHeight - offsetY}px`;
}

function initCursorTooltips() {
  if (!cursorTooltipTriggers.length || window.matchMedia("(hover: none)").matches) {
    return;
  }

  cursorTooltip = document.createElement("div");
  cursorTooltip.className = "hero-name-tooltip-floating hero-name-tooltip-floating-single";
  cursorTooltip.setAttribute("aria-hidden", "true");
  document.body.appendChild(cursorTooltip);

  cursorTooltipTriggers.forEach((trigger) => {
    const syncTooltipToCursor = (event) => {
      updateCursorTooltipPosition(event.clientX, event.clientY);
    };

    trigger.addEventListener("mouseenter", (event) => {
      const tooltipText = trigger.getAttribute("data-cursor-tooltip");
      if (!tooltipText) {
        return;
      }

      isCursorTooltipActive = true;
      cursorTooltip.textContent = tooltipText;
      cursorTooltip.classList.add("is-active");
      syncTooltipToCursor(event);
    });

    trigger.addEventListener("mousemove", syncTooltipToCursor);

    trigger.addEventListener("mouseleave", () => {
      isCursorTooltipActive = false;
      cursorTooltip.classList.remove("is-active");
    });
  });
}

updateHeaderState();
window.addEventListener("scroll", updateHeaderState, { passive: true });

if (navToggle) {
  navToggle.addEventListener("click", toggleNav);
}

document.querySelectorAll(".site-nav a").forEach((link) => {
  link.addEventListener("click", closeNav);
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 991) {
    closeNav();
  }
});

if (copyButton) {
  copyButton.addEventListener("click", copyEmailToClipboard);
}

initRevealAnimations();
initNameTooltip();
initCopyTooltip();
initCursorTooltips();
