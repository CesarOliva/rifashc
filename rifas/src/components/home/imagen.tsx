import { useEffect, useState } from "react";
import { getActiveRaffle } from "../../services/api";

const Imagen = () => {
    const [raffle, setRaffle] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadRaffle = async () => {
            try {
                const data = await getActiveRaffle();
                if (!data.success) {
                    setError("No hay rifa activa");
                } else {
                    setRaffle(data.data);
                }
            } catch(err){
                setError("Error al conectar con el servidor");
            } finally {
                setLoading(false);
            }
        };
        loadRaffle();
    }, []);

    if(loading){
        return(
            <div className="w-full h-[80vh] bg-gray-300 animate-pulse flex items-end justify-center">
                <div className="w-60 mb-8">
                    <div className="bg-gray-400 text-lg font-semibold text-center rounded-lg w-full text-black border-none p-3">&nbsp;</div>
                </div>
            </div>
        )
    }

    if(error || !raffle){
        return (
            <div className="w-full h-[80vh] bg-neutral-700 overflow-hidden bg-cover bg-center flex items-end justify-center" 
                style={{
                    backgroundImage: "url('/hero.jpg')"
                }}
            >
            </div>
        )
    }

    return (
        <div className="w-full h-[80vh] bg-neutral-700 overflow-hidden bg-cover bg-center flex items-end justify-center" 
            style={{
                backgroundImage: `url(${raffle.Imagen})`
            }}
        >
            <div className="flex w-60 mb-8">
                <a href="#compra" className="bg-[#f6d061] text-lg font-semibold text-center rounded-lg w-full text-black border-none p-3">Comprar boletos</a>
            </div>
        </div>
    );
}
 
export default Imagen;