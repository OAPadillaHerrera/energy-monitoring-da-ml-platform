

import styles from "./Login.module.css";
import logo from "../../assets/logos/logo_ENERGON_gif.gif";

function Login() {
  return (
    <main className={styles.container}>
      <div className={styles.overlay}></div>

      <section className={styles.logoCard}>
        <img
          src={logo}
          alt="Energon Analytics"
          className={styles.logo}
        />
      </section>

      <section className={styles.loginCard}>

        <p className={styles.subtitle}>
          SYSTEM ACCESS
        </p>

        <form className={styles.form}>

          <div className={styles.field}>
            <input type="text" className={styles.input} />
            <label className={styles.label}>Username</label>
          </div>

          <div className={styles.field}>
            <input type="password" className={styles.input} />
            <label className={styles.label}>Password</label>
          </div>

          <button type="submit" className={styles.button}>
            Login
          </button>

          <a href="#" className={styles.forgot}>
            Forgot password?
          </a>

        </form>

      </section>
    </main>
  );
}

export default Login;