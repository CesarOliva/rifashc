import { CircleCheck, X } from "lucide-react";
import RemoveDialog from "../AlertDialog";
import { toast } from "sonner";
import { formatTicketNumber } from "../../services/currencyFormat";
import { getRaffleById, getRaffleWinner, getTicketsByRaffle, removeRaffleWinner, removeTicket, startRaffle, updatePayed, updatePayedBatch } from "../../services/api";
import { useEffect, useMemo, useState } from "react";
import { parseDate } from "../../services/parseDate";
import { useParams } from "react-router";

import whatsappTemplate from "../../../messageClient.txt?raw";

const WHATSAPP_PHONE_PREFIX = "52";

const isMobileDevice = () => /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);

const getWhatsAppUrl = (phone: string, message: string) => {
    const encodedMessage = encodeURIComponent(message);

    if (isMobileDevice()) {
        return `whatsapp://send?phone=${phone}&text=${encodedMessage}`;
    }

    return `https://wa.me/${phone}?text=${encodedMessage}`;
};

const SoldTickets = ({ total }: { total: number | null }) => {
    const {IdRifa} = useParams();
    const [raffle, setRaffle] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    const [tickets, setTickets] = useState<any[]>([]); 
    const [paidTickets, setPaidTickets] = useState<number[]>([]);
    const [unpaidTickets, setUnpaidTickets] = useState<number[]>([]);
    
    const [selectedTicketIds, setSelectedTicketIds] = useState<number[]>([]);
    const [winner, setWinner] = useState<any>(null);

    const [drawingWinner, setDrawingWinner] = useState<boolean>(false);
    const [confirmingBatch, setConfirmingBatch] = useState<boolean>(false);

    const isTicketPaid = (value: any) => value === true || value === 1 || value === '1';

    useEffect(()=>{
        const loadRaffle = async ()=> {
            try{
                const id = Number(IdRifa?.split('-')[1]);
                const data = await getRaffleById(id);
                if(!data?.success){
                    setError(data?.message || "Rifa no encontrada");
                } else {
                    setRaffle(data.data);
                    loadTickets(data.data.IdRifa);
                    
                    const ticketsData = await getTicketsByRaffle(data.data.IdRifa);
                    if(ticketsData.data && Array.isArray(ticketsData.data)){
                        syncTicketStatus(ticketsData.data);
                    }

                    const winnerData = await getRaffleWinner(data.data.IdRifa);
                    if (winnerData?.success) {
                        setWinner(winnerData.data);
                    } else {
                        setWinner(null);
                    }
                }
            } catch(err){
                setError("Error al conectar con el servidor");
            }
        }

        loadRaffle();
    }, [IdRifa])

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

    const syncTicketStatus = (ticketList: any[]) => {
        const paid: number[] = [];
        const unpaid: number[] = [];

        ticketList.forEach((ticket: any) => {
            const isPaid = isTicketPaid(ticket.Pagado);
            
            if (isPaid) {
                paid.push(ticket.Numero);
            } else {
                unpaid.push(ticket.Numero);
            }
        });

        setPaidTickets(paid);
        setUnpaidTickets(unpaid);
    };

    const selectedTickets = useMemo(
        () => tickets.filter((ticket) => selectedTicketIds.includes(ticket.IdBoleto)),
        [tickets, selectedTicketIds]
    );

    const normalizePhone = (value: string | number) => String(value).replace(/\D/g, "");

    const formatRaffleDate = (raffleDate: string) => {
        const parsedDate = parseDate(raffleDate);
        if (Number.isNaN(parsedDate.getTime())) {
            return raffleDate || "";
        }

        return new Intl.DateTimeFormat("es-MX", {
            dateStyle: "full",
            timeStyle: "short"
        }).format(parsedDate);
    };

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

    const toggleTicketSelection = (ticket: any) => {
        if (isTicketPaid(ticket.Pagado)) {
            return;
        }

        setSelectedTicketIds((current) =>
            current.includes(ticket.IdBoleto)
                ? current.filter((id) => id !== ticket.IdBoleto)
                : [...current, ticket.IdBoleto]
        );
    };

    const selectAllUnpaid = () => {
        setSelectedTicketIds(
            tickets
                .filter((ticket) => !isTicketPaid(ticket.Pagado))
                .map((ticket) => ticket.IdBoleto)
        );
    };

    const handleBatchConfirm = async () => {
        if (!raffle?.IdRifa) return;

        if (selectedTickets.length === 0) {
            toast.error("Selecciona al menos un boleto");
            return;
        }

        const uniquePhones = Array.from(new Set(selectedTickets.map((ticket) => normalizePhone(ticket.Telefono)).filter(Boolean)));
        if (uniquePhones.length !== 1) {
            toast.error("Los boletos seleccionados deben pertenecer al mismo cliente");
            return;
        }

        setConfirmingBatch(true);
        const ticketIds = selectedTickets.map((ticket) => ticket.IdBoleto);
        const promise = updatePayedBatch(ticketIds);

        toast.promise(promise, {
            loading: "Confirmando boletos...",
            success: "Boletos confirmados con éxito",
            error: "Fallo al confirmar los boletos"
        });

        try {
            const data = await promise;
            if (data?.success) {
                const confirmationMessage = buildConfirmationMessage(selectedTickets);
                clearSelection();
                await loadTickets(raffle.IdRifa);

                const whatsappUrl = getWhatsAppUrl(`${WHATSAPP_PHONE_PREFIX}${uniquePhones[0]}`, confirmationMessage);
                if (isMobileDevice()) {
                    window.location.href = whatsappUrl;
                } else {
                    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
                }
            }
        } finally {
            setConfirmingBatch(false);
        }
    };

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

    const handleStartRaffle = async () => {
        if (!raffle?.IdRifa) return;

        setDrawingWinner(true);
        const promise = startRaffle(raffle.IdRifa);

        toast.promise(promise, {
            loading: "Iniciando rifa...",
            success: "Ganador generado!",
            error: (err) => err?.message || "No se pudo generar ganador"
        });

        promise
            .then((data) => {
                if (data?.success) {
                    setWinner(data.data);
                }
            })
            .finally(() => {
                setDrawingWinner(false);
            });
    }

    const handleRemoveWinner = async () => {
        if (!raffle?.IdRifa) return;

        const promise = removeRaffleWinner(raffle.IdRifa);

        toast.promise(promise, {
            loading: "Eliminando ganador...",
            success: "Ganador eliminado",
            error: "No se pudo eliminar ganador"
        });

        promise.then((data) => {
            if (data?.success) {
                setWinner(null);
            }
        });
    }

    const buildConfirmationMessage = (ticketList: any[]) => {
        const ticketNumbers = ticketList.map((ticket) => `#${formatTicketNumber(ticket.Numero)}`).join(", ");
        const firstTicket = ticketList[0];

        return whatsappTemplate
            .replace("{nombre_rifa}", raffle?.Nombre ?? "")
            .replace("{fecha_rifa}", formatRaffleDate(raffle?.Fecha ?? ""))
            .replace("{nombre_cliente}", firstTicket?.Nombre ?? "")
            .replace("{telefono}", normalizePhone(firstTicket?.Telefono ?? ""))
            .replace("{boletos}", ticketNumbers || "Sin boletos");
    };

    const clearSelection = () => setSelectedTicketIds([]);
    
    return (
        <div className="w-full max-w-300 flex flex-col justify-center items-center gap-y-8 mt-8">
            <h2 className="text-2xl font-bold text-white text-center">Boletos Comprados</h2>

            {error && <p className="text-red-500 text-center">{error}</p>}

            <div className="w-full flex flex-col justify-center items-center gap-y-6">
                <div className="w-full max-w-2xl flex justify-center">
                    <button
                        disabled={drawingWinner}
                        onClick={handleStartRaffle}
                        className="bg-[#f6d061] hover:bg-[#f5c946] font-semibold text-black h-11 px-5 rounded-lg transition-colors duration-300 disabled:opacity-70 disabled:cursor-not-allowed  cursor-pointer"
                    >
                        {drawingWinner ? "Sorteando..." : "Iniciar rifa"}
                    </button>
                </div>

                {winner && (
                    <div className="w-full max-w-2xl bg-neutral-900 border border-neutral-700 rounded-lg p-4">
                        <div className="mb-2 flex items-center justify-between gap-3">
                            <h3 className="text-xl font-bold text-[#f6d061]">Ganador</h3>
                            <button
                                onClick={handleRemoveWinner}
                                className="bg-red-600 hover:bg-red-700 text-white text-sm px-3 py-1 rounded-md transition-colors cursor-pointer"
                            >
                                Volver a sortear
                            </button>
                        </div>
                        <p className="text-white">Boleto: #{formatTicketNumber(winner.Numero)}</p>
                        <p className="text-white">Nombre: {winner.Nombre}</p>
                        <p className="text-white">Teléfono: {winner.Telefono}</p>
                    </div>
                )}

                <div className="w-full max-w-2xl flex flex-col md:ml-6 gap-y-3 max-h-120 overflow-y-scroll">
                    <div className="grid grid-cols-7 md:grid-cols-10 gap-2">
                        {Array.from({ length: total! }, (_, i) => i + 1).map((num) => (
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
                            >
                                {formatTicketNumber(num)}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="w-full flex flex-wrap items-center justify-between gap-3 rounded-lg bg-neutral-900 p-3 text-white">
                    <p className="text-sm text-neutral-300">
                        Seleccionados: <span className="font-semibold text-white">{selectedTickets.length}</span>
                    </p>
                    <div className="flex flex-wrap gap-2">
                        <button
                            type="button"
                            onClick={selectAllUnpaid}
                            className="bg-neutral-700 hover:bg-neutral-600 text-white px-3 py-2 rounded-lg cursor-pointer"
                        >
                            Seleccionar pendientes
                        </button>
                        <button
                            type="button"
                            onClick={clearSelection}
                            className="bg-neutral-700 hover:bg-neutral-600 text-white px-3 py-2 rounded-lg cursor-pointer"
                        >
                            Limpiar
                        </button>
                        <button
                            type="button"
                            disabled={confirmingBatch || selectedTickets.length === 0}
                            onClick={handleBatchConfirm}
                            className="bg-[#f6d061] hover:bg-[#f5c946] disabled:opacity-60 disabled:cursor-not-allowed font-semibold text-black px-4 py-2 rounded-lg cursor-pointer"
                        >
                            {confirmingBatch ? "Confirmando..." : "Confirmar seleccionados"}
                        </button>
                    </div>
                </div>

                <div className="flex flex-col md:ml-6 gap-y-3 w-full max-h-120 overflow-auto">
                    <table className="min-w-full bg-neutral-800 rounded-lg text-left">
                        <thead>
                            <tr>
                                <th className="py-2 px-4 border-b border-gray-300 text-gray-300">Sel</th>
                                <th className="py-2 px-4 border-b border-gray-300 text-gray-300">Número</th>
                                <th className="py-2 px-4 border-b border-gray-300 text-gray-300">Comprador</th>
                                <th className="py-2 px-4 border-b border-gray-300 text-gray-300">Teléfono</th>
                                <th className="py-2 px-4 border-b border-gray-300 text-gray-300">Pagado</th>
                                <th className="py-2 px-4 border-b border-gray-300 text-gray-300">Eliminar</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tickets.map((ticket) => (
                                <tr key={ticket.IdBoleto} className="">
                                    <td className="py-2 px-4 border-b border-gray-300 text-gray-300">
                                        <input
                                            type="checkbox"
                                            checked={selectedTicketIds.includes(ticket.IdBoleto)}
                                            disabled={isTicketPaid(ticket.Pagado)}
                                            onChange={() => toggleTicketSelection(ticket)}
                                            className="size-4 cursor-pointer disabled:cursor-not-allowed"
                                        />
                                    </td>
                                    <td className="py-2 px-4 border-b border-gray-300 text-gray-300">{formatTicketNumber(ticket.Numero)}</td>
                                    <td className="py-2 px-4 border-b border-gray-300 text-gray-300">{ticket.Nombre}</td>
                                    <td className="py-2 px-4 border-b border-gray-300 text-gray-300">{ticket.Telefono}</td>
                                    <td className="py-2 px-4 border-b border-gray-300 text-black">
                                        {isTicketPaid(ticket.Pagado) ? (
                                            <CircleCheck className="bg-green-100 rounded-full text-sm"/>
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
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
 
export default SoldTickets;