

import styles from "./Simulation.module.css";
import { Outlet, NavLink } from "react-router-dom";

function Simulation() {
  return (
    <section className={styles.mainPanel}>

      <div className={styles.tabs}>

        <NavLink
          to="/simulation"
          end
          className={({ isActive }) =>
            isActive ? styles.tabButtonActive : styles.tabButton
          }
        >
          Consumption
        </NavLink>

        <NavLink
          to="system-events"
          className={({ isActive }) =>
            isActive ? styles.tabButtonActive : styles.tabButton
          }
        >
          System Events
        </NavLink>

        <NavLink
          to="voltage"
          className={({ isActive }) =>
            isActive ? styles.tabButtonActive : styles.tabButton
          }
        >
          Voltage
        </NavLink>

      </div>

      <Outlet />

    </section>
  );
}

export default Simulation;