

import layoutStyles from "../../components/shared/styles/layoutStyles.module.css";
import tabStyles from "../../components/shared/styles/tabStyles.module.css";
import { Outlet, NavLink } from "react-router-dom";

function Simulation() {
  return (
    <section className={layoutStyles.mainPanel}>

      <nav className={tabStyles.tabs}>

        <NavLink
          to="/simulation"
          end
          className={({ isActive }) =>
            isActive
              ? tabStyles.tabButtonActive
              : tabStyles.tabButton
          }
        >
          Consumption
        </NavLink>

        <NavLink
          to="system-events"
          className={({ isActive }) =>
            isActive
              ? tabStyles.tabButtonActive
              : tabStyles.tabButton
          }
        >
          System Events
        </NavLink>

        <NavLink
          to="voltage"
          className={({ isActive }) =>
            isActive
              ? tabStyles.tabButtonActive
              : tabStyles.tabButton
          }
        >
          Voltage
        </NavLink>

      </nav>

      <Outlet />

    </section>
  );
}

export default Simulation;