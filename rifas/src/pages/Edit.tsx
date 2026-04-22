import { useEffect, useRef, useState, type FormEvent } from "react";
import { getRaffleById, getTicketsByRaffle, removeTicket, updatePayed, updateRaffle } from "../services/api";
import { parseDate } from "../services/parseDate";
import ImageSelect, { type ImageSelectHandle } from "../components/admin/ImageSelect";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router";
import { CircleCheck, X } from "lucide-react";
import RemoveDialog from "../components/AlertDialog";

const EditPage = () => {
    const {IdRifa} = useParams();
    const [raffle, setRaffle] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

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
                    if(ticketsData.data && Array.isArray(ticketsData.data)){
                        syncTicketStatus(ticketsData.data);
                    }
                }
            } catch(err){
                setError("Error al conectar con el servidor");
            } finally {
                setLoading(false);
            }
        }

        loadRaffle();
    }, [IdRifa])

    const [name, setName] = useState<string>('');
    const [image, setImage] = useState<string>('');
    const [price, setPrice] = useState<number | undefined>(undefined);
    const [amount, setAmount] = useState<number | undefined>(undefined);
    const [selectedDate, setSelectedDate] = useState<string>('');
    const [selectedTime, setSelectedTime] = useState<string>('');
    const imageSelectRef = useRef<ImageSelectHandle>(null);

    const [tickets, setTickets] = useState<any[]>([]);
    const [paidTickets, setPaidTickets] = useState<number[]>([]);
    const [unpaidTickets, setUnpaidTickets] = useState<number[]>([]);
    const [selectedTicket, setSelectedTicket] = useState<number | null>(null);

    const syncTicketStatus = (ticketList: any[]) => {
        const paid: number[] = [];
        const unpaid: number[] = [];

        ticketList.forEach((ticket: any) => {
            const isPaid = ticket.Pagado === true || ticket.Pagado === 1 || ticket.Pagado === '1';
            
            if (isPaid) {
                paid.push(ticket.Numero);
            } else {
                unpaid.push(ticket.Numero);
            }
        });

        setPaidTickets(paid);
        setUnpaidTickets(unpaid);
    };

    const formatDateInput = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const formatTimeInput = (date: Date) => {
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${hours}:${minutes}`;
    };

    const loadTickets = async (id: number) => {
        try {
            const data = await getTicketsByRaffle(id);
            if (data?.success) {
                setTickets(data.data);
                if (Array.isArray(data.data)) {
                    syncTicketStatus(data.data);
                }
            } else {
                toast.error(data?.message || "Error al cargar boletos");
            }
        } catch (err) {
            toast.error("Error al conectar con el servidor");
        }
    }

    const updateActive = async (IdBoleto: number) => {
        const promise = updatePayed(IdBoleto);
        toast.promise(promise, {
            loading: "Actualizando estado del boleto...",
            success: "Estado del boleto actualizado con éxito!",
            error: "Fallo al actualizar el estado del boleto."
        });

        if(promise){
            promise.then(()=>{
                loadTickets(raffle.IdRifa);
            })
        }
    }

    const deleteTicket = async (IdBoleto: number) => {
        const promise = removeTicket(IdBoleto);
        toast.promise(promise, {
            loading: "Eliminando boleto...",
            success: "Boleto eliminado con exito!",
            error: "Fallo al eliminar boleto."
        });

        if(promise){
            promise.then(()=>{
                loadTickets(raffle.IdRifa);
            })
        }
    }

    useEffect(()=>{
        if(raffle){
            setName(raffle.Nombre ?? '');
            setImage(raffle.Imagen ?? '');
            setPrice(raffle.PrecioBoleto ?? undefined);
            setAmount(raffle.CantidadBoletos ?? undefined);
            if (raffle.Fecha) {
                const date = parseDate(raffle.Fecha);
                setSelectedDate(formatDateInput(date));
                setSelectedTime(formatTimeInput(date));
            } else {
                setSelectedDate('');
                setSelectedTime('');
            }

            loadTickets(raffle.IdRifa);
        }
    }, [raffle])

    const today = formatDateInput(new Date());

    const navigate = useNavigate();

    const handleDateChange = (e: any) => {
        setSelectedDate(e.target.value);
    };
    const handleTimeChange = (e: any) => {
        setSelectedTime(e.target.value);
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        setLoading(true);

        if(name.trim() === ''){
            toast.error('Nombre requerido')
            return;
        }
        if(!price || price <=0){
            toast.error('Precio requerido')
            return;
        }
        if(!amount || amount <=0){
            toast.error('Cantidad requerida')
            return;
        }
        if(selectedDate.trim() === ''){
            toast.error('Fecha requerida')
            return;
        }
        if(selectedTime.trim() === ''){
            toast.error('Hora requerida')
            return;
        }

        const formatedDate = `${selectedDate} ${selectedTime}:00`
        const uploadedUrl = await imageSelectRef.current?.upload();

        if(!uploadedUrl){
            toast.error('Imagen requerida')
            return;
        }
        setImage(uploadedUrl);
        
        const promise = updateRaffle({
            IdRifa: Number(IdRifa?.split('-')[1]),
            Nombre: name,
            Imagen: uploadedUrl,
            Fecha: formatedDate,
            PrecioBoleto: price ? price : 0,
            CantidadBoletos: amount ? amount : 0,
        })

        toast.promise(promise, {
            loading: "Cargando rifa...",
            success: "Rifa Actualizada con exito!",
            error: "Fallo al actualizar rifa."
        });
        
        promise
            .then(data => {
                if (data.success) {
                    navigate("/");
                }
                setLoading(false)
            })
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

    if(error || !raffle){
        return (
            <div className="w-full h-[80vh] flex items-center justify-center">
                <p className="text-red-300 text-lg">{error || "Rifa no encontrada"}</p>
            </div>
        )
    }

    return (
        <section className="w-full flex flex-col items-center justify-center my-12 px-8">
            <div className="w-full max-w-300 flex flex-col md:flex-row justify-center items-center gap-y-8">
                <form action="" encType="multipart/form-data" onSubmit={handleSubmit} className="flex w-full flex-col md:flex-row items-center">
                    <div className="w-full md:w-1/2 flex justify-center mb-4 md:mb-0 overflow-hidden">
                        <ImageSelect
                            ref={imageSelectRef}
                            onImageUploaded={(url) => setImage(url)}
                            initialImageUrl={image}
                        />
                    </div>
                                
                    <div className="w-full max-w-lg flex flex-col md:w-1/2 md:ml-6 gap-y-3">
                        <input
                            type="text"
                            id="nombre"
                            name="nombre"
                            value={name}
                            onChange={(e)=>setName(e.target.value)}
                            className='text-[30px] text-white placeholder:text-neutral-300 font-semibold focus:outline-none w-full max-w-215 rounded-md'
                            placeholder="Nombre"
                        />
                        <input
                            type="number"
                            id="precio"
                            name="precio"
                            value={price ?? ''}
                            onChange={(e)=>setPrice(+e.target.value)}
                            className='text-2xl font-semibold text-[#f6d061] placeholder:text-neutral-300 focus:outline-none w-full max-w-100 rounded-md'
                            placeholder="Precio Boleto"
                        />
                        <input
                            type="number"
                            id="cantidad"
                            name="cantidad"
                            value={amount ?? ''}
                            onChange={(e)=>setAmount(+e.target.value)}
                            className='text-2xl font-semibold text-[#f6d061] placeholder:text-neutral-300 focus:outline-none w-full max-w-100 rounded-md'
                            placeholder="Cantidad Boletos"
                        />
                        <div className="flex gap-2 flex-col md:flex-row">
                            <div className="bg-neutral-50 rounded-lg max-w-xs">
                                <input
                                    type="date"
                                    value={selectedDate}
                                    onChange={handleDateChange}
                                    min={today}
                                    className="bg-neutral-50 text-black px-3 py-2 rounded-lg focus:outline-none w-full cursor-pointer
                                    [&::-webkit-calendar-picker-indicator]:bg-neutral-50 [&::-webkit-calendar-picker-indicator]:p-1 [&::-webkit-calendar-picker-indicator]:rounded-lg [&::-webkit-calendar-picker-indicator]:cursor-pointer
                                    "
                                />
                            </div>
                            <div className="bg-neutral-50 rounded-lg max-w-xs">
                                <input
                                    type="time"
                                    value={selectedTime}
                                    onChange={handleTimeChange}
                                    className="bg-neutral-50 text-black px-3 py-2 rounded-lg focus:outline-none w-full cursor-pointer
                                    [&::-webkit-calendar-picker-indicator]:bg-neutral-50 [&::-webkit-calendar-picker-indicator]:p-1 [&::-webkit-calendar-picker-indicator]:rounded-lg [&::-webkit-calendar-picker-indicator]:cursor-pointer
                                    "
                                />
                            </div>
                        </div>

                        <button disabled={loading} type="submit" className="bg-[#f6d061] hover:bg-[#f5c946] font-semibold text-black h-12 w-36 rounded-lg transition-colors duration-300">GUARDAR</button>
                    </div>
                </form>
            </div>
            
            <div className="w-full max-w-300 flex flex-col justify-center items-center gap-y-8 mt-8">
                <h2 className="text-2xl font-bold text-white text-center">Boletos Comprados</h2>

                <div className="w-full flex flex-col justify-center items-center gap-y-6">
                    <div className="w-full max-w-2xl flex flex-col md:ml-6 gap-y-3">
                        <div className="grid grid-cols-7 md:grid-cols-10 gap-2">
                            {Array.from({ length: amount! }, (_, i) => i + 1).map((num) => (
                                <button 
                                    key={num}
                                    className={`rounded-lg p-2 text-white cursor-pointer disabled:cursor-not-allowed
                                        ${paidTickets.includes(num)
                                            ? 'bg-green-600 disabled:opacity-75'
                                            : unpaidTickets.includes(num)
                                                ? 'bg-[#ff2a2a] disabled:opacity-75'
                                                : 'bg-neutral-700 hover:bg-neutral-600'
                                        }
                                    `}
                                    onClick={()=>{setSelectedTicket(num)}}
                                >
                                    {num}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col md:ml-6 gap-y-3 w-full overflow-auto">
                        {selectedTicket !== null && (
                            <table className="min-w-full bg-neutral-800 rounded-lg text-left">
                                <thead>
                                    <tr>
                                        <th className="py-2 px-4 border-b border-gray-300 text-gray-300">Número</th>
                                        <th className="py-2 px-4 border-b border-gray-300 text-gray-300">Comprador</th>
                                        <th className="py-2 px-4 border-b border-gray-300 text-gray-300">Teléfono</th>
                                        <th className="py-2 px-4 border-b border-gray-300 text-gray-300">Pagado</th>
                                        <th className="py-2 px-4 border-b border-gray-300 text-gray-300">Eliminar</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tickets.map((ticket) => {
                                        if(ticket.Numero === selectedTicket){
                                            return (
                                                <tr key={ticket.IdBoleto} className="">
                                                    <td className="py-2 px-4 border-b border-gray-300 text-gray-300">{ticket.Numero}</td>
                                                    <td className="py-2 px-4 border-b border-gray-300 text-gray-300">{ticket.Nombre}</td>
                                                    <td className="py-2 px-4 border-b border-gray-300 text-gray-300">{ticket.Telefono}</td>
                                                    <td className="py-2 px-4 border-b border-gray-300 text-black">
                                                        {ticket.Pagado ? (
                                                            <CircleCheck onClick={()=> updateActive(ticket.IdBoleto)} className="cursor-pointer bg-green-100 rounded-full text-sm"/>
                                                        ): (
                                                            <X onClick={()=> updateActive(ticket.IdBoleto)} className="cursor-pointer bg-red-100 rounded-full text-sm"/>
                                                        )}
                                                    </td>
                                                    <td className="py-2 px-4 border-b border-gray-300 text-gray-300">
                                                        <div className="w-fit cursor-pointer p-2 text-red-600 hover:bg-red-50 rounded-lg">
                                                            <RemoveDialog 
                                                                onConfirm={() => deleteTicket(ticket.IdBoleto)}
                                                            />
                                                        </div>
                                                    </td>
                                                </tr>
                                            )
                                        }
                                        return null;
                                    })}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
 
export default EditPage;