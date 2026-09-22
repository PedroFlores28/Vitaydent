const CLINIC = {
  phoneDisplay: "900 123 456",
  phoneTel: "+34900123456",
  whatsapp: "90012345",
  address: "Avenida Zarumilla 896, San Mart\u00edn de Porres",
  addressRef: "Paradero Control",
};

const mapsQuery = encodeURIComponent(CLINIC.address + ", Lima, Per\u00fa");
const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${mapsQuery}`;
const mapsDirUrl = `https://www.google.com/maps/dir/?api=1&destination=${mapsQuery}`;
const mapsEmbedUrl = `https://maps.google.com/maps?q=${mapsQuery}&hl=es&z=16&output=embed`;

const whatsappUrl = (text) =>
  `https://wa.me/${CLINIC.whatsapp}?text=${encodeURIComponent(text)}`;

const year = document.getElementById("year");
if (year) year.textContent = String(new Date().getFullYear());

document.querySelectorAll("[data-phone-text]").forEach((el) => {
  el.textContent = CLINIC.phoneDisplay;
});
document.querySelectorAll("[data-phone-link]").forEach((el) => {
  el.setAttribute("href", `tel:${CLINIC.phoneTel}`);
});
document.querySelectorAll("[data-address]").forEach((el) => {
  el.innerHTML = CLINIC.address.replace(", ", "<br>") + "<br>Ref. " + CLINIC.addressRef;
});
document.querySelectorAll("[data-maps-embed]").forEach((el) => {
  el.setAttribute("src", mapsEmbedUrl);
});
document.querySelectorAll("[data-maps-link]").forEach((el) => {
  el.setAttribute("href", mapsUrl);
});
document.querySelectorAll("[data-maps-dir]").forEach((el) => {
  el.setAttribute("href", mapsDirUrl);
});
document.querySelectorAll("[data-whatsapp-link]").forEach((el) => {
  const text = el.getAttribute("data-wa-text") || "Hola Vitaydent, quiero pedir una cita.";
  el.setAttribute("href", whatsappUrl(text));
});

const nav = document.getElementById("nav");
const toggle = document.getElementById("nav-toggle");
const drop = nav.querySelector(".nav-drop");
const trigger = nav.querySelector(".nav-drop-trigger");
const isMobileNav = () => window.matchMedia("(max-width: 1080px)").matches;

const closeMenu = () => {
  nav.classList.remove("open");
  toggle.setAttribute("aria-expanded", "false");
  if (drop && trigger) {
    drop.classList.remove("open");
    trigger.setAttribute("aria-expanded", "false");
  }
};

if (trigger) {
  trigger.setAttribute("aria-expanded", "false");
  trigger.setAttribute("aria-haspopup", "true");
  trigger.addEventListener("click", (event) => {
    if (!isMobileNav()) return;
    event.preventDefault();
    const open = drop.classList.toggle("open");
    trigger.setAttribute("aria-expanded", String(open));
  });
}

toggle.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  toggle.setAttribute("aria-expanded", String(open));
  if (!open && drop && trigger) {
    drop.classList.remove("open");
    trigger.setAttribute("aria-expanded", "false");
  }
});
nav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    if (link.classList.contains("nav-drop-trigger") && isMobileNav()) return;
    closeMenu();
  });
});

document.querySelectorAll(".treat-card img, .doc-card img, .hero-bg, .about-photo img, .story-media img").forEach((img) => {
  img.addEventListener("error", () => {
    img.removeAttribute("src");
    img.alt = "";
  });
});

document.querySelectorAll(".faq-list details").forEach((item) => {
  const summary = item.querySelector("summary");
  if (!summary) return;
  const panel = document.createElement("div");
  panel.className = "faq-answer";
  [...item.children].forEach((child) => {
    if (child !== summary) panel.appendChild(child);
  });
  item.appendChild(panel);

  const openPanel = () => {
    item.setAttribute("open", "");
    panel.style.maxHeight = panel.scrollHeight + "px";
    panel.style.opacity = "1";
  };
  const closePanel = () => {
    panel.style.maxHeight = panel.scrollHeight + "px";
    requestAnimationFrame(() => {
      panel.style.maxHeight = "0px";
      panel.style.opacity = "0";
    });
    const finish = (event) => {
      if (event.propertyName !== "max-height") return;
      item.removeAttribute("open");
      panel.removeEventListener("transitionend", finish);
    };
    panel.addEventListener("transitionend", finish);
  };

  if (item.open) openPanel();

  summary.addEventListener("click", (event) => {
    event.preventDefault();
    if (item.hasAttribute("open") && panel.style.maxHeight !== "0px") closePanel();
    else openPanel();
  });
});

const reviewsCarousel = document.querySelector(".reviews-carousel");
if (reviewsCarousel) {
  const viewport = reviewsCarousel.querySelector(".reviews-viewport");
  const track = reviewsCarousel.querySelector(".reviews");
  const cards = [...track.querySelectorAll("figure")];
  const prev = reviewsCarousel.querySelector(".reviews-prev");
  const next = reviewsCarousel.querySelector(".reviews-next");
  const dotsWrap = reviewsCarousel.querySelector(".reviews-dots");
  const gap = 16;
  let index = 0;

  const perView = () => {
    if (window.innerWidth <= 620) return 1;
    if (window.innerWidth <= 1080) return 2;
    return 4;
  };

  const maxIndex = () => Math.max(0, cards.length - perView());

  const layout = () => {
    const n = perView();
    const width = (viewport.clientWidth - gap * (n - 1)) / n;
    cards.forEach((card) => {
      card.style.flex = `0 0 ${width}px`;
    });
    index = Math.min(index, maxIndex());
    track.style.transform = `translateX(-${index * (width + gap)}px)`;
    const pages = maxIndex() + 1;
    dotsWrap.innerHTML = "";
    for (let i = 0; i < pages; i += 1) {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.setAttribute("aria-label", "Ir a testimonios " + (i + 1));
      if (i === index) dot.className = "is-on";
      dot.addEventListener("click", () => {
        index = i;
        layout();
      });
      dotsWrap.appendChild(dot);
    }
  };

  prev.addEventListener("click", () => {
    index = index <= 0 ? maxIndex() : index - 1;
    layout();
  });
  next.addEventListener("click", () => {
    index = index >= maxIndex() ? 0 : index + 1;
    layout();
  });
  window.addEventListener("resize", layout);
  layout();
}

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const heroTitle = document.querySelector(".hero h1");
const heroLede = document.querySelector(".hero .lede");

if (!reduceMotion && heroTitle) {
  const splitChars = (el) => {
    let index = 0;
    const walk = (node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent;
        if (!text) return;
        const frag = document.createDocumentFragment();
        text.split(/(\s+)/).forEach((part) => {
          if (!part) return;
          if (/^\s+$/.test(part)) {
            frag.appendChild(document.createTextNode(part));
            return;
          }
          const word = document.createElement("span");
          word.className = "reveal-word";
          Array.from(part).forEach((ch) => {
            const char = document.createElement("span");
            char.className = "reveal-char";
            char.style.setProperty("--i", String(index));
            char.textContent = ch;
            word.appendChild(char);
            index += 1;
          });
          frag.appendChild(word);
        });
        node.replaceWith(frag);
        return;
      }
      if (node.nodeType === Node.ELEMENT_NODE) {
        if (node.classList && node.classList.contains("hero-phrase-mark")) {
          node.classList.add("reveal-fade-item");
          node.style.setProperty("--reveal-delay", "0.05s");
          return;
        }
        if (node.classList && node.classList.contains("hero-smile")) {
          node.classList.add("reveal-fade-item");
          node.style.setProperty("--reveal-delay", "1.05s");
          return;
        }
        if (node.tagName === "SVG") return;
        Array.from(node.childNodes).forEach(walk);
      }
    };
    walk(el);
    el.classList.add("reveal-text");
  };

  const splitWords = (el) => {
    let index = 0;
    const walk = (node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent;
        if (!text || !text.trim()) return;
        const frag = document.createDocumentFragment();
        text.split(/(\s+)/).forEach((part) => {
          if (!part) return;
          if (/^\s+$/.test(part)) {
            frag.appendChild(document.createTextNode(part));
            return;
          }
          const word = document.createElement("span");
          word.className = "reveal-word";
          word.style.setProperty("--i", String(index));
          word.textContent = part;
          frag.appendChild(word);
          index += 1;
        });
        node.replaceWith(frag);
        return;
      }
      if (node.nodeType === Node.ELEMENT_NODE) {
        Array.from(node.childNodes).forEach(walk);
      }
    };
    walk(el);
    el.classList.add("reveal-words");
  };

  splitChars(heroTitle);
  if (heroLede) splitWords(heroLede);

  const heroPoints = document.querySelector(".hero-points");
  const heroNote = document.querySelector(".hero-note");
  const heroCtas = document.querySelector(".hero-ctas");
  [heroPoints, heroNote, heroCtas].forEach((el, i) => {
    if (!el) return;
    el.classList.add("reveal-fade-item");
    el.style.setProperty("--reveal-delay", `${0.85 + i * 0.12}s`);
  });

  const playIn = () => {
    heroTitle.classList.add("is-in");
    if (heroLede) heroLede.classList.add("is-in");
    document.querySelectorAll(".hero .reveal-fade-item").forEach((el) => {
      el.classList.add("is-in");
    });
  };

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      setTimeout(playIn, 40);
    });
  });
}

const form = document.getElementById("cita");
if (form) {
form.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const nombre = String(data.get("nombre") || "").trim();
  const telefono = String(data.get("telefono") || "").trim();
  if (!nombre || !telefono) {
    form.reportValidity();
    return;
  }
  const message = [
    "Hola Vitaydent, soy " + nombre + ".",
    "Quiero una cita de " + data.get("tratamiento") + ".",
    "Telefono: " + telefono + ".",
    "Horario: " + data.get("horario") + ".",
  ].join(" ");
  form.querySelector(".form-success").hidden = false;
  window.open(whatsappUrl(message), "_blank", "noopener");
});
}
