import { ALGORITMOS, buscarAlgoritmo } from '../algoritmos/catalogo.js';
import { TIPOS } from '../core/eventos.js';
import { arregloAleatorio, $ } from '../core/utilidades.js';
import { Barras } from './barras.js';
import { Reproductor } from './reproductor.js';

/**
 * PÁGINA 1 — Visualizador de Ordenamientos
 *
 * Este archivo solo "conecta cables": lee los controles del HTML y le dice
 * al Reproductor qué hacer. No dibuja barras (eso es Barras) ni ordena
 * (eso son los algoritmos del catálogo).
 *
 * Flujo:
 *   1. Se genera UN arreglo aleatorio (arregloActual).
 *   2. El algoritmo elegido lo ordena y llena la lista de eventos.
 *   3. El Reproductor anima esos eventos sobre el arreglo original.
 * Al cambiar de algoritmo se conserva el MISMO arreglo, para comparar justo.
 */

// ---------------------------------------------------------------- Estado

let arregloActual = [];
let algoritmoActual = ALGORITMOS.find((a) => a.fn !== null); // primero disponible
let eventosActuales = [];

// Contadores para el panel de métricas. Se actualizan evento por evento.
const conteo = { comparaciones: 0, intercambios: 0, escrituras: 0, procesados: 0 };

// ---------------------------------------------------------------- Motor de animación

const barras = new Barras($('lienzo'));
const reproductor = new Reproductor(barras, {
  velocidad: Number(document.querySelector('input[name="velocidad"]:checked').value),
  alAvanzar: actualizarMetricas,
  alTerminar: () => {
    ponerEstado('Ordenado', 'text-bg-success');
    // El Reproductor marca "ya no estoy corriendo" justo DESPUÉS de llamar a
    // alTerminar; se espera un instante para que los botones lo vean así.
    setTimeout(actualizarBotones, 0);
  },
});

// ---------------------------------------------------------------- Métricas

/**
 * El Reproductor llama esto después de cada paso con (índice, total).
 * Solo se cuentan los eventos nuevos desde la última llamada; si el índice
 * regresó a 0 (reiniciar o cargar), los contadores se ponen en cero.
 */
function actualizarMetricas(indice, total) {
  if (indice === 0) {
    conteo.comparaciones = conteo.intercambios = conteo.escrituras = conteo.procesados = 0;
  }

  // eventosActuales aún no existe la primera vez (el constructor del
  // Reproductor llama a alAvanzar antes de cargar algo); por eso el `?.`.
  for (let k = conteo.procesados; k < indice; k++) {
    const tipo = eventosActuales?.[k]?.type;
    if (tipo === TIPOS.COMPARE) conteo.comparaciones++;
    else if (tipo === TIPOS.SWAP) conteo.intercambios++;
    else if (tipo === TIPOS.OVERWRITE) conteo.escrituras++;
  }
  conteo.procesados = indice;

  $('mComparaciones').textContent = conteo.comparaciones;
  $('mIntercambios').textContent = conteo.intercambios;
  $('mEscrituras').textContent = conteo.escrituras;
  $('mProgreso').textContent = `${indice} / ${total}`;
}

// ---------------------------------------------------------------- Interfaz

function ponerEstado(texto, claseBootstrap) {
  const badge = $('estado');
  badge.textContent = texto;
  badge.className = `badge rounded-pill ${claseBootstrap}`;
}

/** Habilita/deshabilita botones según el estado del reproductor. */
function actualizarBotones() {
  const corriendo = reproductor.enReproduccion;
  const empezado = reproductor.indice > 0;

  $('btnPlay').disabled = corriendo;
  $('btnPlayTxt').textContent = reproductor.terminado && empezado ? 'Repetir'
                              : empezado ? 'Continuar' : 'Iniciar';
  $('btnPausa').disabled = !corriendo;
  $('btnPaso').disabled = reproductor.terminado;
}

/** Crea los botones de algoritmos a partir del catálogo. */
function dibujarListaAlgoritmos() {
  const lista = $('listaAlgoritmos');
  lista.innerHTML = '';

  for (const alg of ALGORITMOS) {
    const boton = document.createElement('button');
    boton.type = 'button';
    boton.className = 'algoritmo' + (alg === algoritmoActual ? ' activo' : '');
    boton.disabled = alg.fn === null;
    boton.innerHTML = `
      <div class="d-flex justify-content-between align-items-center">
        <span><span class="punto" style="background:${alg.color}"></span><strong>${alg.nombre}</strong></span>
        <span class="etiqueta-complejidad">${alg.fn ? alg.tiempo : 'Pendiente'}</span>
      </div>
      <div class="d-flex justify-content-between">
        <small>${alg.descripcion}</small>
        <small class="mono">Esp. ${alg.espacio}</small>
      </div>`;
    boton.addEventListener('click', () => elegirAlgoritmo(alg.id));
    lista.appendChild(boton);
  }
}

// ---------------------------------------------------------------- Acciones

/** Ordena el arreglo actual con el algoritmo actual y carga la animación. */
function prepararAnimacion() {
  eventosActuales = [];
  algoritmoActual.fn(arregloActual, eventosActuales);
  reproductor.cargar(arregloActual, eventosActuales);

  $('nombreAlgoritmo').textContent =
    `${algoritmoActual.nombre} · ${arregloActual.length} elementos · ${eventosActuales.length} eventos`;
  ponerEstado('Listo para ejecutar', 'text-bg-secondary');
  actualizarBotones();
}

function nuevoArreglo() {
  arregloActual = arregloAleatorio(Number($('tamano').value));
  prepararAnimacion();
}

function elegirAlgoritmo(id) {
  algoritmoActual = buscarAlgoritmo(id);

  // Algunos algoritmos (Stooge) tienen un N máximo menor para que la
  // animación no dure minutos. Si el arreglo actual lo rebasa, se recorta
  // el slider y se genera uno nuevo; si no, se conserva el mismo arreglo.
  const slider = $('tamano');
  slider.max = algoritmoActual.maxN;
  $('tamanoMaxTxt').textContent = algoritmoActual.maxN;

  dibujarListaAlgoritmos();

  if (arregloActual.length > algoritmoActual.maxN) {
    slider.value = algoritmoActual.maxN;
    $('tamanoTxt').textContent = slider.value;
    nuevoArreglo();
  } else {
    prepararAnimacion();
  }
}

function reproducir() {
  if (reproductor.terminado) reproductor.reiniciar();
  reproductor.reproducir();
  ponerEstado('Ordenando…', 'text-bg-warning');
  actualizarBotones();
}

function pausar() {
  reproductor.pausar();
  ponerEstado('En pausa', 'text-bg-secondary');
  actualizarBotones();
}

function paso() {
  reproductor.pausar();
  reproductor.paso();
  if (!reproductor.terminado) ponerEstado('Paso a paso', 'text-bg-info');
  actualizarBotones();
}

function reiniciar() {
  reproductor.reiniciar();
  ponerEstado('Listo para ejecutar', 'text-bg-secondary');
  actualizarBotones();
}

// ---------------------------------------------------------------- Eventos del HTML

$('tamano').addEventListener('input', (e) => { $('tamanoTxt').textContent = e.target.value; });
$('tamano').addEventListener('change', nuevoArreglo);   // al soltar el slider
$('btnNuevo').addEventListener('click', nuevoArreglo);
$('btnPlay').addEventListener('click', reproducir);
$('btnPausa').addEventListener('click', pausar);
$('btnPaso').addEventListener('click', paso);
$('btnReiniciar').addEventListener('click', reiniciar);

for (const radio of document.querySelectorAll('input[name="velocidad"]')) {
  radio.addEventListener('change', (e) => reproductor.setVelocidad(Number(e.target.value)));
}

// ---------------------------------------------------------------- Inicio

dibujarListaAlgoritmos();
$('tamanoTxt').textContent = $('tamano').value;
nuevoArreglo();
