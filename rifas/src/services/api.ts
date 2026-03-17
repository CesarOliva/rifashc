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
    return data;
}

export const updateActive = async (id: number) => {
    const res = await fetch(`${API_URL}/updateActive.php`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            IdRifa: id
        })
    });

    const text = await res.text();
    console.log(text);

    return JSON.parse(text);
}

export const updateRaffle = async (raffle: RaffleProps) => {
    const res = await fetch(`${API_URL}/updateRaffle.php`,{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body: JSON.stringify({
            Nombre: raffle.Nombre,
            Imagen: raffle.Imagen,
            Fecha: raffle.Fecha,
            PrecioBoleto: raffle.PrecioBoleto,
            CantidadBoletos: raffle.CantidadBoletos,
        })
    });

    return res.json()
}

export const getActiveRaffle = async () => {
    const res = await fetch(`${API_URL}/getRaffle.php`);
    return res.json();
};

export const getAllRaffles = async () => {
    const res = await fetch(`${API_URL}/getAllRaffles.php`);
    return res.json();
};

export const uploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append("image", file);

    const res = await fetch(`${API_URL}/uploadImage.php`,{
        method:"POST",
        body: formData
    })

    return res.json()
}