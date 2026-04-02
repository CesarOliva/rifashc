import { clearAdminToken, getAdminToken } from "./auth";

const API_URL = "https://bycesaroliva.com/api";

type RaffleProps = {
    IdRifa?: number;
    Nombre: string;
    Imagen: string;
    Fecha: string;
    PrecioBoleto: number;
    CantidadBoletos: number;
    Activa?: Boolean;
}

const getAuthHeaders = (): Record<string, string> => {
    const token = getAdminToken();
    if (!token) return {};
    return { Authorization: `Bearer ${token}` };
};

const handleJsonResponse = async (res: Response) => {
    if (res.status === 401) {
        clearAdminToken();
        throw new Error("No autorizado");
    }

    return res.json();
};

export const createRaffle = async (raffle: RaffleProps) => {
    const res = await fetch(`${API_URL}/createRaffle.php`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders()
        },
        body: JSON.stringify({
            Nombre: raffle.Nombre,
            Imagen: raffle.Imagen,
            Fecha: raffle.Fecha,
            PrecioBoleto: raffle.PrecioBoleto,
            CantidadBoletos: raffle.CantidadBoletos,
        })
    });

    const data = await handleJsonResponse(res);
    return data;
}

export const updateActive = async (id: number) => {
    const res = await fetch(`${API_URL}/updateActive.php`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders()
        },
        body: JSON.stringify({
            IdRifa: id
        })
    });

    const data = await handleJsonResponse(res);
    if (!data.success) {
        throw new Error(data.message || 'Error al actualizar la rifa');
    }
    
    return data;
}

export const updateRaffle = async (raffle: RaffleProps) => {
    const res = await fetch(`${API_URL}/updateRaffle.php`,{
        method:"POST",
        headers:{
            "Content-Type":"application/json",
            ...getAuthHeaders()
        },
        body: JSON.stringify({
            IdRifa: raffle.IdRifa,
            Nombre: raffle.Nombre,
            Imagen: raffle.Imagen,
            Fecha: raffle.Fecha,
            PrecioBoleto: raffle.PrecioBoleto,
            CantidadBoletos: raffle.CantidadBoletos,
        })
    });

    return handleJsonResponse(res);
}

export const getRaffleById = async (id: number) => {
    const res = await fetch(`${API_URL}/getRaffleById.php?IdRifa=${id}`, {
        method: "GET"
    });
    return await res.json();
};

export const getActiveRaffle = async () => {
    const res = await fetch(`${API_URL}/getActiveRaffle.php`);
    return res.json();
};

export const getAllRaffles = async () => {
    const res = await fetch(`${API_URL}/getAllRaffles.php`);
    return res.json();
};

export const removeRaffle = async (id: number) => {
    const res = await fetch(`${API_URL}/removeRaffle.php`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders()
        },
        body: JSON.stringify({
            IdRifa: id
        })
    });

    return await handleJsonResponse(res);
}

export const uploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append("image", file);

    const res = await fetch(`${API_URL}/uploadImage.php`,{
        method:"POST",
        body: formData,
        headers: {
            ...getAuthHeaders()
        }
    })

    return handleJsonResponse(res);
}

export const loginAdmin = async (usuario: string, password: string) => {
    const res = await fetch(`${API_URL}/login.php`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ usuario, password })
    });

    return handleJsonResponse(res);
};

export const buyTickets = async (IdRifa: number, Nombre: string, Telefono: number, Numeros: number[]) => {
    const res = await fetch(`${API_URL}/buyTickets.php`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            IdRifa: IdRifa, 
            Nombre: Nombre,
            Telefono: Telefono, 
            Numeros: Numeros
        })
    });

    return handleJsonResponse(res);
}

export const getTicketsByRaffle = async (id: number) => {
    const res = await fetch(`${API_URL}/getTicketsByRaffle.php?IdRifa=${id}`, {
        method: "GET"
    });
    return await res.json();
};

export const removeTicket = async (id: number) => {
    const res = await fetch(`${API_URL}/removeTicket.php`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders()
        },
        body: JSON.stringify({
            IdBoleto: id
        })
    });

    return await handleJsonResponse(res);
}

export const updatePayed = async (id: number) => {
    const res = await fetch(`${API_URL}/updatePayed.php`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders()
        },
        body: JSON.stringify({
            IdBoleto: id
        })
    });

    const data = await handleJsonResponse(res);
    if (!data.success) {
        throw new Error(data.message || 'Error al actualizar el boleto');
    }
    
    console.log(data)
    return data;
}