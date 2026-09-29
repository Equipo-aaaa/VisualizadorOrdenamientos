// TAREAS #9, #19 y #20: Comparador de Algoritmos y Gráfica con Chart.js
// Autor: José Andrés Flores Parra (en colaboración con Jaziel y Diego)


let listaDeListas = [];
let ejeX = [];
let graficaInstancia = null;

/**
 
 */
export function logicaCrearListas(inicio, incremento, fin) {
    listaDeListas = [];
    ejeX = [];

    for (let i = inicio; i <= fin; i += incremento) {
        const arregloNum = [];
        for (let j = 0; j < i; j++) {
            const numeroRandom = Math.floor(Math.random() * 10001); // 0 a 10000 como en tu main.py
            arregloNum.push(numeroRandom);
        }
        listaDeListas.push(arregloNum);
        ejeX.push(i);
    }
    return { listaDeListas, ejeX };
}

/**
 * Traducción de logica_analisis() de  main.py
 * Corre todos los algoritmos seleccionados sobre COPIAS idénticas de listaDeListas
 */
export function logicaAnalisisYBenchmark(catalogoAlgoritmos, algoritmosActivos) {
    const tiemposPorAlgoritmo = {};

    // Inicializamos los arreglos ejeY para cada algoritmo activo
    for (const clave of algoritmosActivos) {
        tiemposPorAlgoritmo[clave] = [];
    }

    // Recorremos cada tamaño de arreglo en listaDeListas
    for (let f = 0; f < listaDeListas.length; f++) {
        for (const clave of algoritmosActivos) {
            const algoritmoFn = catalogoAlgoritmos[clave].fn;
            
            // Igual que tu lista_de_listas[f].copy() en main.py (Tarea #19)
            const listaActualCopia = [...listaDeListas[f]];

            // Medición en segundo plano sin animación (Tarea #20)
            const tIni = performance.now();
            algoritmoFn(listaActualCopia);
            const tFin = performance.now();

            const tiempoTotalMs = Number((tFin - tIni).toFixed(4));
            tiemposPorAlgoritmo[clave].push(tiempoTotalMs);
        }
    }

    graficarTiemposChartJS(ejeX, tiemposPorAlgoritmo, catalogoAlgoritmos, algoritmosActivos);
    return tiemposPorAlgoritmo;
}

/**
 * Traducción de graficar_tiempos(...) de tu grafica.py usando Chart.js (Tarea #9)
 */
export function graficarTiemposChartJS(ejeX, tiemposPorAlgoritmo, catalogoAlgoritmos, algoritmosActivos) {
    const canvas = document.getElementById('graficaBenchmark');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const datasets = algoritmosActivos.map(clave => ({
        label: catalogoAlgoritmos[clave].nombre,
        data: tiemposPorAlgoritmo[clave],
        borderColor: catalogoAlgoritmos[clave].color,
        backgroundColor: catalogoAlgoritmos[clave].color,
        tension: 0.25,
        pointRadius: 4
    }));

    if (graficaInstancia) {
        graficaInstancia.destroy();
    }

    graficaInstancia = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ejeX.map(n => `N = ${n}`),
            datasets: datasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: { mode: 'index', intersect: false },
            plugins: {
                title: {
                    display: true,
                    text: 'Comparación de Algoritmos de Ordenamiento'
                }
            },
            scales: {
                x: { title: { display: true, text: 'Cantidad de números N' } },
                y: { title: { display: true, text: 'Tiempo (ms)' }, beginAtZero: true }
            }
        }
    });
}