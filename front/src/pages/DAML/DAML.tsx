

import layoutStyles from "../../components/shared/styles/layoutStyles.module.css";
import tabStyles from "../../components/shared/styles/tabStyles.module.css";
import { Outlet, NavLink } from "react-router-dom";
import { BarChart3, Activity, BrainCircuit } from "lucide-react";

function Daml() {
  return (
    <section className={layoutStyles.mainPanel}>

      <nav className={tabStyles.tabs}>

        <NavLink
          to="/daml"
          end
          className={({ isActive }) =>
            isActive
              ? tabStyles.damlTabButtonActive
              : tabStyles.damlTabButton
          }
        >
          <BarChart3 className={tabStyles.damlTabIcon} />
          Metrics
        </NavLink>

        <NavLink
          to="anomaly-detection"
          className={({ isActive }) =>
            isActive
              ? tabStyles.damlTabButtonActive
              : tabStyles.damlTabButton
          }
        >
          <Activity className={tabStyles.damlTabIcon} />
          Anomaly
        </NavLink>

        <NavLink
          to="ml"
          className={({ isActive }) =>
            isActive
              ? tabStyles.damlTabButtonActive
              : tabStyles.damlTabButton
          }
        >
          <BrainCircuit className={tabStyles.damlTabIcon} />
          ML
        </NavLink>

      </nav>

      <Outlet />

    </section>
  );
}

export default Daml;




