const API_URL = "http://localhost:8000/api";

//Example POST endpoint
export const createRaffle = async () => {
    const res = await fetch(`${API_URL}/createRaffle.php`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            Nombre: "Playstation 5",
            Imagen: '/playstation.jpg',
            Fecha: '20260313 15:30:00',
            PrecioBoleto: 50,
            CantidadBoletos: 100
        })
    });

    const data = await res.json();
    console.log(data);
}

export const getActiveRaffle = async () => {
    const res = await fetch(`${API_URL}/getRaffle.php`);
    return res.json();
};