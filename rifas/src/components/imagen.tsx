const Imagen = () => {
    return (
        <div className="w-full h-[80vh] overflow-hidden bg-cover bg-center flex items-end justify-center" 
            style={{
                backgroundImage: "url('https://images.unsplash.com/photo-1606813907291-d86efa9b94db')"
            }}
        >
            <div className="flex w-60 mb-8">
                <a href="#compra" className="bg-[#f6d061] text-lg font-semibold text-center rounded-lg w-full text-black border-none p-3">Comprar boletos</a>
            </div>
        </div>
    );
}
 
export default Imagen;