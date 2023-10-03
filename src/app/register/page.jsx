"use client"
import React, { useState, useEffect } from 'react';
import styles from './register.module.css';
import axios from 'axios';

// Dropdown component
function Dropdown({ options, onSelect, selectedValue }) {
  return (
    <div className={styles.register__form__input}>
      <select value={selectedValue} onChange={(e) => onSelect(e.target.value)}>
        <option>Country</option>
        {options.map((option) => (
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
  // State to store form input values
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    username: '',
    email: '',
    password: '',
    country: '',
    city: '',
  });

  // State to store the list of country names
  const [countryNames, setCountryNames] = useState([]);

  // Fetch country data from the API and extract country names
  useEffect(() => {
    fetch('https://restcountries.com/v3.1/all')
      .then((response) => response.json())
      .then((data) => {
        const names = data.map((country) => country.name.common);
        setCountryNames(names);
      })
      .catch((error) => console.error('Error fetching country data:', error));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form data
    if (!isFormDataValid(formData)) {
      setShowErrorMessage(true);
      return;
    }

    try {
      const response = await axios.post('http://localhost:8000/api/users', formData);
      console.log(response);
      if (response.status === 200) {
        setShowSuccessMessage(true);
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
      } else {
        setShowErrorMessage(true);
      }
    } catch (error) {
      console.error('Register failed:', error);
    }
  };

  // Handle input field changes and update the formData state
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Function to validate form data
  const isFormDataValid = (data) => {
    for (const key in data) {
      if (data[key].trim() === '') {
        return false;
      }
    }
    return true;
  };

  return (
    <div className={styles.container}>
      <div className={styles.register}>
        <div className={styles.register__title}>Register</div>
        <div className={styles.register__form}>
          {showSuccessMessage && (
            <div className={styles.successMessage}>
              Registration successful. Redirecting to login...
            </div>
          )}
          {showErrorMessage && (
            <div className={styles.errorMessage}>
              Registration failed. Please fill in all required fields.
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className={styles.register__form__input}>
              <input
                type="text"
                placeholder="First Name"
                name="firstname"
                value={formData.firstname}
                onChange={handleInputChange}
               
              />
            </div>
            <div className={styles.register__form__input}>
              <input
                type="text"
                placeholder="Last Name"
                name="lastname"
                value={formData.lastname}
                onChange={handleInputChange}
               
              />
            </div>
            <div className={styles.register__form__input}>
              <input
                type="text"
                placeholder="Username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
               
              />
            </div>
            <div className={styles.register__form__input}>
              <input
                type="email"
                placeholder="Email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
               
              />
            </div>
            <div className={styles.register__form__input}>
              <input
                type="password"
                placeholder="Password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
               
              />
            </div>
            <Dropdown
              label="Country"
              options={countryNames}
              onSelect={(country) => setFormData({ ...formData, country })}
              selectedValue={formData.country}
            />
            <div className={styles.register__form__input}>
              <input
                type="text"
                placeholder="City"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
               
              />
            </div>
            <div className={styles.register__form__button}>
              <button>Register</button>
            </div>
          </form>
        </div>
      </div>
    </div >
  );
}

