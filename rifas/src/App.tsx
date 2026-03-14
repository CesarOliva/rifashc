import { Route, Routes } from "react-router";
import HomePage from "./pages/Home";
import Layout from "./Layout";
import AdminPage from "./pages/Admin";

function App() {
  return (
    <Routes>
      <Route element={<Layout/>}>
        <Route path="/" element={<HomePage/>}/>
        <Route path='/Admin' element={<AdminPage/>}/>
      </Route>
    </Routes>
  )
}

export default App