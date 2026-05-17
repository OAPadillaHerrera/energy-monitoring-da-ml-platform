

import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout/MainLayout";
import Dashboard from "./pages/Dashboard/Dashboard";
import Simulation from "./pages/Simulation/Simulation";
import Consumption from "./pages/Simulation/Consumption/Consumption";
import SystemEvents from "./pages/Simulation/SystemEvents/SystemEvents";
import Voltage from "./pages/Simulation/Voltage/Voltage";
import DAML from "./pages/DAML/DAML";
import Reports from "./pages/Reports/Reports";
import About from "./pages/About/About";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route element={<MainLayout />}>

          <Route path="/" element={<Dashboard />} />

          <Route path="/simulation" element={<Simulation />}>

            <Route index element={<Consumption />} />
            <Route path="system-events" element={<SystemEvents />} />
            <Route path="voltage" element={<Voltage />} />

          </Route>

          <Route path="/daml" element={<DAML />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/about" element={<About />} />

        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;