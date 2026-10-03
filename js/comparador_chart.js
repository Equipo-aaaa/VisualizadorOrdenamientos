// js/comparador_chart.js
// Tareas #9, #19 y #20: Generador de listas y gráfica comparativa con Chart.js
// Autor: José Andrés Flores Parra (en colaboración con Jaziel y Diego)

let listaDeListas = [];
let ejeX = [];
let graficaInstancia = null;

/**
 * Traducción de logica_crear_listas() de main.py
 */
export function logicaCrearListas(inicio, incremento, fin) {
    listaDeListas = [];
    ejeX = [];

    for (let i = inicio; i <= fin; i += incremento) {
        const arregloNum = [];
        for (let j = 0; j < i; j++) {
            const numeroRandom = Math.floor(Math.random() * 10001); // 0 a 10000 como en main.py
            arregloNum.push(numeroRandom);
        }
        listaDeListas.push(arregloNum);
        ejeX.push(i);
    }
    return { listaDeListas, ejeX };
}

/**
 * Mide el tiempo de un algoritmo sobre un arreglo; si es < 0.5 ms, promedia múltiples corridas.
 */
function medirTiempoPreciso(fnAlgoritmo, arregloBase) {
    const copia = [...arregloBase];
    const inicioT = performance.now();
    fnAlgoritmo(copia);
    const finT = performance.now();

    let duracion = finT - inicioT;

    if (duracion < 0.5) {
        let repeticiones = 0;
        let acumulado = 0;
        const lote = 50;

        // Repite en lotes hasta superar la resolución del reloj del navegador
        while (acumulado < 1.0 && repeticiones < 2000) {
            const copiasLote = Array.from({ length: lote }, () => [...arregloBase]);
            const inicioLote = performance.now();
            for (let r = 0; r < lote; r++) {
                fnAlgoritmo(copiasLote[r]);
            }
            const finLote = performance.now();
            acumulado += (finLote - inicioLote);
            repeticiones += lote;
        }
        if (acumulado > 0) {
            duracion = acumulado / repeticiones;
        }
    }
    return Number(duracion.toFixed(4));
}

/**
 * Traducción de logica_analisis() de main.py
 * Corre todos los algoritmos seleccionados sobre COPIAS idénticas de listaDeListas
 */
export function logicaAnalisis(diccionarioAlgoritmos) {
    if (listaDeListas.length === 0) {
        throw new Error('Primero debes crear las listas de números.');
    }

    const resultadosTiempos = {};

    for (const [nombreAlgoritmo, fnAlgoritmo] of Object.entries(diccionarioAlgoritmos)) {
        resultadosTiempos[nombreAlgoritmo] = [];

        for (let k = 0; k < listaDeListas.length; k++) {
            const tiempoMs = medirTiempoPreciso(fnAlgoritmo, listaDeListas[k]);
            resultadosTiempos[nombreAlgoritmo].push(tiempoMs);
        }
    }

    return { ejeX, resultadosTiempos };
}

/**
 * Conecta el botón "Ejecutar Benchmark" de prueba_andres.html con logicaAnalisis y renderizarGrafica
 */
export function logicaAnalisisYBenchmark(catalogo, seleccionados) {
    const diccionarioAlgoritmos = {};

    for (const clave of seleccionados) {
        if (catalogo[clave]) {
            diccionarioAlgoritmos[catalogo[clave].nombre] = catalogo[clave].fn;
        }
    }

    const { ejeX: ejeXDatos, resultadosTiempos } = logicaAnalisis(diccionarioAlgoritmos);
    renderizarGrafica('graficaBenchmark', ejeXDatos, resultadosTiempos);
}

/**
 * Dibuja la gráfica comparativa usando Chart.js
 */
export function renderizarGrafica(canvasId, ejeXDatos, resultadosTiempos) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return;

    if (graficaInstancia) {
        graficaInstancia.destroy();
    }

    const colores = [
        '#3b82f6', // Azul
        '#ef4444', // Rojo
        '#10b981', // Verde
        '#f59e0b', // Naranja
        '#8b5cf6', // Morado
        '#ec4899', // Rosa
        '#14b8a6'  // Turquesa
    ];

    const datasets = Object.entries(resultadosTiempos).map(([nombre, tiempos], idx) => ({
        label: nombre,
        data: tiempos,
        borderColor: colores[idx % colores.length],
        backgroundColor: colores[idx % colores.length],
        borderWidth: 2,
        tension: 0.2,
        fill: false,
        pointRadius: 4
    }));

    graficaInstancia = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ejeXDatos,
            datasets: datasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Comparación de Rendimiento (Tiempo en ms vs Tamaño de Lista)',
                    color: '#f8fafc',
                    font: { size: 16 }
                },
                legend: {
                    labels: { color: '#e2e8f0' }
                }
            },
            scales: {
                x: {
                    title: { display: true, text: 'Tamaño de la Lista (N)', color: '#94a3b8' },
                    ticks: { color: '#cbd5e1' },
                    grid: { color: '#334155' }
                },
                y: {
                    title: { display: true, text: 'Tiempo de Ejecución (ms)', color: '#94a3b8' },
                    ticks: { color: '#cbd5e1' },
                    grid: { color: '#334155' },
                    beginAtZero: true
                }
            }
        }
    });
}