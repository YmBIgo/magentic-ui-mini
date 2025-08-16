import { Route, Routes } from "react-router"
import InitChat from "./pages/InitChat"
import Main from "./pages/Main"

function App() {
  return (
    <Routes>
      <Route path="/init" element={<InitChat/>} />
      <Route path="/main" element={<Main/>} />
    </Routes>
  )
}

export default App
