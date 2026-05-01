import { useEffect, useState } from "react";
import { getRaffleById, getTicketsByRaffle } from "../../services/api";
import { useParams } from "react-router";

const SoldPercentage = () => {
    const {IdRifa} = useParams();
    
    const [error, setError] = useState<string | null>(null);
    const [raffle, setRaffle] = useState<any>(null);
    const [soldTickets, setSoldTickets] = useState<number>(0);

    const totalTickets = Number(raffle?.CantidadBoletos) || 0;
    const soldPercentage = totalTickets > 0
        ? Math.min(100, Math.round((soldTickets / totalTickets) * 100))
        : 0;

    useEffect(()=>{
        const loadRaffle = async ()=> {
            try{
                const id = Number(IdRifa?.split('-')[1]);
                const data = await getRaffleById(id);
                if(!data?.success){
                    setError(data?.message || "Rifa no encontrada");
                } else {
                    setRaffle(data.data);

                    const ticketsData = await getTicketsByRaffle(data.data.IdRifa);
                    if (ticketsData.data && Array.isArray(ticketsData.data)) {
                        setSoldTickets(ticketsData.data.length);
                    }
                }
            } catch(err){
                setError("Error al conectar con el servidor");
            }
        };
        loadRaffle();
    }, []);

    return (
        <div className="w-full max-w-3xl mx-auto mt-8 px-4">
            {error && <p className="text-red-500 text-center">{error}</p>}

            <div className="flex justify-between text-sm text-white font-medium mb-1">
                <span>{soldPercentage}% vendido</span>
                <span>{soldTickets} de {totalTickets} boletos</span>
            </div>
            <div className="w-full h-3 rounded-full bg-white/30 overflow-hidden">
                <div
                    className="h-full rounded-full bg-[#f6d061] transition-all duration-500"
                    style={{ width: `${soldPercentage}%` }}
                />
            </div>
        </div>
    );
}
 
export default SoldPercentage;