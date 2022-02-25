export function filterOnlyObjectProperties(obj) {
    return Object.fromEntries(Object.entries(obj).filter(([k]) => isNaN(k)));
}
