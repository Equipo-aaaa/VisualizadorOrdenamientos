/**
 * TEMA CLARO / OSCURO
 *
 * El tema vive en el atributo data-bs-theme de <html>:
 *   <html data-bs-theme="dark">   o   <html data-bs-theme="light">
 * Bootstrap y css/estilos.css leen ese atributo y cambian sus colores solos.
 *
 * Este archivo solo:
 *   1. Conecta el botón ☀/☾ del encabezado.
 *   2. Guarda la elección en localStorage para que se mantenga al cambiar
 *      de página o recargar.
 *   3. Avisa con el evento 'cambio-tema' a quien lo necesite (la gráfica de
 *      Chart.js dibuja en un <canvas>, que no entiende CSS, así que tiene
 *      que volver a pintarse con los colores nuevos).
 *
 * El tema inicial NO se pone aquí sino en un <script> pequeño dentro del
 * <head> de cada página: así se aplica antes de pintar y no hay un
 * "parpadeo" oscuro al abrir la página en modo claro.
 */

const raiz = document.documentElement;   // la etiqueta <html>
const boton = document.getElementById('btnTema');

/** 'dark' o 'light'. */
export function temaActual() {
  return raiz.getAttribute('data-bs-theme');
}

function aplicarTema(tema) {
  raiz.setAttribute('data-bs-theme', tema);

  // localStorage puede fallar (navegación privada); no es grave, solo no se recuerda.
  try { localStorage.setItem('tema', tema); } catch { /* sin efecto */ }

  // El ícono muestra a QUÉ modo se cambia al hacer clic.
  const oscuro = tema === 'dark';
  boton.innerHTML = `<i class="bi ${oscuro ? 'bi-sun-fill' : 'bi-moon-stars-fill'}"></i>`;
  boton.title = oscuro ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro';
  boton.setAttribute('aria-label', boton.title);

  document.dispatchEvent(new CustomEvent('cambio-tema', { detail: tema }));
}

boton.addEventListener('click', () => {
  aplicarTema(temaActual() === 'dark' ? 'light' : 'dark');
});

// Pone el ícono correcto según el tema que ya aplicó el <head>.
aplicarTema(temaActual() ?? 'dark');
