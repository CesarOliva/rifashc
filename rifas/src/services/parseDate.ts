export function parseDate(fecha: string) {
    if (!fecha) return new Date(NaN);

    if (fecha === "0000-00-00 00:00:00") {
        return new Date(NaN);
    }

    if (fecha.includes("-") && fecha.includes(" ")) {
        return new Date(fecha.replace(" ", "T"));
    }

    if (/^\d{8}\s\d{2}:\d{2}:\d{2}$/.test(fecha)) {
        const year = fecha.slice(0, 4);
        const month = fecha.slice(4, 6);
        const day = fecha.slice(6, 8);
        const time = fecha.slice(9);
        return new Date(`${year}-${month}-${day}T${time}`);
    }

    return new Date(fecha);
}