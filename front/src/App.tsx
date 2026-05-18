

import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout/MainLayout";
import Dashboard from "./pages/Dashboard/Dashboard";
import Simulation from "./pages/Simulation/Simulation";
import Consumption from "./pages/Simulation/Consumption/Consumption";
import SystemEvents from "./pages/Simulation/SystemEvents/SystemEvents";
import Voltage from "./pages/Simulation/Voltage/Voltage";
import DAML from "./pages/DAML/DAML";
import Metrics from "./pages/DAML/Metrics/Metrics";
import AnomalyDetection from "./pages/DAML/AnomalyDetection/AnomalyDetection";
import ML from "./pages/DAML/ML/ML";
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

           <Route path="/DAML" element={<DAML />}>

            <Route index element={<Metrics />} />
            <Route path="anomaly-detection" element={<AnomalyDetection />} />
            <Route path="ML" element={<ML />} />

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