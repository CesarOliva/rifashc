const Hero = () => {
    return (
        <div className="w-[90%] flex gap-10 items-center my-12 flex-col md:flex-row">
            <div className="w-full md:w-1/2 flex justify-center">
                <img className="max-w-125 w-full rounded-xl hover:scale-105 duration-300" src="https://images.unsplash.com/photo-1606813907291-d86efa9b94db"/>
            </div>

            <div className="w-full md:w-1/2 flex flex-col">
                <h1 className="text-4xl font-bold text-[#ff2a2a] mb-3">PlayStation 5</h1>
                <h1 className="text-2xl font-bold text-[#f6d061] mb-3">$50</h1>
                <h2 className="mb-6 text-lg">Participa y ayuda a apoyar nuestra causa. Cada boleto hace la diferencia.</h2>

                <div className="flex gap-4 mb-6 flex-wrap">
                    <div className="bg-[#1f1f1f] p-4 rounded-lg text-center min-w-18">
                        <p className="text-lg font-semibold flex flex-col"><span className="text-2xl text-[#ff3b3b]">20</span> días</p>
                    </div>
                    <div className="bg-[#1f1f1f] p-4 rounded-lg text-center min-w-18">
                        <p className="text-lg font-semibold flex flex-col"><span className="text-2xl text-[#ff3b3b]">12</span> hrs</p>
                    </div>
                    <div className="bg-[#1f1f1f] p-4 rounded-lg text-center min-w-18">
                        <p className="text-lg font-semibold flex flex-col"><span className="text-2xl text-[#ff3b3b]">5</span> min</p>
                    </div>
                    <div className="bg-[#1f1f1f] p-4 rounded-lg text-center min-w-18">
                        <p className="text-lg font-semibold flex flex-col"><span className="text-2xl text-[#ff3b3b]">37</span> seg</p>
                    </div>
                </div>

                <div className="mb-4">
                    <div className="h-3 bg-[#333] rounded-2xl overflow-hidden">
                        <div className="h-full w-1/2 bg-linear-to-r from-[#ff0000] to-[#ff6a00] duration-1000"/>
                    </div>

                    <div className="flex justify-between mt-2 text-[14px] opacity-80">
                        <p>50 boletos vendidos</p>
                        <p>100 totales</p>
                    </div>
                </div>
                <button className="bg-linear-to-r from-[#ff0000] to-[#ff6a00] duration-300 text-lg font-medium rounded-lg w-full border-none p-4">Comprar boletos</button>
            </div>
        </div>
    );
}
 
export default Hero;