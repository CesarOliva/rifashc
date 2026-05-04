export const formatearMoneda = (cantidad: number) => {
    if (typeof cantidad !== 'number' || isNaN(cantidad)) {
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN',
        }).format(0);
    }
    
    return new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN',
    }).format(cantidad);
};

export const formatTicketNumber = (numero: number | string) => {
    const num = typeof numero === 'string' ? parseInt(numero, 10) : numero;
    return String(num).padStart(5, '0');
};