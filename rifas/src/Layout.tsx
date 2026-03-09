import { Outlet } from "react-router";
import Footer from "./components/footer";
const Layout = () => {
    return (
        <div className="flex flex-col items-center">
            <div className="w-full max-w-300 flex flex-col items-center justify-center my-8">
                <Outlet/>
            </div>
            <Footer/>
        </div>
    );
}
 
export default Layout;