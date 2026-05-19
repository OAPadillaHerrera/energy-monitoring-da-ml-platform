

import styles from "./MainLayout.module.css";
import logo from "../../assets/logos/logo_ENERGON.png";

import {
  NavLink,
  Outlet
} from "react-router-dom";

const navItems = [
  {
    to: "/",
    label: "Dashboard"
  },
  {
    to: "/simulation",
    label: "Simulation"
  },
  {
    to: "/daml",
    label: "DA/ML"
  },
  {
    to: "/reports",
    label: "Reports"
  },
  {
    to: "/about",
    label: "About"
  }
];

function MainLayout() {
  return (
    <main className={styles.container}>

      <header className={styles.topbar}>

        <div className={styles.stationBlock}>

          <span className={styles.stationLabel}>
            Station
          </span>

          <h1 className={styles.stationName}>
            Vehicular Fuel Service Station
          </h1>

        </div>

        <div className={styles.systemBlock}>

          <span className={styles.systemTitle}>
            Energy DA/ML Engine
          </span>

          <div className={styles.systemStatus}>

            <span className={styles.statusDot}></span>

            <span className={styles.statusText}>
              System Online
            </span>

          </div>

        </div>

      </header>

      <section className={styles.content}>

        <aside className={styles.sidebar}>

          <div className={styles.sidebarLogo}>

            <img
              src={logo}
              alt="Energon"
              className={styles.logo}
            />

            <div className={styles.brandContainer}>

              <div className={styles.brandMain}>
                ENERGON
              </div>

              <div className={styles.brandSub}>
                ANALYTICS
              </div>

            </div>

          </div>

          <nav className={styles.nav}>

            {navItems.map((item) => (

              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  isActive
                    ? styles.navButtonActive
                    : styles.navButton
                }
              >
                {item.label}
              </NavLink>

            ))}

          </nav>

        </aside>

        <section className={styles.pageContent}>
          <Outlet />
        </section>

      </section>

    </main>
  );
}

export default MainLayout;