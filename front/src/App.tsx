

import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout/MainLayout";
import Dashboard from "./pages/Dashboard/Dashboard";
import Simulation from "./pages/Simulation/Simulation";
import DAML from "./pages/DAML/DAML";
import Reports from "./pages/Reports/Reports";
import About from "./pages/About/About";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route element={<MainLayout />}>
          
          <Route path="/" element={<Dashboard />} />
          <Route path="/simulation" element={<Simulation />} />
          <Route path="/DAML" element={< DAML/>} />
          <Route path="/Reports" element={< Reports/>} />
          <Route path="/About" element={< About/>} />

        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;