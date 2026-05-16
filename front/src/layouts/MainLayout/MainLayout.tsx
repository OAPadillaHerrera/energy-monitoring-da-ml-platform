

import styles from "./MainLayout.module.css";
import logo from "../../assets/logos/logo_ENERGON.png";
import { NavLink, Outlet } from "react-router-dom";

function MainLayout() {
  return (
    <main className={styles.container}>

      <header className={styles.topbar}>

        <div className={styles.stationBlock}>
          <span className={styles.stationLabel}>Station</span>

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
              <div className={styles.brandMain}>ENERGON</div>
              <div className={styles.brandSub}>ANALYTICS</div>
            </div>

          </div>

          <nav className={styles.nav}>

            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? styles.navButtonActive : styles.navButton
              }
          
            >
              Dashboard
            </NavLink>

            <NavLink
              to="/simulation"
              className={({ isActive }) =>
                isActive ? styles.navButtonActive : styles.navButton
              }
            >
              Simulation
            </NavLink>

            <NavLink
              to="/daml"
              className={({ isActive }) =>
                isActive ? styles.navButtonActive : styles.navButton
              }
            >
              DA/ML
            </NavLink>

            <NavLink
              to="/reports"
              className={({ isActive }) =>
                isActive ? styles.navButtonActive : styles.navButton
              }
            >
              Reports
            </NavLink>

            <NavLink
              to="/about"
              className={({ isActive }) =>
                isActive ? styles.navButtonActive : styles.navButton
              }
            >
              About
            </NavLink>

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