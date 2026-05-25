

import layoutStyles from "../../components/shared/styles/layoutStyles.module.css";
import tabStyles from "../../components/shared/styles/tabStyles.module.css";

import {
  Outlet,
  NavLink
} from "react-router-dom";

function Reports() {

  return (

    <section className={layoutStyles.mainPanel}>

      <nav className={tabStyles.tabs}>

        <NavLink
          to="/reports"
          end

          className={({ isActive }) =>
            isActive
              ? tabStyles.tabButtonActive
              : tabStyles.tabButton
          }
        >
          Simulation
        </NavLink>

        <NavLink
          to="daml"

          className={({ isActive }) =>
            isActive
              ? tabStyles.tabButtonActive
              : tabStyles.tabButton
          }
        >
          DA/ML
        </NavLink>

      </nav>

      <Outlet />

    </section>
  );
}

export default Reports;