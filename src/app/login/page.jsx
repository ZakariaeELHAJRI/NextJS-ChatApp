import React from 'react';
import Link from 'next/link';
import styles from './login.module.css';

export default function Login() {
  return (
    <div className={styles.container}>
      <div className={styles.login}>
        <div className={styles.login__logo}>
          <img src="/images/chat_logo.png" alt="logo" />
        </div>
        <div className={styles.login__title}>Login</div>
        <div className={styles.login__form}>
          <div className={styles.login__form__input}>
            <input type="text" placeholder="Username" />
          </div>
          <div className={styles.login__form__input}>
            <input type="password" placeholder="Password" />
          </div>
          <div className={styles.login__form__button}>
            <button>Login</button>
          </div>
          <p className={styles.registerLink}>
            Don't have an account?
            <Link href="/register">  Register here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
