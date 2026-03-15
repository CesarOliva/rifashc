export function parseDate(fecha: string) {
    const year = fecha.slice(0,4)
    const month = fecha.slice(4,6)
    const day = fecha.slice(6,8)
    const time = fecha.slice(9)

    return new Date(`${year}-${month}-${day}T${time}`)
}