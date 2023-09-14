"use client"
import React, { useState, useEffect } from 'react';
import styles from './register.module.css';

// Dropdown component
function Dropdown({options, onSelect, selectedValue }) {
  return (
    <div className={styles.register__form__input}>
      <select value={selectedValue} onChange={e => onSelect(e.target.value)}>
        <option >Country</option>
        {options.map(option => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

// Register component
export default function Register() {
  // State to store selected country and city
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedCity, setSelectedCity] = useState('');

  // State to store the list of country names
  const [countryNames, setCountryNames] = useState([]);

  // Fetch country data from the API and extract country names
  useEffect(() => {
    fetch('https://restcountries.com/v3.1/all')
      .then(response => response.json())
      .then(data => {
        const names = data.map(country => country.name.common);
        setCountryNames(names);
      })
      .catch(error => console.error('Error fetching country data:', error));
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.register}>
        <div className={styles.register__title}>Register</div>
        <div className={styles.register__form}>
          <div className={styles.register__form__input}>
            <input type="text" placeholder="First Name" />
          </div>
          <div className={styles.register__form__input}>
            <input type="text" placeholder="Last Name" />
          </div>
          <div className={styles.register__form__input}>
            <input type="text" placeholder="Username" />
          </div>
          <div className={styles.register__form__input}>
            <input type="email" placeholder="Email" />
          </div>
          <div className={styles.register__form__input}>
            <input type="password" placeholder="Password" />
          </div>
          <Dropdown
            label="Country"
            options={countryNames}
            onSelect={country => setSelectedCountry(country)}
            selectedValue={selectedCountry}
          />
          <div className={styles.register__form__input}>
            <input type="text" placeholder="City" />
          </div>
          <div className={styles.register__form__button}>
            <button>Register</button>
          </div>
        </div>
      </div>
    </div>
  );
}
