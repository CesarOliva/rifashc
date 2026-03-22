import { useEffect, useState } from "react";
import CompraModal from "./compra";
import { getActiveRaffle } from "../../services/api";
import { parseDate } from "../../services/parseDate";
import { CalendarX } from "lucide-react";

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
        if(!raffle?.Fecha) return

        const date = parseDate(raffle.Fecha)
        if (isNaN(date.getTime())) {
            setError("No hay rifa activa");
            return;
        }

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

    if(error || !raffle){
        return (
            <div className="w-full bg-linear-to-r from-[#ff0000] to-[#ff6a00] flex flex-col items-center p-8">
                <div className="max-w-300 py-3 min-h-70 flex items-center gap-4">
                    <div className="bg-amber-100 p-3 rounded-full">
                        <CalendarX className="size-12 text-amber-600" />
                    </div>
                    
                    <div className="flex-1">
                        <h4 className="text-xl font-semibold text-amber-100">
                            No hay rifas activas
                        </h4>
                        <p className="text-lg text-amber-100">
                            Las próximas rifas estarán disponibles pronto
                        </p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <>
            <div id="compra" className="w-full bg-linear-to-r from-[#ff0000] to-[#ff6a00] flex flex-col items-center py-8">
                <div className="max-w-300 py-3">
                    <h3 className="text-white text-3xl font-semibold text-center">PRÓXIMO SORTEO</h3>
                    <p className="text-white 11ztext-lg font-normal text-center mb-4 mt-1">
                        Aún estas a tiempo para comprar tus boletos para nuestro siguiente sorteo<br/>
                        <span className="text-white text-xl font-bold">"{raffle.Nombre}"</span><br/>
                        <span className="text-white text-xl font-bold">${raffle.PrecioBoleto}</span> por boleto
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