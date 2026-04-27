import { CircleCheck, Pencil, Plus, X } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { formatearMoneda } from "../services/currencyFormat";
import { createPrizeImage, getAllRaffles, getPrizeImages, removePrizeImage, removeRaffle, updateActive } from "../services/api";
import { useEffect, useRef, useState } from "react";
import RemoveDialog from "../components/AlertDialog";
import { toast } from "sonner";
import { clearAdminToken } from "../services/auth";
import ImageSelect, { type ImageSelectHandle } from "../components/admin/ImageSelect";

const AdminPage = () => {
    const [raffles, setRaffles] = useState([]);
    const [prizeImages, setPrizeImages] = useState<any[]>([]);
    const [loadingPrizeImage, setLoadingPrizeImage] = useState(false);
    const imageSelectRef = useRef<ImageSelectHandle>(null);

    const navigate = useNavigate();

    const handleCreate = () => {
        navigate('/Admin/Create');
    }
    const handleLogout = () => {
        clearAdminToken();
        navigate("/Admin/Login");
    }

    const fetchRaffles = async () => {
        const response = await getAllRaffles();
        setRaffles(response.data || []);
    };

    const fetchPrizeImages = async () => {
        const response = await getPrizeImages();
        setPrizeImages(response.data || []);
    };

    useEffect(() => {
        fetchRaffles();
        fetchPrizeImages();
    }, []);

    const handleAddPrizeImage = async () => {
        setLoadingPrizeImage(true);

        const uploadedUrl = await imageSelectRef.current?.upload();

        if (!uploadedUrl) {
            setLoadingPrizeImage(false);
            return;
        }

        const promise = createPrizeImage({ Imagen: uploadedUrl });

        toast.promise(promise, {
            loading: "Guardando imagen...",
            success: "Imagen agregada con exito!",
            error: "Error al agregar imagen"
        });

        promise
            .then((data) => {
                if (data.success) {
                    fetchPrizeImages();
                }
            })
            .finally(() => {
                setLoadingPrizeImage(false);
            });
    }

    const handleRemovePrizeImage = (id: number) => {
        const promise = removePrizeImage(id);

        toast.promise(promise, {
            loading: "Eliminando imagen...",
            success: "Imagen eliminada",
            error: "Error al eliminar imagen"
        });

        promise.then((data) => {
            if (data.success) {
                fetchPrizeImages();
            }
        });
    }

    const changeActive = (id: number) => {
        const promise = updateActive(id);

        toast.promise(promise, {
            loading: "Actualizando...",
            success: "Rifa actualizada con exito!",
            error: (err) => {
                return `${err.message || 'Fallo al actualizar.'}`;
            }
        });
        promise.then(()=>{
            fetchRaffles();
        })
    }

    const handleRemoveRaffle = async (id: number)=>{
        const promise = removeRaffle(id);
        toast.promise(promise, {
            loading: 'Eliminando...',
            success: 'Eliminado correctamente',
            error: 'Error al eliminar'
        });
        promise.then(()=>{
            fetchRaffles();
        })
    }

    return (
        <main className="w-full max-w-300 my-8 p-6">
            <section className="flex flex-col sm:flex-row justify-between items-center mb-4">
                <div>
                    <h2 className="text-3xl font-bold text-center sm:text-start">Gestión de Rifas</h2>
                    <p className="text-lg text-neutral-300 text-center sm:text-start mb-2 sm:mb-0">Administra las rifas activas o crea una nueva!</p>
                </div>
                <div className="flex items-center space-x-4">
                    <button onClick={handleLogout} className="px-4 py-2 text-neutral-200 border border-neutral-500 rounded-lg hover:bg-neutral-800 cursor-pointer">
                        Cerrar sesion
                    </button>
                    <button onClick={handleCreate} className="ml-2 px-4 py-2 text-black cursor-pointer rounded-lg bg-neutral-200 hover:bg-neutral-300 flex items-center font-medium">
                        <Plus className="mr-2"/>
                        Nueva Rifa
                    </button>
                </div>
            </section>
                
            <div className="grid grid-cols-1 gap-8">
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-xl shadow overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200 flex items-center">
                            <h3 className="text-black text-xl font-semibold">Historial de Rifas</h3>
                        </div>
                        
                        <div className="overflow-x-auto max-h-120">
                            <table className="w-full text-neutral-800">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="py-3 px-6 text-left">Nombre</th>
                                        <th className="py-3 px-6 text-left">Precio Boleto</th>
                                        <th className="py-3 px-6 text-left">Cantidad de Boletos</th>
                                        <th className="py-3 px-6 text-left">Fecha</th>
                                        <th className="py-3 px-6 text-left">Activa</th>
                                        <th className="py-3 px-6 text-left">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {raffles.map(({ IdRifa, Nombre, Imagen, PrecioBoleto, CantidadBoletos, Fecha, Activa}) => (
                                        <tr key={IdRifa} className="hover:bg-gray-50">
                                            <td className="py-4 px-6">
                                                <Link to={`/Admin/Rifa-${IdRifa}`}>
                                                    <div className="flex min-w-60 max-w-80 items-center">
                                                        <div className="sm:flex items-center justify-center mr-4">
                                                            <img className='size-12 rounded-md' src={Imagen} alt={Nombre}/>
                                                        </div>
                                                        <div>
                                                            <p className="font-medium">{Nombre}</p>
                                                        </div>
                                                    </div>
                                                </Link>
                                            </td>
                                            <td className="py-4 px-6 font-semibold">{formatearMoneda(PrecioBoleto)}</td>
                                            <td className="py-4 px-6 font-semibold">{CantidadBoletos}</td>
                                            <td className="py-4 px-6 font-semibold">{Fecha}</td>
                                            <td className="py-4 px-6">
                                                {Activa ? (
                                                    <CircleCheck onClick={()=> changeActive(IdRifa)} className="cursor-pointer bg-green-100 rounded-full text-sm"/>
                                                ): (
                                                    <X onClick={()=> changeActive(IdRifa)} className="cursor-pointer bg-red-100 rounded-full text-sm"/>
                                                )}
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="flex space-x-2">
                                                    <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                                                        <Pencil onClick={()=> {
                                                            navigate(`/Admin/Rifa-${IdRifa}`)
                                                        }} className="size-6 cursor-pointer"/>
                                                    </button>
                                                    <div className="cursor-pointer p-2 text-red-600 hover:bg-red-50 rounded-lg">
                                                        <RemoveDialog 
                                                            onConfirm={() => handleRemoveRaffle(IdRifa)}
                                                        />
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-2">
                    <div className="bg-white rounded-xl shadow overflow-hidden p-6">
                        <div className="mb-6">
                            <h3 className="text-black text-xl font-semibold">Lo que puedes ganar:</h3>
                            <p className="text-neutral-600">Estas imagenes son independientes de las rifas.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="w-full">
                                <ImageSelect ref={imageSelectRef} />
                                <button
                                    onClick={handleAddPrizeImage}
                                    disabled={loadingPrizeImage}
                                    className="mt-4 px-4 py-2 text-black cursor-pointer rounded-lg bg-neutral-200 hover:bg-neutral-300 font-medium disabled:cursor-not-allowed disabled:opacity-70"
                                >
                                    Agregar Imagen
                                </button>
                            </div>

                            <div>
                                <h4 className="text-black text-lg font-semibold mb-3">Imagenes actuales</h4>
                                {prizeImages.length === 0 ? (
                                    <p className="text-neutral-600">Aun no hay imagenes cargadas.</p>
                                ) : (
                                    <div className="grid grid-cols-2 gap-3 max-h-120 overflow-auto pr-1">
                                        {prizeImages.map(({ IdPremioImagen, Imagen }) => (
                                            <div key={IdPremioImagen} className="relative rounded-lg overflow-hidden border border-neutral-200 group">
                                                <img src={Imagen} alt="Premio" className="w-full h-36 object-cover" />
                                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity text-white">
                                                        <RemoveDialog
                                                            onConfirm={() => handleRemovePrizeImage(IdPremioImagen)}
                                                            title="Eliminar imagen"
                                                            description="Esta imagen ya no se mostrara en la seccion de proximos ganadores."
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
 
export default AdminPage;
