const About = () => {
    return (
        <div className="w-[90%] flex flex-col md:flex-row bg-neutral-800 font-white rounded-lg p-4 md:p-6 mb-8">
            <div className="w-full flex flex-col justify-center md:w-[60%] mb-4 md:mb-0 md:pr-4">
                <h3 className="flex text-3xl mb-2 font-medium">¿Quienes somos?</h3>
                <div className="flex flex-col gap-y-1">
                    <p className="text-[17px] leading-relaxed">Rifas HC con Causa es una página dedicada a la organización de rifas en línea donde ofrecemos premios como dinero en efectivo, autos, casas y otros grandes premios.</p>
                    <p className="text-[17px] leading-relaxed">Buscamos que cada rifa tenga un propósito, apoyando distintas causas y ayudando a personas que lo necesitan.</p>
                    <p className="text-[17px] leading-relaxed">En Rifas HC con Causa creemos que participar no solo es la oportunidad de ganar grandes premios, sino también de formar parte de algo positivo.</p>
                </div>
            </div>
            <div className="w-full md:w-[40%] flex justify-center items-center">
                <img className="size-80 rounded-xl" src="/logo.jpg"/>
            </div>
        </div>
    );
}
 
export default About;