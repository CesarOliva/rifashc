import { Route, Routes } from "react-router";
import HomePage from "./pages/Home";
import Layout from "./Layout";
import AdminPage from "./pages/Admin";
import NotFoundPage from "./pages/NotFound";
import CreatePage from "./pages/Create";
import EditPage from "./pages/Edit";

function App() {
  return (
    <Routes>
      <Route element={<Layout/>}>
        <Route path="/" element={<HomePage/>}/>
        <Route path='/Admin' element={<AdminPage/>}/>
        <Route path='/Admin/:IdRifa' element={<EditPage/>}/>
        <Route path='/Admin/Create' element={<CreatePage/>}/>
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}

export default App