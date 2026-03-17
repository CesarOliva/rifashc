import { CircleCheck, Pencil, Plus, X } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { formatearMoneda } from "../services/currencyFormat";
import { getAllRaffles, updateActive } from "../services/api";
import { useEffect, useState } from "react";

const AdminPage = () => {
    const [raffles, setRaffles] = useState([]);

    const navigate = useNavigate();

    const handleCreate = () => {
        navigate('/Admin/Create');
    }

    useEffect(() => {
        const fetchRaffles = async () => {
            const response = await getAllRaffles();
            setRaffles(response.data || []);
        };

        fetchRaffles();
    }, []);

    const changeActive = async (id: number) => {
        await updateActive(id);
    }

    return (
        <main className="w-full max-w-300 my-8 p-6">
            <section className="flex flex-col sm:flex-row justify-between items-center mb-4">
                <div>
                    <h2 className="text-3xl font-bold text-center sm:text-start">Gestión de Rifas</h2>
                    <p className="text-lg text-neutral-300 text-center sm:text-start mb-2 sm:mb-0">Administra las rifas activas o crea una nueva!</p>
                </div>
                <div className="flex items-center space-x-4">
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
                                                            // setProductToEdit({
                                                            //     _id: id,
                                                            //     name: name,
                                                            //     price: price,
                                                            //     envio: envio,
                                                            //     description: description,
                                                            //     slug: url,
                                                            //     category: categoryId,
                                                            //     imagen: image
                                                            // });
                                                            navigate("/Admin/Create")
                                                        }} className="size-6"/>
                                                    </button>
                                                    <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                                                        {/* <RemoveDialog 
                                                            onConfirm={() => handleRemoveProduct(url)}
                                                        /> */}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
 
export default AdminPage;