
// TAREA #13: Portar los 3 algoritmos de fuerza bruta restantes a JS con eventos
// Basado directamente en ordenamientos.py (Gnome, Stooge y Exchange Sort)
// Autores: Andrés 


/**
 * 1. Gnome Sort 
 */
export function gnomeSort(lista) {
    const arr = [...lista]; // Equivalente a lista.copy() en Python
    const eventos = [];
    let i = 0;
    const n = arr.length;

    while (i < n) {
        if (i === 0) {
            i += 1;
        } else {
            // Registramos el evento de comparación entre (i) e (i - 1)
            eventos.push({ type: 'compare', indices: [i - 1, i] });
            
            if (arr[i] >= arr[i - 1]) {
                i += 1;
            } else {
                // Intercambio: arr[i], arr[i - 1] = arr[i - 1], arr[i]
                [arr[i], arr[i - 1]] = [arr[i - 1], arr[i]];
                eventos.push({ type: 'swap', indices: [i - 1, i] });
                i -= 1;
            }
        }
    }

    eventos.push({ type: 'done' });
    return { sortedArray: arr, eventos };
}

/**
 * 2. Stooge Sort 
 */
function stoogeSortRec(arr, l, h, eventos) {
    if (l >= h) {
        return;
    }

    // Registramos comparación entre extremos l y h
    eventos.push({ type: 'compare', indices: [l, h] });
    if (arr[l] > arr[h]) {
        // Intercambio: arr[l], arr[h] = arr[h], arr[l]
        [arr[l], arr[h]] = [arr[h], arr[l]];
        eventos.push({ type: 'swap', indices: [l, h] });
    }

    if (h - l + 1 > 2) {
        const t = Math.floor((h - l + 1) / 3); // Equivalente a // 3 en Python
        stoogeSortRec(arr, l, h - t, eventos);
        stoogeSortRec(arr, l + t, h, eventos);
        stoogeSortRec(arr, l, h - t, eventos);
    }
}

export function stoogeSort(lista) {
    const arr = [...lista]; // Equivalente a lista.copy()
    const eventos = [];
    if (arr.length > 0) {
        stoogeSortRec(arr, 0, arr.length - 1, eventos);
    }
    eventos.push({ type: 'done' });
    return { sortedArray: arr, eventos };
}

/**
 * 3. Exchange Sort 
 */
export function exchangeSort(lista) {
    const arr = [...lista]; // Equivalente a lista.copy()
    const eventos = [];
    const n = arr.length;

    for (let i = 0; i < n - 1; i++) {
        for (let j = i + 1; j < n; j++) {
            // Registramos comparación entre j e i
            eventos.push({ type: 'compare', indices: [i, j] });

            if (arr[j] < arr[i]) {
                // Intercambio: arr[i], arr[j] = arr[j], arr[i]
                [arr[i], arr[j]] = [arr[j], arr[i]];
                eventos.push({ type: 'swap', indices: [i, j] });
            }
        }
    }

    eventos.push({ type: 'done' });
    return { sortedArray: arr, eventos };
}