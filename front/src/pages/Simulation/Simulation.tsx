

import { NavLink, Outlet } from "react-router-dom";

import {
  Activity,
  Gauge,
  Zap
} from "lucide-react";

import layoutStyles from "../../components/shared/styles/layoutStyles.module.css";
import tabStyles from "../../components/shared/styles/tabStyles.module.css";

const simulationTabs = [
  {
    to: "/simulation",
    label: "Consumption",
    icon: Zap,
    end: true
  },
  {
    to: "system-events",
    label: "System Events",
    icon: Activity
  },
  {
    to: "voltage",
    label: "Voltage",
    icon: Gauge
  }
];

function Simulation() {
  return (
    <section className={layoutStyles.mainPanel}>
      <nav className={tabStyles.tabs}>
        {simulationTabs.map((tab) => {
          const Icon = tab.icon;

          return (
            <NavLink
              key={tab.to}
              to={tab.to}
              end={tab.end}
              className={({ isActive }) =>
                isActive
                  ? tabStyles.simulationTabButtonActive
                  : tabStyles.simulationTabButton
              }
            >
              <Icon className={tabStyles.simulationTabIcon} />
              {tab.label}
            </NavLink>
          );
        })}
      </nav>

      <Outlet />
    </section>
  );
}

export default Simulation;