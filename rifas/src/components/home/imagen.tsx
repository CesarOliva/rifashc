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
            <div className="w-full h-[60vh] md:h-[80vh] bg-neutral-700 overflow-hidden bg-cover bg-center flex items-end justify-center" 
                style={{
                    backgroundImage: "url('/hero.jpg')"
                }}
            >
            </div>
        )
    }

    return (
        <div className="w-full h-[60vh] md:h-[80vh] bg-neutral-700 overflow-hidden bg-cover bg-center flex items-end justify-center" 
            style={{
                backgroundImage: `url(${raffle.Imagen})`
            }}
        >
            <div className="flex w-60 mb-8">
                <a
                    href="#compra"
                    className="text-center hero-buy-btn group relative w-full overflow-hidden rounded-lg border-none bg-[#f6d061] p-3 text-lg font-semibold text-black shadow-[0_8px_22px_rgba(246,208,97,0.35)] transition-all duration-300 cursor-pointer hover:shadow-[0_14px_30px_rgba(246,208,97,0.5)] active:scale-[0.99] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#f6d061]/45"
                >
                    <span
                        className="absolute inset-y-0 -left-1/2 w-1/2 -skew-x-12 bg-white/55 blur-sm"
                        style={{ animation: "shineSweep 2.8s ease-in-out infinite" }}
                    />
                    <span className="relative inline-flex items-center justify-center gap-2">
                        Comprar boletos
                    </span>
                </a>

            </div>
        </div>
    );
}
 
export default Imagen;