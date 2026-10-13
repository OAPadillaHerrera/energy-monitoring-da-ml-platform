

import layoutStyles from "../../components/shared/styles/layoutStyles.module.css";
import tabStyles from "../../components/shared/styles/tabStyles.module.css";

import {
  Outlet,
  NavLink
} from "react-router-dom";

import {
  Activity,
  BarChart3
} from "lucide-react";

function Reports() {
  return (
    <section className={layoutStyles.mainPanel}>

      <nav className={tabStyles.tabs}>

        <NavLink
          to="/reports"
          end
          className={({ isActive }) =>
            isActive
              ? tabStyles.reportsTabButtonActive
              : tabStyles.reportsTabButton
          }
        >
          <Activity className={tabStyles.reportsTabIcon} />
          Simulation
        </NavLink>

        <NavLink
          to="daml"
          className={({ isActive }) =>
            isActive
              ? tabStyles.reportsTabButtonActive
              : tabStyles.reportsTabButton
          }
        >
          <BarChart3 className={tabStyles.reportsTabIcon} />
          DA/ML
        </NavLink>

      </nav>

      <Outlet />

    </section>
  );
}

export default Reports;