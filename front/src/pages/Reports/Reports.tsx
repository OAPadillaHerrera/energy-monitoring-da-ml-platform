

import layoutStyles from "../../components/shared/styles/layoutStyles.module.css";
import tabStyles from "../../components/shared/styles/tabStyles.module.css";

import {
  Outlet,
  NavLink
} from "react-router-dom";

import {
  FlaskConical,
  BrainCircuit
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
          <FlaskConical className={tabStyles.reportsTabIcon} />
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
          <BrainCircuit className={tabStyles.reportsTabIcon} />
          DA/ML
        </NavLink>

      </nav>

      <Outlet />

    </section>
  );
}

export default Reports;