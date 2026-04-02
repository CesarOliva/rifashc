import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { toast } from "sonner";
import { CreditCard } from "../ui/credit-card";
import { buyTickets, getActiveRaffle, getTicketsByRaffle } from "../../services/api";
import { formatearMoneda } from "../../services/currencyFormat";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../ui/carousel";

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

    const [selectedTickets, setSelectedTickets] = useState<number[]>([]);
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

        if(selectedTickets.length <= 0){
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

    const handlePay = ()=>{
        setDisabled(true);
        const promise = buyTickets(raffle.data.IdRifa, customerData.nombre, customerData.telefono, selectedTickets);

        toast.promise(promise, {
            loading: 'Comprando...',
            success: 'Boletos por confirmar',
            error: 'Error al comprar'
        });

        promise
            .then((data) => {
                if (data.success) {
                    onClose();
                }
            })
            .finally(() => {
                setDisabled(false);
            });
    }

    const handleContactChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
        const { name, value } = e.target;
        setCustomerData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const toggleTicket = (num: number)=> {
        if(purchasedTickets.includes(num)){
            return;
        }
        setSelectedTickets((prev)=>
            prev.includes(num)
                ? prev.filter((t) => t !== num)
                : [...prev, num]
        );
    }

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
                        </div>
                        <div className="grid grid-cols-7 md:grid-cols-10 gap-2 p-6 max-h-[50vh] overflow-y-auto">
                            {Array.from({ length: raffle.data.CantidadBoletos }, (_, i) => i + 1).map((num) => (
                                <button 
                                    key={num}
                                    onClick={() => toggleTicket(num)}
                                    disabled={purchasedTickets.includes(num)}
                                    className={`rounded-lg p-2 text-white cursor-pointer disabled:cursor-not-allowed
                                        ${purchasedTickets.includes(num)
                                            ? 'bg-[#ff2a2a] disabled:opacity-75'
                                            : selectedTickets.includes(num)
                                            ? 'bg-green-600'
                                            : 'bg-neutral-700 hover:bg-neutral-600'
                                        }
                                    `}
                                >
                                    {num}
                                </button>
                            ))}
                        </div>
                        <div className="flex justify-end p-6">
                            <button onClick={onClose} className="bg-neutral-900 hover:bg-neutral-800 text-white px-4 py-2 rounded-lg mr-2 cursor-pointer">Cancelar</button>
                            <button onClick={handleFirstSubmit} className="bg-[#ff2a2a] text-white px-4 py-2 rounded-lg hover:bg-[#ff6a00] transition duration-300 cursor-pointer disabled:cursor-not-allowed">Siguiente</button>
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
                                <div className="flex">
                                    <p className="text-md text-black font-medium">Boletos seleccionados:</p>
                                    <div className="flex gap-1 ml-1 flex-wrap">
                                        {selectedTickets.map((ticket) => (
                                            <span key={ticket} className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                                                #{ticket}
                                            </span>
                                            ))}
                                    </div>
                                </div>
                                <div className="flex">
                                    <p className="text-md text-black font-medium">Total: <span className="font-normal">{formatearMoneda(selectedTickets.length * raffle.data.PrecioBoleto)}</span></p>
                                </div>
                            </div>
                            <div className="flex justify-center items-center w-full overflow-hidden">
                                <Carousel className="w-full max-w-full px-10">
                                    <CarouselContent className="w-full">
                                        <CarouselItem className="basis-full flex justify-center px-2">
                                           <CreditCard type="gray-dark" cardHolder='Rifas HC' cardNumber='4169 1606 2129 7382' company='Bancoppel' width={280}/>
                                        </CarouselItem>
                                        <CarouselItem className="basis-full flex justify-center px-2">
                                            <CreditCard type="gray-light" cardHolder='Rifas HC' cardNumber='5579 0890 0754 7493' company='Santander' width={280}/>
                                        </CarouselItem>
                                    </CarouselContent>
                                    <CarouselPrevious className="left-2 text-black"/>
                                    <CarouselNext className="right-2 text-black"/>
                                </Carousel>
                            </div>
                            <p className="text-sm text-gray-500 text-center">Realiza la transferencia por el monto total y envia el comprobante al <a className="text-blue-800" href="https://wa.me/+528673096867">+52 86 7309 6867</a> junto con tu nombre y boletos seleccionados</p>
                        </div>
                        
                        <div className="flex justify-end flex-wrap gap-2 p-6">
                            <button onClick={onClose} className="bg-neutral-900 hover:bg-neutral-800 text-white px-4 py-2 rounded-lg cursor-pointer">Cancelar</button>
                            <button onClick={()=> setCurrentStep(2)} className="bg-neutral-800 hover:bg-neutral-700 text-white px-4 py-2 rounded-lg cursor-pointer">Anterior</button>
                            <button disabled={disabled} onClick={handlePay} className="bg-[#ff2a2a] text-white px-4 py-2 rounded-lg hover:bg-[#ff6a00] transition duration-300 cursor-pointer">Listo</button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
 
export default CompraModal;