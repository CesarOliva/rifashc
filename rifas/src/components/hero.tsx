import { useEffect, useState } from "react";
import CompraModal from "./compra";
import { getActiveRaffle } from "../services/api";
import { parseDate } from "../services/parseDate";

const Hero = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false)

    const [raffle, setRaffle] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const [time, setTime] = useState({
        days:0,
        hours:0,
        minutes:0,
        seconds:0
    })
    
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

    function getCountdown(date: Date) {
        const now = new Date().getTime()
        const diff = date.getTime() - now

        if(diff <= 0){
            return {
                days:0,
                hours:0,
                minutes:0,
                seconds:0
            }
        }

        const days = Math.floor(diff / (1000*60*60*24))
        const hours = Math.floor((diff / (1000*60*60)) % 24)
        const minutes = Math.floor((diff / (1000*60)) % 60)
        const seconds = Math.floor((diff / 1000) % 60)

        return {days,hours,minutes,seconds}
    }

    useEffect(()=>{
        if(!raffle?.data.Fecha) return

        const date = parseDate(raffle.data.Fecha)

        const interval = setInterval(()=>{
            setTime(getCountdown(date))
        },1000)

        return ()=> clearInterval(interval)

    },[raffle])

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
            <div id="compra" className="w-full bg-linear-to-r from-[#ff0000] to-[#ff6a00] flex flex-col items-center py-8">
                <div className="max-w-300 pb-3 pt-3">
                    <h3 className="text-white text-3xl font-semibold text-center">PRÓXIMO SORTEO</h3>
                    <p className="text-white text-lg font-normal text-center mb-4 mt-1">
                        Aún estas a tiempo para comprar tus boletos para nuestro siguiente sorteo<br/>
                        <span className="text-white text-xl font-bold">"{raffle.data.Nombre}"</span><br/>
                        <span className="text-white text-xl font-bold">${raffle.data.PrecioBoleto}</span> por boleto
                    </p>

                    <div className="flex justify-center gap-4 my-4 flex-wrap">
                        <div className="bg-[#1f1f1f] p-4 rounded-lg text-center min-w-18">
                            <p className="text-lg font-semibold flex flex-col"><span className="text-2xl text-white">{time.days}</span> días</p>
                        </div>
                        <div className="bg-[#1f1f1f] p-4 rounded-lg text-center min-w-18">
                            <p className="text-lg font-semibold flex flex-col"><span className="text-2xl text-white">{time.hours}</span> hrs</p>
                        </div>
                        <div className="bg-[#1f1f1f] p-4 rounded-lg text-center min-w-18">
                            <p className="text-lg font-semibold flex flex-col"><span className="text-2xl text-white">{time.minutes}</span> min</p>
                        </div>
                        <div className="bg-[#1f1f1f] p-4 rounded-lg text-center min-w-18">
                            <p className="text-lg font-semibold flex flex-col"><span className="text-2xl text-white">{time.seconds}</span> seg</p>
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