const NotFoundPage = () => {
    return (
        <div className="flex flex-col items-center justify-center h-[60vh]">
            <h1 className="text-6xl font-bold text-[#f6d061]">404</h1>
            <p className="text-2xl text-neutral-300 mt-4">Pagina no encontrada</p>
            <div className="mt-6">
                <a href="/" className="text-[#f6d061] text-lg font-semibold border-2 border-[#f6d061] rounded-lg px-4 py-2 hover:bg-[#f6d061] hover:text-black transition-colors duration-300">Volver al inicio</a>
            </div>
        </div>
    );
}
 
export default NotFoundPage;