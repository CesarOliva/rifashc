import { useEffect, useRef, useState, type FormEvent } from "react";
import { getRaffleById, updateRaffle } from "../services/api";
import { parseDate } from "../services/parseDate";
import ImageSelect, { type ImageSelectHandle } from "../components/admin/ImageSelect";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router";
import SoldPercentage from "../components/admin/soldPercentage";
import SoldTickets from "../components/admin/soldTickets";

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
    const [description, setDescription] = useState<string>('');
    const [price, setPrice] = useState<number | undefined>(undefined);
    const [amount, setAmount] = useState<number | undefined>(undefined);
    const [selectedDate, setSelectedDate] = useState<string>('');
    const [selectedTime, setSelectedTime] = useState<string>('');
    const imageSelectRef = useRef<ImageSelectHandle>(null);

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

    useEffect(()=>{
        if(raffle){
            setName(raffle.Nombre ?? '');
            setImage(raffle.Imagen ?? '');
            setDescription(raffle.Descripcion ?? '');
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
            Descripcion: description,
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
                        <textarea
                            id="descripcion"
                            name="descripcion"
                            value={description}
                            onChange={(e)=>setDescription(e.target.value)}
                            className='text-lg text-white placeholder:text-neutral-300 font-normal focus:outline-none w-full min-h-24 resize-y rounded-md bg-transparent border border-white/20 px-3 py-2'
                            placeholder="Descripción"
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

            <SoldPercentage/>
            
            <SoldTickets total={raffle?.TotalBoletos} />
        </section>
    );
}
 
export default EditPage;