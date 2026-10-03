import { compare, swap, done } from '../core/eventos.js';

function merge(arr, start, mid, end, eventos) {
    let start2 = mid + 1;
    if (eventos) eventos.push(compare(mid, start2));
    if (arr[mid] <= arr[start2]) {
        return;
    }

    while (start <= mid && start2 <= end) {
        if (eventos) eventos.push(compare(start, start2));

        if (arr[start] <= arr[start2]) {
            start++;
        } else {
            let index = start2;

            while (index !== start) {
                if (eventos) eventos.push(swap(index, index - 1));
                [arr[index], arr[index - 1]] = [arr[index - 1], arr[index]];
                index--;
            }
            start++;
            mid++;
            start2++;
        }
    }
}

function mergeSortRec(arr, l, r, eventos) {
    if (l < r) {
        let m = l + Math.floor((r - l) / 2);

        mergeSortRec(arr, l, m, eventos);
        mergeSortRec(arr, m + 1, r, eventos);

        merge(arr, l, m, r, eventos);
    }
}

export function mergeSort(lista, eventos = null) {
    const arr = [...lista];
    const n = arr.length;

    if (n > 0) {
        mergeSortRec(arr, 0, n - 1, eventos);
    }

    for (let k = 0; k < n; k++) {
        if (eventos) eventos.push(done(k));
    }

    return arr;
}