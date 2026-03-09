import { Route, Routes } from "react-router";
import HomePage from "./pages/Home";
import Layout from "./Layout";

function App() {
  return (
    <Routes>
      <Route element={<Layout/>}>
        <Route path="/" element={<HomePage/>}/>
      </Route>
    </Routes>
  )
}

export default App