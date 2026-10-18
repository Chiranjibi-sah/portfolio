/* =========================================================
   script.js  -  small bits of behavior for the portfolio
   The site still reads fine if this file fails to load.
   It handles: the mobile menu, highlighting the current
   section in the menu, and the year in the footer.
   ========================================================= */

(function () {
  'use strict';

  // Tell the CSS that JavaScript is running (enables the mobile menu button).
  document.documentElement.classList.add('js');

  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('site-nav');
  var navLinks = nav ? nav.querySelectorAll('a[href^="#"]') : [];

  /* ---------- mobile menu ---------- */
  function setMenu(open) {
    if (!toggle || !nav) return;
    toggle.setAttribute('aria-expanded', String(open));
    nav.classList.toggle('open', open);
  }

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      setMenu(toggle.getAttribute('aria-expanded') !== 'true');
    });

    // Close the menu after choosing a link.
    navLinks.forEach(function (link) {
      link.addEventListener('click', function () { setMenu(false); });
    });

    // Close with the Escape key and return focus to the button.
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        setMenu(false);
        toggle.focus();
      }
    });

    // Reset if the window is resized to desktop width.
    window.addEventListener('resize', function () {
      if (window.innerWidth > 880) setMenu(false);
    });
  }

  /* ---------- highlight the current section in the menu ----------
     Some sections are not in the menu (for example "purple-team").
     They carry data-nav="about" so they highlight the menu link
     of the section they belong to. */
  var linkById = {};
  navLinks.forEach(function (link) {
    linkById[link.getAttribute('href').slice(1)] = link;
  });

  function setActive(activeLink) {
    navLinks.forEach(function (link) {
      var isActive = link === activeLink;
      link.classList.toggle('active', isActive);
      if (isActive) {
        link.setAttribute('aria-current', 'location');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  }

  if ('IntersectionObserver' in window && navLinks.length) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var key = entry.target.getAttribute('data-nav') || entry.target.id;
        if (linkById[key]) setActive(linkById[key]);
      });
    }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });

    document.querySelectorAll('main section[id]').forEach(function (section) {
      observer.observe(section);
    });
  }

  /* ---------- footer year ---------- */
  function setYear() {
    var yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = String(new Date().getFullYear());
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setYear);
  } else {
    setYear();
  }
})();