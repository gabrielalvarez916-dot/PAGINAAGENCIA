/* =========================================================
   INDÓMITA — INTERACCIONES GENERALES
   Este archivo se usa en TODAS las páginas del sitio.
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Menú mobile (hamburguesa) ---------- */
  const navToggle = document.getElementById('navToggle');
  const siteNav = document.getElementById('siteNav');

  if (navToggle && siteNav) {
    navToggle.addEventListener('click', () => {
      const isOpen = siteNav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Cierra el menú al hacer clic en un link (mejora UX mobile)
    siteNav.querySelectorAll('.nav__link').forEach(link => {
      link.addEventListener('click', () => {
        siteNav.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- Año dinámico en el footer ---------- */
  const anioActual = document.getElementById('anioActual');
  if (anioActual) {
    anioActual.textContent = new Date().getFullYear();
  }

});
