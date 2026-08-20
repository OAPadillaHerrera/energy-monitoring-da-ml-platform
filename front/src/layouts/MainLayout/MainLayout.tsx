

import styles from "./MainLayout.module.css";
import logo from "../../assets/logos/logo_ENERGON.png";

import {
  NavLink,
  Outlet
} from "react-router-dom";

import {
  LayoutDashboard,
  FlaskConical,
  BrainCircuit,
  FileChartColumn,
  CircleHelp
} from "lucide-react";

const navItems = [

  {
    to: "/",
    label: "Dashboard",
    icon: LayoutDashboard,
    color: "#FACC15" 
  },

  {
    to: "/simulation",
    label: "Simulation",
    icon: FlaskConical,
    color: "#FB923C" 
  },

  {
    to: "/daml",
    label: "DA/ML",
    icon: BrainCircuit,
    color: "#A78BFA" 
  },

  {
    to: "/reports",
    label: "Reports",
    icon: FileChartColumn,
    color: "#4ADE80" 
  },

  {
    to: "/about",
    label: "About",
    icon: CircleHelp,
    color: "#CBD5E1" 
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
                Energon
              </div>

              <div className={styles.brandSub}>
                DA/ML Platform
              </div>

            </div>

          </div>

          <div className={styles.navSection}>

            <nav className={styles.nav}>

              {

                navItems.map((item) => {

                  const Icon = item.icon;

                  return (

                    <NavLink
                      key={item.to}
                      to={item.to}
                      className={({ isActive }) =>
                        isActive
                          ? styles.navButtonActive
                          : styles.navButton
                      }
                    >

                      <Icon
                        size={18}
                        strokeWidth={2}
                        className={styles.navIcon}
                        color={item.color}
                      />

                      <span>
                        {item.label}
                      </span>

                    </NavLink>

                  );

                })

              }

            </nav>

          </div>

          <div className={styles.sidebarFooter}>

            <div className={styles.productName}>
              Energon DA/ML Platform
            </div>

            <div className={styles.version}>
              2027 Edition
            </div>

          </div>

        </aside>

        <section className={styles.pageContent}>

          <Outlet />

        </section>

      </section>

    </main>

  );

}

export default MainLayout;
