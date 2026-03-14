import { useState, type FormEvent } from "react";

const FormCreate = () => {
    const [name, setName] = useState<string>('');
    const [images, setImages] = useState<string[]>([]);
    const [date, setDate] = useState<string>('');
    const [price, setPrice] = useState<number>();
    const [amount, setAmount] = useState<number>();

    const handleSubmit = (e: FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
    }
    return (
        <section className="w-full flex flex-col items-center justify-center my-8 px-8">
            <div className="w-full max-w-300 flex flex-col md:flex-row justify-center items-center gap-y-8">
                <form onSubmit={handleSubmit} className="flex w-full flex-col md:flex-row">
                    <div className="w-full md:w-1/2 flex justify-center mb-4 md:mb-0 overflow-hidden">
                        <div className="rounded-lg object-cover flex items-center justify-center focus:outline-none border border-neutral-500 p-2 size-96 md:size-128">
                            <div className='flex flex-col items-center justify-center gap-2 text-center text-xs text-neutral-200'>
                                {/* <div className="flex flex-wrap gap-2 justify-between">
                                    {initialData?.images.map((url, index)=>(
                                        <div key={index} className="relative inline-block group">
                                            <img 
                                                className="bg-white size-24 rounded-md" 
                                                src={url} 
                                                alt={initialData.name} 
                                            />
                                            <div onClick={()=> {
                                                handleRemoveImage(url);
                                            }} className="cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-200 absolute top-1 right-1 bg-white rounded-full p-1 shadow-md hover:bg-gray-100">
                                                <Trash2Icon className="block h-4 w-4 text-muted-foreground" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <UploaderProvider uploadFn={uploadFn} autoUpload>
                                    <ImageUploader
                                        maxFiles={6}
                                        maxSize={1024 * 1024 * 1} // 1 MB
                                    />
                                </UploaderProvider> */}
                            </div>
                        </div>
                    </div>
                                
                    <div className="w-full flex flex-col md:w-1/2 md:ml-6 gap-y-3">
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
                            value={price}
                            onChange={(e)=>setPrice(+e.target.value)}
                            className='text-2xl font-semibold text-[#f6d061] placeholder:text-neutral-300 focus:outline-none w-full max-w-100 rounded-md'
                            placeholder="Precio Boleto"
                        />
                        <input
                            type="number"
                            id="cantidad"
                            name="cantidad"
                            value={amount}
                            onChange={(e)=>setAmount(+e.target.value)}
                            className='text-2xl font-semibold text-[#f6d061] placeholder:text-neutral-300 focus:outline-none w-full max-w-100 rounded-md'
                            placeholder="Cantidad Boletos"
                        />
                        <input 
                            type="text"
                            id="fecha"
                            name="fecha"
                            value={date}
                            onChange={(e)=>setDate(e.target.value)}
                            className='text-lg font-semibold text-neutral-700 focus:outline-none w-full max-w-100 rounded-md'
                            placeholder="Fecha"
                        />
                                
                        <button type="submit" className="bg-[#f6d061] hover:bg-[#f5c946] font-semibold text-black h-12 w-36 rounded-lg transition-colors duration-300">GUARDAR</button>
                    </div>
                </form>
            </div>
        </section>
    );
}
 
export default FormCreate;