

import layoutStyles from "../../components/shared/styles/layoutStyles.module.css";
import tabStyles from "../../components/shared/styles/tabStyles.module.css";
import { Outlet, NavLink } from "react-router-dom";

import {
  Activity,
  Gauge,
  Zap,
} from "lucide-react";

function Simulation() {
  return (
    <section className={layoutStyles.mainPanel}>

      <nav className={tabStyles.tabs}>

        <NavLink
          to="/simulation"
          end
          className={({ isActive }) =>
            isActive
              ? tabStyles.simulationTabButtonActive
              : tabStyles.simulationTabButton
          }
        >
          <Zap className={tabStyles.simulationTabIcon} />
          Consumption
        </NavLink>

        <NavLink
          to="system-events"
          className={({ isActive }) =>
            isActive
              ? tabStyles.simulationTabButtonActive
              : tabStyles.simulationTabButton
          }
        >
          <Activity className={tabStyles.simulationTabIcon} />
          System Events
        </NavLink>

        <NavLink
          to="voltage"
          className={({ isActive }) =>
            isActive
              ? tabStyles.simulationTabButtonActive
              : tabStyles.simulationTabButton
          }
        >
          <Gauge className={tabStyles.simulationTabIcon} />
          Voltage
        </NavLink>

      </nav>

      <Outlet />

    </section>
  );
}

export default Simulation;