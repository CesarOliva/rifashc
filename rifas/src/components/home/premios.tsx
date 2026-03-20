import {
  Carousel,
  CarouselContent,
  CarouselItem,
//   CarouselNext,
//   CarouselPrevious,
} from "../ui/carousel"

const Premios = () => {
    return (
        <div className="flex flex-col w-[90%] max-w-300 pb-8">
            <h2 className="text-center text-3xl text-white font-semibold my-6">ALGUNOS DE NUESTROS GANADORES</h2>
            <div className="flex flex-col md:flex-row bg-white rounded-xl p-4 md:p-8 items-center justify-center">
                <div className="w-full md:w-1/3 p-4">
                    <Carousel className="">
                        <CarouselContent>
                            {Array.from({ length: 3 }).map((_, index) => (
                                <CarouselItem key={index} className="basis-full">
                                    <img className="rounded-md h-100 object-cover w-full" src="/proximamente.png" alt="Ganador rifa"/>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                    </Carousel>
                </div>
                <div className="w-full md:w-1/3 p-4">
                    <Carousel className="">
                        <CarouselContent>
                            {Array.from({ length: 3 }).map((_, index) => (
                                <CarouselItem key={index} className="basis-full">
                                    <img className="rounded-md h-100 object-cover w-full" src="/proximamente.png" alt="Ganador rifa"/>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                    </Carousel>
                </div>
                <div className="w-full md:w-1/3 p-4">
                    <Carousel className="">
                        <CarouselContent>
                            {Array.from({ length: 3 }).map((_, index) => (
                                <CarouselItem key={index} className="basis-full">
                                    <img className="rounded-md h-100 object-cover w-full" src="/proximamente.png" alt="Ganador rifa"/>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                    </Carousel>
                </div>
            </div>
        </div>
    )
}

export default Premios;