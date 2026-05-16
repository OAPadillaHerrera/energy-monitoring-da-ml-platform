

/*import Login from "./pages/Login/Login";

function App() {
  return <Login />;
}

export default App;*/

/*import Register from "./pages/Register/Register";

function App() {
  return <Register />;
}

export default App;*/

/*import Register from "./pages/Dashboard/Dashboard";

function App() {
  return <Register />;
}

export default App;*/

/*import Simulation from "./pages/Simulation/Simulation";

function App() {
  return <Simulation />;
}

export default App;*/

/*import DAML from "./pages/DAML/DAML";

function App() {
  return <DAML />;
}

export default App;*/

/*import Reports from "./pages/Reports/Reports";

function App() {
  return <Reports />;
}

export default App;*/

/*import About from "./pages/About/About";

function App() {
  return <About />;
}

export default App;*/

/*import SystemEvents from "./pages/Simulation/SystemEvents/SystemEvents";

function App() {
  return <SystemEvents />;
}

export default App;*/

/*import Voltage from "./pages/Simulation/Voltage/Voltage";

function App() {
  return <Voltage />;
}

export default App;*/

/*import AnomalyDetetection from "./pages/DAML/AnomalyDetection/AnomalyDetection";

function App() {
  return <AnomalyDetetection />;
}

export default App;*/

/*import ML from "./pages/DAML/ML/ML";

function App() {
  return <ML />;
}

export default App;*/

/*import DAML from "./pages/Reports/DAML/DAML";

function App() {
  return <DAML />;
}

export default App;*/

/*import DailySimulation from "./pages/Simulation/DailySimulation/DailySimulation";

function App() {
  return <DailySimulation />;
}

export default App;*/

/*import Station from "./pages/DAML/Station/Station";

function App() {
  return <Station />;
}

export default App;*/

/*import Energy from "./pages/DAML/Energy/Energy";

function App() {
  return <Energy />;
}

export default App;*/

/*import Detection from "./pages/DAML/Detection/Detection";

function App() {
  return <Detection />;
}

export default App;*/

/*import Classification from "./pages/DAML/Classification/Classification";

function App() {
  return <Classification />;
}

export default App;*/

/*import EventRecords from "./pages/Reports/EventRecords/EventRecords";

function App() {
  return <EventRecords />;
}

export default App;*/

/*import DailyTotals from "./pages/Reports/DailyTotals/DailyTotals";

function App() {
  return <DailyTotals />;
}

export default App;*/

/*import VoltageRecords from "./pages/Reports/VoltageRecords/VoltageRecords";

function App() {
  return <VoltageRecords />;
}

export default App;*/

/*import Anomaly from "./pages/Reports/Anomaly/Anomaly";

function App() {
  return <Anomaly />;
}

export default App;*/

/*import MainLayout from "./layouts/MainLayout/MainLayout";

function App() {
  return <MainLayout />;
}

export default App;*/

import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout/MainLayout";
import Dashboard from "./pages/Dashboard/Dashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route element={<MainLayout />}>
          <Route path="/" element={<Dashboard />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;