import About from "../components/about";
import Compra from "../components/compra";
import Imagen from "../components/imagen";
import Premios from "../components/premios";

const HomePage = () => {
    return (
        <>
            <Imagen/>
            <Compra/>
            <About/>
            <Premios/>
        </>
    );
}
 
export default HomePage;