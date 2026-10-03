import { ALGORITMOS } from '../algoritmos/catalogo.js';
import { arregloAleatorio, $ } from '../core/utilidades.js';
import { tamanosDeMuestra, validarRango, ejecutarBenchmark } from './benchmark.js';

/**
 * PÁGINA 2 — Comparador de Algoritmos
 * (Basado en el prototipo de Andrés: comparador_chart.js con Chart.js)
 *
 * Flujo:
 *   1. Leer inicio / paso / fin y calcular los tamaños (20, 40, 60, 80, 100).
 *   2. Generar UN arreglo aleatorio por tamaño.
 *   3. Medir cada algoritmo disponible con esos mismos arreglos.
 *   4. Dibujar una línea por algoritmo con Chart.js (variable global `Chart`).
 *   5. Las casillas ocultan/muestran líneas; Chart.js reescala el eje Y solo.
 */

// Solo se miden los algoritmos que ya están implementados.
const disponibles = ALGORITMOS.filter((a) => a.fn !== null);

// ids de las líneas que el usuario quiere ver. Se recuerda aunque se vuelva
// a ejecutar la medición.
const visibles = new Set(disponibles.filter((a) => !a.ocultoPorDefecto).map((a) => a.id));

let grafica = null;     // instancia de Chart (se crea con el primer resultado)

// ---------------------------------------------------------------- Generador

function leerRango() {
  return {
    inicio: Number($('inicio').value),
    paso: Number($('paso').value),
    fin: Number($('fin').value),
  };
}

/** Muestra los chips "N = 20", "N = 40"... o el error, mientras se escribe. */
function vistaPrevia() {
  const { inicio, paso, fin } = leerRango();
  const error = validarRango(inicio, paso, fin);

  $('error').textContent = error ?? '';
  $('btnEjecutar').disabled = error !== null;

  const tamanos = error ? [] : tamanosDeMuestra(inicio, paso, fin);
  $('numPuntos').textContent = tamanos.length;
  $('chips').innerHTML = tamanos.map((n) => `<span class="chip-n">N = ${n}</span>`).join('');
  return error ? null : tamanos;
}

// ---------------------------------------------------------------- Casillas de líneas

function dibujarListaLineas() {
  const lista = $('listaLineas');
  lista.innerHTML = '';

  for (const alg of ALGORITMOS) {
    const pendiente = alg.fn === null;
    const fila = document.createElement('label');
    fila.className = 'linea-algoritmo' + (pendiente ? ' deshabilitado' : '');
    fila.innerHTML = `
      <input class="form-check-input" type="checkbox"
             ${visibles.has(alg.id) ? 'checked' : ''} ${pendiente ? 'disabled' : ''}>
      <span class="muestra-color" style="background:${alg.color}"></span>
      <span class="flex-grow-1">${alg.nombre}</span>
      <span class="etiqueta-complejidad">${pendiente ? 'Pendiente' : alg.tiempo}</span>`;

    fila.querySelector('input').addEventListener('change', (e) => {
      if (e.target.checked) visibles.add(alg.id);
      else visibles.delete(alg.id);
      aplicarVisibilidad();
    });
    lista.appendChild(fila);
  }
  $('numActivos').textContent = `${visibles.size} activos`;
}

/** Oculta/muestra las líneas según `visibles` y redibuja. */
function aplicarVisibilidad() {
  $('numActivos').textContent = `${visibles.size} activos`;
  if (!grafica) return;
  for (const dataset of grafica.data.datasets) {
    dataset.hidden = !visibles.has(dataset.idAlgoritmo);
  }
  grafica.update();   // Chart.js recalcula el máximo del eje Y con lo visible
}

// ---------------------------------------------------------------- Gráfica

function dibujarGrafica(tamanos, resultados) {
  const datasets = disponibles.map((alg) => ({
    idAlgoritmo: alg.id,                 // campo propio, para encontrarlo después
    label: alg.nombre,
    data: resultados[alg.id],
    borderColor: alg.color,
    backgroundColor: alg.color,
    hidden: !visibles.has(alg.id),
    tension: 0.15,                       // curva ligera; más alto exagera los datos
    pointRadius: 4,
    spanGaps: false,                     // si hay null (Stooge con N grande), la línea se corta
  }));

  // Si ya existe, solo se cambian los datos (más rápido que destruirla).
  if (grafica) {
    grafica.data.labels = tamanos;
    grafica.data.datasets = datasets;
    grafica.update();
    return;
  }

  grafica = new Chart($('grafica'), {
    type: 'line',
    data: { labels: tamanos, datasets },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },   // tooltip con todos los algoritmos de ese N
      plugins: {
        legend: { display: false },                         // ya están las casillas a la izquierda
        tooltip: {
          callbacks: {
            title: (items) => `N = ${items[0].label}`,
            label: (item) => ` ${item.dataset.label}: ${formatoMs(item.parsed.y)}`,
          },
        },
      },
      scales: {
        x: {
          title: { display: true, text: 'Tamaño del arreglo (N)' },
        },
        y: {
          type: $('escalaLog').checked ? 'logarithmic' : 'linear',
          title: { display: true, text: 'Tiempo (ms)' },
          beginAtZero: true,
        },
      },
    },
  });
  aplicarColoresGrafica();
}

/**
 * Chart.js dibuja en un <canvas>, que no entiende variables CSS. Por eso se
 * leen los colores del tema actual (--texto-suave y --borde de estilos.css)
 * y se le pasan a mano. Se llama al crear la gráfica y al cambiar de tema.
 */
function aplicarColoresGrafica() {
  if (!grafica) return;
  const css = getComputedStyle(document.documentElement);
  const texto = css.getPropertyValue('--texto-suave').trim();
  const guia = css.getPropertyValue('--borde').trim();

  for (const eje of Object.values(grafica.options.scales)) {
    eje.title.color = texto;
    eje.ticks.color = texto;
    eje.grid.color = guia;
  }
  grafica.update('none');   // 'none' = sin animación, solo repintar
}

// js/core/tema.js lanza este evento cada vez que se presiona ☀/☾
document.addEventListener('cambio-tema', aplicarColoresGrafica);

function formatoMs(ms) {
  if (ms === null || ms === undefined) return '—';
  return ms < 0.01 ? `${(ms * 1000).toFixed(2)} µs` : `${ms.toFixed(3)} ms`;
}

// ---------------------------------------------------------------- Tabla

function dibujarTabla(tamanos, resultados) {
  $('tablaCabecera').innerHTML =
    `<tr><th>Algoritmo</th>${tamanos.map((n) => `<th class="text-end">N=${n}</th>`).join('')}</tr>`;

  $('tablaCuerpo').innerHTML = disponibles.map((alg) => `
    <tr>
      <td><span class="muestra-color d-inline-block me-2" style="background:${alg.color};width:10px;height:10px;border-radius:2px"></span>${alg.nombre}</td>
      ${resultados[alg.id].map((ms) => `<td class="text-end">${formatoMs(ms)}</td>`).join('')}
    </tr>`).join('');
}

// ---------------------------------------------------------------- Ejecutar

async function ejecutar() {
  const tamanos = vistaPrevia();
  if (!tamanos) return;

  if (disponibles.length === 0) {
    $('error').textContent = 'Todavía no hay algoritmos implementados en el catálogo.';
    return;
  }

  // Bloquear el botón mientras se mide
  $('btnEjecutar').disabled = true;
  $('contenedorProgreso').classList.remove('d-none');

  const arreglos = tamanos.map((n) => arregloAleatorio(n, 1000));

  const resultados = await ejecutarBenchmark(disponibles, arreglos, (hechos, total) => {
    $('barraProgreso').style.width = `${(hechos / total) * 100}%`;
  });

  $('sinDatos').classList.add('d-none');
  dibujarGrafica(tamanos, resultados);
  dibujarTabla(tamanos, resultados);

  $('btnEjecutar').disabled = false;
  $('contenedorProgreso').classList.add('d-none');
  $('barraProgreso').style.width = '0%';
}

// ---------------------------------------------------------------- Eventos del HTML

for (const id of ['inicio', 'paso', 'fin']) $(id).addEventListener('input', vistaPrevia);
$('btnEjecutar').addEventListener('click', ejecutar);

$('escalaLog').addEventListener('change', (e) => {
  if (!grafica) return;
  grafica.options.scales.y.type = e.target.checked ? 'logarithmic' : 'linear';
  grafica.update();
});

// ---------------------------------------------------------------- Inicio

dibujarListaLineas();
vistaPrevia();
