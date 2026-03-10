import { Outlet } from "react-router";
import Footer from "./components/footer";
const Layout = () => {
    return (
        <div className="flex flex-col items-center">
            <div className="w-full flex flex-col items-center justify-center mb-8">
                <Outlet/>
            </div>
            <Footer/>
        </div>
    );
}
 
export default Layout;