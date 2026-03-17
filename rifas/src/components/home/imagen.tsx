import { useEffect, useState } from "react";
import { getActiveRaffle } from "../../services/api";

const Imagen = () => {
    const [raffle, setRaffle] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(()=>{
        const loadRaffle = async ()=> {
            try{
                const data = await getActiveRaffle();
    
                if(data.error){
                    setError(data.error);
                }else{
                    setRaffle(data);
                }
            } catch(err){
                setError("Error al conectar con el servidor");
            } finally {
                setLoading(false);
            }
        };
        
        loadRaffle();
    }, [])

    if(loading){
        return(
            <div className="w-full h-[80vh] bg-gray-300 animate-pulse flex items-end justify-center">
                <div className="w-60 mb-8">
                    <div className="bg-gray-400 text-lg font-semibold text-center rounded-lg w-full text-black border-none p-3">&nbsp;</div>
                </div>
            </div>
        )
    }

    if(error){
        return (
            <div className="w-full h-[80vh] bg-red-100 flex items-center justify-center">
                <p className="text-red-500 text-lg font-semibold">{error}</p>
            </div>
        )
    }

    if(!raffle){
        return (
            <div className="w-full h-[80vh] bg-gray-300 flex items-center justify-center">
                <p className="text-gray-500 text-lg font-semibold">No hay rifas activas</p>
            </div>
        )
    }

    return (
        <div className="w-full h-[80vh] bg-neutral-700 overflow-hidden bg-cover bg-center flex items-end justify-center" 
            style={{
                backgroundImage: `url(${raffle.data.Imagen})`
            }}
        >
            <div className="flex w-60 mb-8">
                <a href="#compra" className="bg-[#f6d061] text-lg font-semibold text-center rounded-lg w-full text-black border-none p-3">Comprar boletos</a>
            </div>
        </div>
    );
}
 
export default Imagen;