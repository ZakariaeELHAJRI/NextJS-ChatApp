import React, { useState } from 'react';

export default function UserProfile({ user }) {
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [editedUser, setEditedUser] = useState({ ...user });

  const toggleDrawer = () => {
    setDrawerOpen(!isDrawerOpen);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser({ ...editedUser, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent form submission

    // Here you can send 'editedUser' to the server to update the user's information
    // You can use a fetch or Axios request to do this.

    // For demonstration, we'll just log the edited user here.
    console.log('Updated User:', editedUser);
  };

  return (
    <div>
      <div className="profile-photo" onClick={toggleDrawer}>
        <img
          src={user.profile_photo_path}
          alt="user profile photo"
          width={40}
          height={40}
        />
      </div>
      {isDrawerOpen && (
        <div className="drawer">
          <img
            src={editedUser.profile_photo_path}
            alt="user profile photo"
            width={100}
            height={100}
          />
          <form onSubmit={handleSubmit}>
            <div className="register__form__input">
              <input
                type="text"
                placeholder="First Name"
                name="firstname"
                value={editedUser.firstname}
                onChange={handleInputChange}
              />
            </div>
            <div className="register__form__input">
              <input
                type="text"
                placeholder="Last Name"
                name="lastname"
                value={editedUser.lastname}
                onChange={handleInputChange}
              />
            </div>
            <div className="register__form__input">
              <input
                type="text"
                placeholder="Username"
                name="username"
                value={editedUser.username}
                onChange={handleInputChange}
              />
            </div>
            <div className="register__form__input">
              <input
                type="email"
                placeholder="Email"
                name="email"
                value={editedUser.email}
                onChange={handleInputChange}
              />
            </div>
            <div className="register__form__input">
              <input
                type="password"
                placeholder="Password"
                name="password"
                value={editedUser.password}
                onChange={handleInputChange}
              />
            </div>
            {/* You should define the Dropdown component and import it here */}
            {/* <Dropdown
              label="Country"
              options={countryNames}
              onSelect={(country) => setEditedUser({ ...editedUser, country })}
              selectedValue={editedUser.country}
            /> */}
            <div className="register__form__input">
              <input
                type="text"
                placeholder="City"
                name="city"
                value={editedUser.city}
                onChange={handleInputChange}
              />
            </div>
            <div className="register__form__button">
              <button type="submit">Update Profile</button>
            </div>
          </form>
        </div>
      )}
      
    </div>
  );

}


