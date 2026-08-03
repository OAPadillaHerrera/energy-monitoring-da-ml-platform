

import layoutStyles from "../../components/shared/styles/layoutStyles.module.css";
import panelStyles from "../../components/shared/styles/panelStyles.module.css";
import tabStyles from "../../components/shared/styles/tabStyles.module.css";
import chipStyles from "../../components/shared/styles/chipStyles.module.css";
import aboutStyles from "../../components/shared/styles/aboutStyles.module.css";

function About() {

  return (

    <section className={layoutStyles.mainPanel}>

      <section className={panelStyles.chartPanel}>

        <div className={aboutStyles.aboutContent}>

          <div className={tabStyles.tabs}>

            <span className={chipStyles.chipPrimary}>
              About Energon Analytics
            </span>

          </div>

          <section>

            <h2>Platform Overview</h2>

            <ul>
              <li>Brief Introduction</li>
              <li>Purpose</li>
              <li>Objectives</li>
            </ul>

          </section>

          <section>

            <h2>Platform Modules</h2>

            <ul>
              <li>Dashboard</li>
              <li>Simulation</li>
              <li>Data Analytics / Machine Learning</li>
              <li>Reports</li>
              <li>About</li>
            </ul>

          </section>

          <section>

            <h2>System Architecture</h2>

            <ul>
              <li>Frontend</li>
              <li>Backend</li>
              <li>Database</li>
            </ul>

          </section>

          <section>

            <h2>Technology Stack</h2>

            <ul>
              <li>Frontend Technologies</li>
              <li>Backend Technologies</li>
              <li>Database</li>
              <li>Data Analytics & Machine Learning Libraries</li>
              <li>Reporting Libraries</li>
            </ul>

          </section>

          <section>

            <h2>Data Analytics / Machine Learning</h2>

            <h3>Metrics</h3>

            <ul>
              <li>Basic Metrics</li>
              <li>Station Metrics</li>
              <li>System Metrics</li>
              <li>Energy Metrics</li>
            </ul>

            <h3>Anomaly</h3>

            <ul>
              <li>Z-Score Analysis</li>
              <li>Anomaly Detection</li>
              <li>Classification</li>
            </ul>

            <h3>Machine Learning</h3>

            <ul>
              <li>Root Cause Analysis</li>
            </ul>

          </section>

          <section>

            <h2>Reporting System</h2>

            <h3>Simulation Reports</h3>

            <ul>
              <li>Hourly Consumption</li>
              <li>Event Consumption</li>
              <li>Daily Energy Totals</li>
              <li>Voltage Records</li>
            </ul>

            <h3>Data Analytics / Machine Learning Reports</h3>

            <ul>
              <li>Metrics Reports</li>
              <li>Anomaly Reports</li>
              <li>Machine Learning Reports</li>
            </ul>

            <h3>Export Formats</h3>

            <ul>
              <li>CSV</li>
              <li>PDF</li>
            </ul>

          </section>

          <section>

            <h2>Academic Context</h2>

            <ul>
              <li>Project Motivation</li>
              <li>Learning Objectives</li>
              <li>Engineering Concepts</li>
              <li>Future Improvements</li>
            </ul>

          </section>

          <section>

            <h2>Developer</h2>

            <ul>
              <li>Author</li>
              <li>Professional Background</li>
              <li>Technical Skills</li>
            </ul>

          </section>

        </div>

      </section>

    </section>

  );

}

export default About;