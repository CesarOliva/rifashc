import { useEffect, useState } from "react";
import CompraModal from "./compra";
import { getActiveRaffle } from "../services/api";

const Hero = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false)

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
        }

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
        <>
            <div id="hero" className="w-full bg-linear-to-r from-[#ff0000] to-[#ff6a00] flex flex-col items-center py-8">
                <div className="max-w-300 pb-3 pt-3">
                    <h3 className="text-white text-3xl font-semibold text-center">PRÓXIMO SORTEO</h3>
                    <p className="text-white text-lg font-normal text-center mb-4 mt-1">
                        Aún estas a tiempo para comprar tus boletos para nuestro siguiente sorteo<br/>
                        <span className="text-white text-xl font-bold">"{raffle.Nombre}"</span><br/>
                        <span className="text-white text-xl font-bold">${raffle.PrecioBoleto}</span> por boleto
                    </p>

                    <div className="flex justify-center gap-4 my-4 flex-wrap">
                        <div className="bg-[#1f1f1f] p-4 rounded-lg text-center min-w-18">
                            <p className="text-lg font-semibold flex flex-col"><span className="text-2xl text-white">{20}</span> días</p>
                        </div>
                        <div className="bg-[#1f1f1f] p-4 rounded-lg text-center min-w-18">
                            <p className="text-lg font-semibold flex flex-col"><span className="text-2xl text-white">12</span> hrs</p>
                        </div>
                        <div className="bg-[#1f1f1f] p-4 rounded-lg text-center min-w-18">
                            <p className="text-lg font-semibold flex flex-col"><span className="text-2xl text-white">5</span> min</p>
                        </div>
                        <div className="bg-[#1f1f1f] p-4 rounded-lg text-center min-w-18">
                            <p className="text-lg font-semibold flex flex-col"><span className="text-2xl text-white">37</span> seg</p>
                        </div>
                    </div>

                    <div className="flex max-w-60 mx-auto pt-4">
                        <button onClick={() => setIsOpen(true)} className="bg-[#f6d061] text-lg font-semibold rounded-lg w-full text-black border-none p-3 cursor-pointer">Comprar boletos</button>
                    </div>
                </div>
            </div>

            {isOpen && (
                <CompraModal onClose={()=> setIsOpen(false)}/>
            )}
        </>
    );
}
 
export default Hero;