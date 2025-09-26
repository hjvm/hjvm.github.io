'use strict';



// element toggle function
const elementToggleFunc = function (elem) { elem.classList.toggle("active"); }



// sidebar variables
const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");

// sidebar toggle functionality for mobile
sidebarBtn.addEventListener("click", function () { elementToggleFunc(sidebar); });



// testimonials variables
const testimonialsItem = document.querySelectorAll("[data-testimonials-item]");
const modalContainer = document.querySelector("[data-modal-container]");
const modalCloseBtn = document.querySelector("[data-modal-close-btn]");
const overlay = document.querySelector("[data-overlay]");

// modal variable
const modalImg = document.querySelector("[data-modal-img]");
const modalTitle = document.querySelector("[data-modal-title]");
const modalText = document.querySelector("[data-modal-text]");

// modal toggle function
const testimonialsModalFunc = function () {
  modalContainer.classList.toggle("active");
  overlay.classList.toggle("active");
}

// add click event to all modal items
for (let i = 0; i < testimonialsItem.length; i++) {

  testimonialsItem[i].addEventListener("click", function () {

    modalImg.src = this.querySelector("[data-testimonials-avatar]").src;
    modalImg.alt = this.querySelector("[data-testimonials-avatar]").alt;
    modalTitle.innerHTML = this.querySelector("[data-testimonials-title]").innerHTML;
    modalText.innerHTML = this.querySelector("[data-testimonials-text]").innerHTML;

    testimonialsModalFunc();

  });

}

// add click event to modal close button
modalCloseBtn.addEventListener("click", testimonialsModalFunc);
overlay.addEventListener("click", testimonialsModalFunc);



// custom select variables
const select = document.querySelector("[data-select]");
const selectItems = document.querySelectorAll("[data-select-item]");
const selectValue = document.querySelector("[data-selecct-value]");
const filterBtn = document.querySelectorAll("[data-filter-btn]");

select.addEventListener("click", function () { elementToggleFunc(this); });

// add event in all select items
for (let i = 0; i < selectItems.length; i++) {
  selectItems[i].addEventListener("click", function () {

    let selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    elementToggleFunc(select);
    filterFunc(selectedValue);

  });
}

// filter variables
const filterItems = document.querySelectorAll("[data-filter-item]");

const filterFunc = function (selectedValue) {
  const sel = (selectedValue || '').toLowerCase();
  for (let i = 0; i < filterItems.length; i++) {
    const cat = (filterItems[i].dataset.category || '').toLowerCase();
    if (sel === "all" || sel === cat) {
      filterItems[i].classList.add("active");
    } else {
      filterItems[i].classList.remove("active");
    }
  }
}

// add event in all filter button items for large screen
let lastClickedBtn = filterBtn[0];

for (let i = 0; i < filterBtn.length; i++) {

  filterBtn[i].addEventListener("click", function () {

    let selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    filterFunc(selectedValue);

    lastClickedBtn.classList.remove("active");
    this.classList.add("active");
    lastClickedBtn = this;

  });

}



// contact form variables
const form = document.querySelector("[data-form]");
const formInputs = document.querySelectorAll("[data-form-input]");
const formBtn = document.querySelector("[data-form-btn]");

// add event to all form input field
for (let i = 0; i < formInputs.length; i++) {
  formInputs[i].addEventListener("input", function () {

    // check form validation
    if (form.checkValidity()) {
      formBtn.removeAttribute("disabled");
    } else {
      formBtn.setAttribute("disabled", "");
    }

  });
}

// simple mailto submission to avoid backend; keeps spam bots at bay by formatting body
form.addEventListener("submit", function (e) {
  e.preventDefault();
  const subjectInput = (document.querySelector('input[name="subject"]').value || '').trim();
  const email = (document.querySelector('input[name="email"]').value || '').trim();
  const message = (document.querySelector('textarea[name="message"]').value || '').trim();

  const subject = encodeURIComponent(subjectInput || 'Portfolio contact');
  const bodyLines = [
    `Email: ${email}`,
    '',
    message
  ];
  const body = encodeURIComponent(bodyLines.join('\n'));

  window.location.href = `mailto:hjvm@sas.upenn.edu?subject=${subject}&body=${body}`;

  // Optional UX: disable button briefly
  formBtn.setAttribute('disabled', '');
  setTimeout(() => formBtn.removeAttribute('disabled'), 1500);
});



// page navigation variables
const navigationLinks = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("[data-page]");

// helper to activate a given page by name (e.g., 'resume')
function activatePage(pageName) {
  let matchedIndex = -1;
  for (let i = 0; i < pages.length; i++) {
    const isActive = (pages[i].dataset.page === pageName);
    pages[i].classList.toggle("active", isActive);
    if (navigationLinks[i]) {
      navigationLinks[i].classList.toggle("active", isActive);
      if (isActive) {
        navigationLinks[i].setAttribute('aria-current', 'page');
      } else {
        navigationLinks[i].removeAttribute('aria-current');
      }
    }
    if (isActive) matchedIndex = i;
  }
  if (matchedIndex >= 0) window.scrollTo(0, 0);
}

// add event to all nav links; also push hash for deep linking
for (let i = 0; i < navigationLinks.length; i++) {
  navigationLinks[i].addEventListener("click", function () {
    const pageName = this.innerHTML.toLowerCase();
    activatePage(pageName);
    try { history.pushState(null, '', `#${pageName}`); } catch { location.hash = `#${pageName}`; }
  });
}

// on load, honor hash; default to resume if none/unknown
window.addEventListener('DOMContentLoaded', () => {
  const raw = (location.hash || '').replace('#', '');
  const [pageHash, sectionHash] = raw.split('?');
  const page = (pageHash || '').toLowerCase();
  const valid = Array.from(pages).map(p => p.dataset.page);
  const target = valid.includes(page) ? page : 'about';
  activatePage(target);

  // Sort Portfolio projects by data-date (newest first) if present
  try {
    const list = document.querySelector('.project-list');
    if (list) {
      const items = Array.from(list.querySelectorAll('.project-item'))
        .map((el, i) => ({
          el,
          i,
          t: (() => {
            const d = el.getAttribute('data-date') || '';
            const ts = Date.parse(d);
            return Number.isFinite(ts) ? ts : 0;
          })()
        }))
        .sort((a, b) => (b.t - a.t) || (a.i - b.i));
      items.forEach(({ el }) => list.appendChild(el));
    }
  } catch {}
  if (sectionHash && target) {
    try {
      const params = new URLSearchParams(sectionHash);
      const sectionId = params.get('section');
      if (sectionId) {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } catch {}
  }
});

// support back/forward via hash changes
window.addEventListener('hashchange', () => {
  const raw = (location.hash || '').replace('#', '');
  const [pageHash, sectionHash] = raw.split('?');
  const page = (pageHash || '').toLowerCase();
  if (page) activatePage(page);
  if (sectionHash && page) {
    try {
      const params = new URLSearchParams(sectionHash);
      const sectionId = params.get('section');
      if (sectionId) {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } catch {}
  }
});

// theme toggle with persistence
const themeToggleBtn = document.getElementById('theme-toggle');
const themeToggleIcon = document.getElementById('theme-toggle-icon');

const applyTheme = (theme) => {
  if (theme === 'light') {
    document.body.classList.add('light-mode');
    themeToggleBtn?.setAttribute('aria-pressed', 'true');
    themeToggleIcon?.setAttribute('name', 'moon-outline');
  } else {
    document.body.classList.remove('light-mode');
    themeToggleBtn?.setAttribute('aria-pressed', 'false');
    themeToggleIcon?.setAttribute('name', 'sunny-outline');
  }
};

// initialize theme
(() => {
  try {
    const stored = localStorage.getItem('hjvm-theme');
    if (stored === 'light' || stored === 'dark') {
      applyTheme(stored);
      return;
    }
  } catch {}
  const prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
  applyTheme(prefersLight ? 'light' : 'dark');
})();

themeToggleBtn?.addEventListener('click', () => {
  const isLight = document.body.classList.contains('light-mode');
  const next = isLight ? 'dark' : 'light';
  applyTheme(next);
  try { localStorage.setItem('hjvm-theme', next); } catch {}
});