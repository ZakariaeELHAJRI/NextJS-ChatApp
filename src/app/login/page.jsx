"use client"
import React, { useState } from 'react';
import Link from 'next/link';
import styles from './login.module.css';
import axios from 'axios';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'http://localhost:8000/token',
        {
          username,
          password,
        }
      );
      const accessToken = response.data.access_token;
      localStorage.setItem('accessToken', accessToken);
      console.log(accessToken);
      window.location.href = '/';
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.login}>
        <div className={styles.login__logo}>
          <img src="/images/chat_logo.png" alt="logo" />
        </div>
        <div className={styles.login__title}>Login</div>
        <div className={styles.login__form}>
          <form onSubmit={handleSubmit}>
            <div className={styles.login__form__input}>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className={styles.login__form__input}>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className={styles.login__form__button}>
              <button type="submit">Login</button>
            </div>
          </form>
          <p className={styles.registerLink}>
            Don't have an account?
            <Link href="/register"> Register here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
