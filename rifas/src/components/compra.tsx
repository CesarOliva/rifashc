import { useState, type ChangeEvent, type FormEvent } from "react";
import { toast } from "sonner";

interface Contacto {
    nombre: string;
    telefono: number;
}

const CompraModal = ({onClose}: {
    onClose: ()=> void
}) => {
    const [selectedTickets, setSelectedTickets] = useState<number[]>([]);
    const [validated, setValidated] = useState<boolean>(false);
    const [currentStep, setCurrentStep] = useState<number>(1);

    const [customerData, setCustomerData] = useState<Contacto>({
        nombre: '',
        telefono: 0,
    });

    const handleFirstSubmit = (e: any) => {
        e.preventDefault();
        setCurrentStep(2);
    };

    const handleSecondSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setValidated(false);
        
        if(customerData.nombre.trim() === ''){
            toast.error('Nombre requerido')
            return;
        }
        if(customerData.telefono === 0){
            toast.error('Teléfono requerido')
            return;
        }

        setCurrentStep(3);
    };

    const handlePay = ()=>{
        
    }

    const handleContactChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
        const { name, value } = e.target;
        setCustomerData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const toggleTicket = (num: number)=> {
        setSelectedTickets((prev)=>
            prev.includes(num)
                ? prev.filter((t) => t !== num)
                : [...prev, num]
        );
    }

    return (
        <div onClick={onClose} className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-xl w-full max-w-150">
                {currentStep === 1 &&(
                    <>
                        <div className="flex flex-col mb-4 bg-black p-6 rounded-t-xl">
                            <h2 className="text-white text-2xl font-semibold">Comprar Boletos</h2>
                            <p className="text-lg text-neutral-300">Playstation 5</p>
                        </div>
                        <div className="grid grid-cols-7 md:grid-cols-10 gap-2 p-6 max-h-[50vh] overflow-y-auto">
                            {Array.from({ length: 100 }, (_, i) => i + 1).map((num) => (
                                <button 
                                    key={num}
                                    onClick={() => toggleTicket(num)}
                                    className={`rounded-lg p-2 text-white cursor-pointer
                                        ${selectedTickets.includes(num)
                                            ? 'bg-[#ff2a2a]'
                                            : 'bg-neutral-700 hover:bg-neutral-600}'
                                        }
                                    `}
                                >
                                    {num}
                                </button>
                            ))}
                        </div>
                        <div className="flex justify-end p-6">
                            <button onClick={onClose} className="bg-neutral-900 hover:bg-neutral-800 text-white px-4 py-2 rounded-lg mr-2 cursor-pointer">Cancelar</button>
                            <button onClick={handleFirstSubmit} className="bg-[#ff2a2a] text-white px-4 py-2 rounded-lg hover:bg-[#ff6a00] transition duration-300 cursor-pointer">Siguiente</button>
                        </div>
                    </>
                )}
                {currentStep === 2 &&(
                    <>
                        <div className="flex flex-col mb-4 bg-black p-6 rounded-t-xl">
                            <h2 className="text-white text-2xl font-semibold">Comprar Boletos</h2>
                            <p className="text-lg text-neutral-300">Playstation 5</p>
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
                            <div className="flex justify-end p-6">
                                <button onClick={onClose} className="bg-neutral-900 hover:bg-neutral-800 text-white px-4 py-2 rounded-lg mr-2 cursor-pointer">Cancelar</button>
                                <button onClick={()=> setCurrentStep(1)} className="bg-neutral-800 hover:bg-neutral-700 text-white px-4 py-2 rounded-lg mr-2 cursor-pointer">Anterior</button>
                                <button onClick={handleFirstSubmit} className="bg-[#ff2a2a] text-white px-4 py-2 rounded-lg hover:bg-[#ff6a00] transition duration-300 cursor-pointer">Siguiente</button>
                            </div>
                        </form>
                    </>
                )}
                {currentStep === 3 &&(
                    <>
                        <div className="flex flex-col mb-4 bg-black p-6 rounded-t-xl">
                            <h2 className="text-white text-2xl font-semibold">Comprar Boletos</h2>
                            <p className="text-lg text-neutral-300">Playstation 5</p>
                        </div>
                        
                        <div className="flex justify-end p-6">
                            <button onClick={onClose} className="bg-neutral-900 hover:bg-neutral-800 text-white px-4 py-2 rounded-lg mr-2 cursor-pointer">Cancelar</button>
                            <button onClick={handlePay} className="bg-[#ff2a2a] text-white px-4 py-2 rounded-lg hover:bg-[#ff6a00] transition duration-300 cursor-pointer">Comprar</button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
 
export default CompraModal;