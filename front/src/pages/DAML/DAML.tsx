

import styles from "./DAML.module.css";
import tabStyles from "../../components/shared/styles/tabStyles.module.css";
import { Outlet, NavLink } from "react-router-dom";

function Daml() {
  return (
    <section className={styles.mainPanel}>

      <nav className={tabStyles.tabs}>

        <NavLink
          to="/daml"
          end
          className={({ isActive }) =>
            isActive
              ? tabStyles.tabButtonActive
              : tabStyles.tabButton
          }
        >
          Metrics
        </NavLink>

        <NavLink
          to="anomaly-detection"
          className={({ isActive }) =>
            isActive
              ? tabStyles.tabButtonActive
              : tabStyles.tabButton
          }
        >
          Anomaly
        </NavLink>

        <NavLink
          to="ml"
          className={({ isActive }) =>
            isActive
              ? tabStyles.tabButtonActive
              : tabStyles.tabButton
          }
        >
          ML
        </NavLink>

      </nav>

      <Outlet />

    </section>
  );
}

export default Daml;