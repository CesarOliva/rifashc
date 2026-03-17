const About = () => {
    return (
        <div className="w-[90%] max-w-300 flex flex-col pt-12 pb-8">
            <h2 className="text-center text-3xl text-white font-semibold mb-6">¿QUIÉNES SOMOS?</h2>

            <div className="bg-white text-black w-full flex flex-col md:flex-row rounded-xl p-8">
                <div className="w-full flex flex-col justify-center md:w-[60%] mb-4 md:mb-0 md:pr-4">
                    <div className="flex flex-col gap-y-1">
                        <p className="text-lg leading-relaxed"><b>Rifas HC con Causa</b> es una página dedicada a la organización de rifas en línea donde ofrecemos premios como dinero en efectivo, autos, casas y otros grandes premios.</p>
                        <p className="text-lg leading-relaxed">Nuestro objetivo es brindar oportunidades reales a nuestros participantes, realizando sorteos de manera transparente y confiable, para que todos tengan las mismas posibilidades de ganar.</p>
                        <p className="text-lg leading-relaxed">Además buscamos que cada rifa tenga un propósito, apoyando distintas causas y ayudando a personas que lo necesitan.</p>
                        <p className="text-lg leading-relaxed">En Rifas HC con Causa creemos que participar no solo es la oportunidad de ganar grandes premios, sino también de formar parte de algo positivo.</p>
                    </div>
                </div>
                <div className="w-full md:w-[40%] flex justify-center items-center">
                    <img className="size-80 rounded-xl" src="/logo.jpg"/>
                </div>
            </div>
        </div>
    );
}
 
export default About;