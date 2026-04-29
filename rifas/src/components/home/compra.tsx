import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { toast } from "sonner";
import { CreditCard } from "../ui/credit-card";
import { buyTickets, getActiveRaffle, getTicketsByRaffle } from "../../services/api";
import { formatearMoneda } from "../../services/currencyFormat";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../ui/carousel";
import whatsappTemplate from "../../../messageUser.txt?raw";

const WHATSAPP_PHONE = "528673096867";

interface Contacto {
    nombre: string;
    telefono: number;
}

const CompraModal = ({onClose}: {
    onClose: ()=> void
}) => {
    const [raffle, setRaffle] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [disabled, setDisabled] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [purchasedTickets, setPurchasedTickets] = useState<number[]>([]);

    const [paidSelectedTickets, setPaidSelectedTickets] = useState<number[]>([]);
    const [freeSelectedTickets, setFreeSelectedTickets] = useState<number[]>([]);
    const [showRandomInput, setShowRandomInput] = useState<boolean>(false);
    const [showRandomResultModal, setShowRandomResultModal] = useState<boolean>(false);
    const [isGeneratingRandom, setIsGeneratingRandom] = useState<boolean>(false);
    const [generatedRandomTickets, setGeneratedRandomTickets] = useState<number[]>([]);
    const randomGenerationTimeoutRef = useRef<number | null>(null);
    const [randomQuantity, setRandomQuantity] = useState<number | ''>('');
    const [validated, setValidated] = useState<boolean>(false);
    const [currentStep, setCurrentStep] = useState<number>(1);

    const [customerData, setCustomerData] = useState<Contacto>({
        nombre: '',
        telefono: 0,
    });

    

    useEffect(()=>{
        const loadRaffle = async ()=> {
            try{
                const data = await getActiveRaffle();
    
                if(data.error){
                    setError(data.error);
                }else{
                    setRaffle(data);
                    // Obtener boletos comprados
                    const ticketsData = await getTicketsByRaffle(data.data.IdRifa);
                    if(ticketsData.data && Array.isArray(ticketsData.data)){
                        const ticketNumbers = ticketsData.data.map((ticket: any) => ticket.Numero);
                        setPurchasedTickets(ticketNumbers);
                    }
                }
            } catch(err){
                setError("Error al conectar con el servidor");
            } finally {
                setLoading(false);
            }
        }

        loadRaffle();
    }, [])

    const handleFirstSubmit = (e: any) => {
        e.preventDefault();

        if(paidSelectedTickets.length <= 0){
            setValidated(false)
            toast.error('Selecciona uno o mas boletos')
            return;
        }

        setValidated(true)
        setCurrentStep(2);
    };

    const handleSecondSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        if(customerData.nombre.trim() === ''){
            toast.error('Nombre requerido')
            return;
        }
        if(customerData.telefono === 0){
            toast.error('Teléfono requerido')
            return;
        }

        setValidated(true)
        setCurrentStep(3);
    };

    const handlePay = async () => {
        setDisabled(true);

        const whatsappWindow = window.open("about:blank", "_blank");
        if (!whatsappWindow) {
            toast.error("El navegador bloqueó la apertura de WhatsApp");
            setDisabled(false);
            return;
        }
        whatsappWindow.opener = null;

        const promise = buyTickets(
            raffle.data.IdRifa,
            customerData.nombre,
            customerData.telefono,
            paidSelectedTickets,
            freeSelectedTickets
        );

        toast.promise(promise, {
            loading: "Comprando...",
            success: "Boletos por confirmar",
            error: "Error al comprar"
        });

        try {
            const data = await promise;

            if (data.success) {
                const fechaApartado = new Date().toLocaleString("es-MX", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                });

                const boletosPagados = paidSelectedTickets.length > 0
                    ? paidSelectedTickets.map((ticket) => `#${ticket}`).join(", ")
                    : "Sin boletos";
                const boletosGratis = freeSelectedTickets.length > 0
                    ? freeSelectedTickets.map((ticket) => `#${ticket}`).join(", ")
                    : "Sin boletos gratis";

                const message = whatsappTemplate
                    .replace("{nombre}", customerData.nombre.trim())
                    .replace("{telefono}", String(customerData.telefono))
                    .replace("{nombre_rifa}", raffle.data.Nombre)
                    .replace("{boletos_pagados}", boletosPagados)
                    .replace("{boletos_gratis}", boletosGratis)
                    .replace("{importe}", String(paidSelectedTickets.length * raffle.data.PrecioBoleto))
                    .replace("{fecha}", fechaApartado);

                whatsappWindow.location.href = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
                onClose();
            } else {
                whatsappWindow.close();
            }
        } catch {
            whatsappWindow.close();
        } finally {
            setDisabled(false);
        }
    };

    const handleContactChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
        const { name, value } = e.target;
        setCustomerData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const toggleTicket = (num: number)=> {
        if(purchasedTickets.includes(num) || freeSelectedTickets.includes(num)){
            return;
        }
        setPaidSelectedTickets((prev)=>
            prev.includes(num)
                ? prev.filter((t) => t !== num)
                : [...prev, num]
        );
    }

    const getRandomSubset = (pool: number[], quantity: number) => {
        const shuffled = [...pool];

        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }

        return shuffled.slice(0, quantity).sort((a, b) => a - b);
    };

    const getAvailableTickets = () => {
        if (!raffle?.data?.CantidadBoletos) {
            return [];
        }

        return Array.from(
            { length: raffle.data.CantidadBoletos },
            (_, i) => i + 1
        ).filter((ticket) => !purchasedTickets.includes(ticket));
    };

    useEffect(() => {
        if (!raffle?.data?.CantidadBoletos || paidSelectedTickets.length === 0) {
            setFreeSelectedTickets([]);
            return;
        }

        const freePool = getAvailableTickets().filter((ticket) => !paidSelectedTickets.includes(ticket));
        const freeCount = Math.min(paidSelectedTickets.length, freePool.length);
        const nextFreeTickets = getRandomSubset(freePool, freeCount);

        setFreeSelectedTickets(nextFreeTickets);
    }, [paidSelectedTickets, purchasedTickets, raffle?.data?.CantidadBoletos]);

    const openRandomInput = () => {
        const availableTickets = getAvailableTickets();

        if (availableTickets.length === 0) {
            toast.error("No hay boletos disponibles");
            return;
        }

        const defaultQuantity = Math.min(
            paidSelectedTickets.length > 0 ? paidSelectedTickets.length : 1,
            availableTickets.length
        );
        setRandomQuantity(defaultQuantity);
        setShowRandomInput(true);
    };

    const handleRandomSelection = () => {
        const availableTickets = getAvailableTickets();

        if (availableTickets.length === 0) {
            toast.error("No hay boletos disponibles");
            return;
        }

        const ticketsToPick = Number(randomQuantity);
        if (!Number.isInteger(ticketsToPick) || ticketsToPick <= 0) {
            toast.error("Ingresa una cantidad valida");
            return;
        }

        if (ticketsToPick > availableTickets.length) {
            toast.error(`Solo hay ${availableTickets.length} boletos disponibles`);
            return;
        }

        const randomTickets = getRandomSubset(availableTickets, ticketsToPick);
        setShowRandomInput(false);
        setShowRandomResultModal(true);
        setIsGeneratingRandom(true);
        setGeneratedRandomTickets([]);

        if (randomGenerationTimeoutRef.current) {
            window.clearTimeout(randomGenerationTimeoutRef.current);
        }

        randomGenerationTimeoutRef.current = window.setTimeout(() => {
            setPaidSelectedTickets(randomTickets);
            setGeneratedRandomTickets(randomTickets);
            setIsGeneratingRandom(false);
            randomGenerationTimeoutRef.current = null;
        }, 1400);
    };

    const closeRandomResultModal = () => {
        if (randomGenerationTimeoutRef.current) {
            window.clearTimeout(randomGenerationTimeoutRef.current);
            randomGenerationTimeoutRef.current = null;
        }

        setShowRandomResultModal(false);
        setIsGeneratingRandom(false);
        setGeneratedRandomTickets([]);
    }

    const handleUseRandomTickets = () => {
        closeRandomResultModal();
        setValidated(true);
        setCurrentStep(2);
    }

    const copyCardNumber = async (cardNumber: string) => {
        try {
            await navigator.clipboard.writeText(cardNumber);
            toast.success(`Numero copiado: ${cardNumber}`);
        } catch {
            try {
                const textArea = document.createElement("textarea");
                textArea.value = cardNumber;
                textArea.style.position = "fixed";
                textArea.style.opacity = "0";
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();
                document.execCommand("copy");
                document.body.removeChild(textArea);
                toast.success(`Numero copiado: ${cardNumber}`);
            } catch {
                toast.error("No se pudo copiar el numero");
            }
        }
    };

    useEffect(() => {
        return () => {
            if (randomGenerationTimeoutRef.current) {
                window.clearTimeout(randomGenerationTimeoutRef.current);
            }
        }
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
        <div onClick={onClose} className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-xl w-full max-w-150">
                {currentStep === 1 &&(
                    <>
                        <div className="flex flex-col mb-4 bg-black p-6 rounded-t-xl">
                            <h2 className="text-white text-2xl font-semibold">Comprar Boletos</h2>
                            <p className="text-lg text-neutral-300">{raffle.data.Nombre}</p>
                            {raffle.data.Descripcion && (
                                <p className="mt-2 text-sm leading-relaxed text-neutral-400">
                                    {raffle.data.Descripcion}
                                </p>
                            )}
                        </div>
                        <div className="grid grid-cols-7 md:grid-cols-10 gap-2 p-6 max-h-[50vh] overflow-y-auto">
                            {Array.from({ length: raffle.data.CantidadBoletos }, (_, i) => i + 1).map((num) => (
                                <button 
                                    key={num}
                                    onClick={() => toggleTicket(num)}
                                    disabled={purchasedTickets.includes(num) || freeSelectedTickets.includes(num)}
                                    className={`rounded-lg p-2 text-white cursor-pointer disabled:cursor-not-allowed
                                        ${purchasedTickets.includes(num)
                                            ? 'bg-[#ff2a2a] disabled:opacity-75'
                                            : paidSelectedTickets.includes(num)
                                            ? 'bg-green-600'
                                            : freeSelectedTickets.includes(num)
                                            ? 'bg-amber-500 disabled:opacity-85'
                                            : 'bg-neutral-700 hover:bg-neutral-600'
                                        }
                                    `}
                                >
                                    {num}
                                </button>
                            ))}
                        </div>
                        {showRandomInput && (
                            <div className="px-6">
                                <div className="flex flex-wrap items-center gap-2 rounded-lg border border-neutral-300 p-3">
                                    <label htmlFor="randomQuantity" className="text-black font-medium">
                                        Cantidad al azar:
                                    </label>
                                    <input
                                        id="randomQuantity"
                                        type="number"
                                        min={1}
                                        max={getAvailableTickets().length}
                                        value={randomQuantity}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            setRandomQuantity(value === '' ? '' : Number(value));
                                        }}
                                        className="w-24 rounded-md border border-neutral-300 px-2 py-1 text-black"
                                    />
                                    <p className="text-sm text-neutral-600">
                                        Disponibles: {getAvailableTickets().length}
                                    </p>
                                    <button
                                        onClick={handleRandomSelection}
                                        className="bg-[#ff2a2a] text-white px-3 py-1 rounded-md hover:bg-[#ff6a00] cursor-pointer"
                                    >
                                        Generar
                                    </button>
                                    <button
                                        onClick={() => setShowRandomInput(false)}
                                        className="bg-neutral-200 text-black px-3 py-1 rounded-md hover:bg-neutral-300 cursor-pointer"
                                    >
                                        Cerrar
                                    </button>
                                </div>
                            </div>
                        )}
                        <div className="flex flex-wrap justify-between items-center gap-2 p-6">
                            <button onClick={openRandomInput} className="bg-neutral-700 hover:bg-neutral-600 text-white px-4 py-2 rounded-lg cursor-pointer">
                                Elegir al azar
                            </button>
                            <div className="flex gap-2">
                                <button onClick={onClose} className="bg-neutral-900 hover:bg-neutral-800 text-white px-4 py-2 rounded-lg cursor-pointer">Cancelar</button>
                            <button onClick={handleFirstSubmit} className="bg-[#ff2a2a] text-white px-4 py-2 rounded-lg hover:bg-[#ff6a00] transition duration-300 cursor-pointer disabled:cursor-not-allowed">Siguiente</button>
                            </div>
                        </div>
                    </>
                )}
                {currentStep === 2 &&(
                    <>
                        <div className="flex flex-col mb-4 bg-black p-6 rounded-t-xl">
                            <h2 className="text-white text-2xl font-semibold">Comprar Boletos</h2>
                            <p className="text-lg text-neutral-300">{raffle.data.Nombre}</p>
                        </div>

                        <h2 className='text-2xl font-semibold mb-4 px-6 text-black'>Información de Contacto</h2>
                        <form onSubmit={handleSecondSubmit} className='flex flex-col gap-y-2 px-6 text-black'>
                            <div className='flex flex-row items-center gap-x-2'>
                                <label htmlFor="nombre" className='text-lg '>Nombre:</label>
                                <input
                                    className='w-full p-2 border border-neutral-300 rounded-md'
                                    type="text"
                                    id="nombre"
                                    name="nombre"
                                    value={customerData.nombre}
                                    onChange={handleContactChange}
                                    
                                    placeholder="Nombre"
                                />
                            </div>
                        
                            <div className='flex flex-row items-center gap-x-2'>
                                <label htmlFor="telefono" className='text-lg '>Telefono:</label>
                                <input
                                    className='w-full p-2 border border-neutral-300 rounded-md'
                                    type="number"
                                    id="telefono"
                                    name="telefono"
                                    value={customerData.telefono}
                                    onChange={handleContactChange}
                                    
                                    placeholder="Telefono"
                                />
                            </div>
                            <div className="flex justify-end flex-wrap gap-2 py-6">
                                <button onClick={onClose} className="bg-neutral-900 hover:bg-neutral-800 text-white px-4 py-2 rounded-lg cursor-pointer">Cancelar</button>
                                <button onClick={()=> setCurrentStep(1)} className="bg-neutral-800 hover:bg-neutral-700 text-white px-4 py-2 rounded-lg cursor-pointer">Anterior</button>
                                <button disabled={!validated} onClick={()=> handleSecondSubmit} type='submit' className="bg-[#ff2a2a] text-white px-4 py-2 rounded-lg hover:bg-[#ff6a00] transition duration-300 cursor-pointer disabled:cursor-not-allowed">Siguiente</button>
                            </div>
                        </form>
                    </>
                )}
                {currentStep === 3 &&(
                    <>
                        <div className="flex flex-col mb-4 bg-black p-6 rounded-t-xl">
                            <h2 className="text-white text-2xl font-semibold">Comprar Boletos</h2>
                            <p className="text-lg text-neutral-300">{raffle.data.Nombre}</p>
                        </div>

                        <div className="flex flex-col items-center px-6 space-y-4">
                            <div className="flex flex-col w-full">
                                <h2 className="block text-xl text-neutral-800 font-semibold mb-2">Resumen de compra</h2>
                                <div className="flex flex-col gap-2">
                                    <p className="text-md text-black font-medium">Boletos seleccionados (pagados):</p>
                                    <div className="max-h-28 overflow-y-auto rounded-md border border-neutral-200 p-2">
                                        <div className="flex gap-1 flex-wrap">
                                        {paidSelectedTickets.map((ticket) => (
                                            <span key={ticket} className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                                                #{ticket}
                                            </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2 mt-2">
                                    <p className="text-md text-black font-medium">Boletos gratis:</p>
                                    <div className="max-h-20 overflow-y-auto rounded-md border border-amber-200 bg-amber-50 p-2">
                                        <div className="flex gap-1 flex-wrap">
                                            {freeSelectedTickets.length > 0 ? (
                                                freeSelectedTickets.map((ticket) => (
                                                    <span key={ticket} className="flex items-center bg-amber-200 text-amber-900 px-3 py-1 rounded-full text-sm">
                                                        #{ticket}
                                                    </span>
                                                ))
                                            ) : (
                                                <p className="text-sm text-amber-900">No hay boletos gratis disponibles.</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex">
                                    <p className="text-md text-black font-medium">Total a pagar: <span className="font-normal">{formatearMoneda(paidSelectedTickets.length * raffle.data.PrecioBoleto)}</span></p>
                                </div>
                            </div>
                            <div className="flex justify-center items-center w-full overflow-hidden">
                                <Carousel className="w-full max-w-full px-10">
                                    <CarouselContent className="w-full">
                                        <CarouselItem
                                            className="basis-full flex justify-center px-2 cursor-pointer"
                                            onClick={() => copyCardNumber("4169 1606 2129 7382")}
                                        >
                                           <CreditCard type="gray-dark" cardHolder='Ayvi Naomy Huerta' cardNumber='4169 1606 2129 7382' company='Bancoppel' width={280} widthSm={220}/>
                                        </CarouselItem>
                                        <CarouselItem
                                            className="basis-full flex justify-center px-2 cursor-pointer"
                                            onClick={() => copyCardNumber("5579 0890 0754 7493")}
                                        >
                                            <CreditCard type="gray-light" cardHolder='Roberto Huerta Hinojosa' cardNumber='5579 0890 0754 7493' company='Santander' width={280} widthSm={220}/>
                                        </CarouselItem>
                                    </CarouselContent>
                                    <CarouselPrevious className="left-2 text-black"/>
                                    <CarouselNext className="right-2 text-black"/>
                                </Carousel>
                            </div>
                            <p className="text-sm text-gray-500 text-center">Realiza la transferencia por el monto total y envia el comprobante al <a className="text-blue-800" href="https://wa.me/528673096867">52 86 7309 6867</a> junto con tu nombre y tus boletos pagados y gratis.</p>
                        </div>
                        
                        <div className="flex justify-end flex-wrap gap-2 p-6">
                            <button onClick={onClose} className="bg-neutral-900 hover:bg-neutral-800 text-white px-4 py-2 rounded-lg cursor-pointer">Cancelar</button>
                            <button onClick={()=> setCurrentStep(2)} className="bg-neutral-800 hover:bg-neutral-700 text-white px-4 py-2 rounded-lg cursor-pointer">Anterior</button>
                            <button disabled={disabled} onClick={handlePay} className="bg-[#ff2a2a] text-white px-4 py-2 rounded-lg hover:bg-[#ff6a00] transition duration-300 cursor-pointer">Listo</button>
                        </div>
                    </>
                )}
            </div>

            {showRandomResultModal && (
                <div className="fixed inset-0 z-60 bg-black/60 flex items-center justify-center p-4" onClick={(e) => e.stopPropagation()}>
                    <div className="bg-white rounded-xl w-full max-w-lg p-6" onClick={(e) => e.stopPropagation()}>
                        {isGeneratingRandom ? (
                            <div className="flex flex-col items-center justify-center py-8">
                                <img src="/jackpot.gif" alt="Generando boletos" className="size-64 object-contain" />
                                <p className="mt-4 text-xl font-semibold text-neutral-900">Generando boletos al azar...</p>
                                <p className="text-sm text-neutral-600 mt-1">Esto solo toma un momento</p>
                            </div>
                        ) : (
                            <div>
                                <h3 className="text-2xl font-semibold text-black">Boletos generados</h3>
                                <p className="text-neutral-600 mt-1">Estos son tus números seleccionados al azar:</p>

                                <div className="mt-5 flex flex-wrap gap-2 max-h-48 overflow-auto">
                                    {generatedRandomTickets.map((ticket) => (
                                        <span key={ticket} className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                                            #{ticket}
                                        </span>
                                    ))}
                                </div>

                                <div className="mt-6 flex justify-end">
                                    <button
                                        onClick={closeRandomResultModal}
                                        className="bg-neutral-200 text-black px-4 py-2 rounded-lg hover:bg-neutral-300 transition duration-300 cursor-pointer mr-2"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        onClick={handleUseRandomTickets}
                                        className="bg-[#ff2a2a] text-white px-4 py-2 rounded-lg hover:bg-[#ff6a00] transition duration-300 cursor-pointer"
                                    >
                                        Usar estos boletos
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
 
export default CompraModal;