const API_URL = "http://localhost:8000/api";

type RaffleProps = {
    Nombre: string;
    Imagen: string;
    Fecha: string;
    PrecioBoleto: number;
    CantidadBoletos: number;
    Activa: Boolean;
}

export const createRaffle = async (raffle: RaffleProps) => {
    const res = await fetch(`${API_URL}/createRaffle.php`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            Nombre: raffle.Nombre,
            Imagen: raffle.Imagen,
            Fecha: raffle.Fecha,
            PrecioBoleto: raffle.PrecioBoleto,
            CantidadBoletos: raffle.CantidadBoletos,
        })
    });

    const data = await res.json();
    console.log(data);
}

export const getActiveRaffle = async () => {
    const res = await fetch(`${API_URL}/getRaffle.php`);
    return res.json();
};