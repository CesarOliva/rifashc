import About from "../components/home/about";
import Hero from "../components/home/hero";
import Imagen from "../components/home/imagen";
import Premios from "../components/home/premios";

const HomePage = () => {
    return (
        <>
            <Imagen/>
            <Hero/>
            <About/>
            <Premios/>
        </>
    );
}
 
export default HomePage;