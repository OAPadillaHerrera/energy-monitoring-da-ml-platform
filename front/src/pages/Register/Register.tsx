

import styles from "./Register.module.css";
import logo from "../../assets/logos/logo_ENERGON.png";

function Register() {
  return (
    <main className={styles.container}>
      <div className={styles.overlay}></div>

      <section className={styles.logoWrapper}>
        <img
          src={logo}
          alt="Energon Analytics"
          className={styles.logo}
        />
      </section>

      <section className={styles.registerContent}>

        <p className={styles.subtitle}>
          User Registration
        </p>

        <form className={styles.form}>

          <div className={styles.field}>
            <input
              type="text"
              className={styles.input}
            />

            <label className={styles.label}>
              Username
            </label>
          </div>

          <div className={styles.field}>
            <input
              type="email"
              className={`${styles.input} ${styles.emailInput}`}
            />

            <label className={styles.label}>
              Email
            </label>
          </div>

          <div className={styles.field}>
            <input
              type="password"
              className={styles.input}
            />

            <label className={styles.label}>
              Password
            </label>
          </div>

          <div className={styles.field}>
            <input
              type="password"
              className={styles.input}
            />

            <label className={styles.label}>
              Confirm Password
            </label>
          </div>

          <button
            type="submit"
            className={styles.button}
          >
            Register
          </button>

          <a
            href="#"
            className={styles.loginLink}
          >
            Already registered?
          </a>

        </form>

      </section>
    </main>
  );
}

export default Register;