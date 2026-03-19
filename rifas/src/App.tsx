import { Route, Routes } from "react-router";
import HomePage from "./pages/Home";
import Layout from "./Layout";
import AdminPage from "./pages/Admin";
import NotFoundPage from "./pages/NotFound";
import CreatePage from "./pages/Create";
import EditPage from "./pages/Edit";
import AdminLoginPage from "./pages/AdminLogin";
import RequireAdmin from "./components/RequireAdmin";

function App() {
  return (
    <Routes>
      <Route element={<Layout/>}>
        <Route path="/" element={<HomePage/>}/>
        <Route path="/Admin/Login" element={<AdminLoginPage/>}/>
        <Route element={<RequireAdmin/>}>
          <Route path='/Admin' element={<AdminPage/>}/>
          <Route path='/Admin/:IdRifa' element={<EditPage/>}/>
          <Route path='/Admin/Create' element={<CreatePage/>}/>
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}

export default App
