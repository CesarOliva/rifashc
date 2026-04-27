import {
  Carousel,
  CarouselContent,
  CarouselItem,
//   CarouselNext,
//   CarouselPrevious,
} from "../ui/carousel"
import Autoplay from "embla-carousel-autoplay"
import { useEffect, useState } from "react"
import { getPrizeImages } from "../../services/api"

const Premios = () => {
    const [images, setImages] = useState<string[]>([]);

    useEffect(() => {
        const loadImages = async () => {
            try {
                const data = await getPrizeImages();
                if (data?.success && Array.isArray(data.data)) {
                    const parsed = data.data
                        .map((item: any) => item.Imagen)
                        .filter((value: unknown) => typeof value === "string" && value.trim() !== "");
                    setImages(parsed);
                }
            } catch (err) {
                setImages([]);
            }
        }

        loadImages();
    }, []);

    const fallbackImages = ["/proximamente.png", "/proximamente.png", "/proximamente.png"];
    const displayImages = images.length > 0 ? images : fallbackImages;

    return (
        <div className="flex flex-col w-[90%] max-w-300 pb-8">
            <h2 className="text-center text-3xl text-white font-semibold my-6">LO QUE PUEDES GANAR:</h2>
            <div className="bg-white rounded-xl p-4 md:p-8">
                <Carousel
                    plugins={[
                        Autoplay({
                            delay: 4000,
                        }),
                    ]}
                    className="w-full"
                >
                    <CarouselContent>
                        {displayImages.map((image, index) => (
                            <CarouselItem key={`${image}-${index}`} className="basis-full md:basis-1/2 lg:basis-1/3">
                                <div className="p-2">
                                    <img className="rounded-md h-100 object-cover w-full" src={image} alt="Proximo premio"/>
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                </Carousel>
            </div>
        </div>
    )
}

export default Premios;