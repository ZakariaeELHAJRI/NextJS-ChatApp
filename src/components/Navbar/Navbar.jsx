"use client"// Navbar.js
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./Navbar.module.css";
import NotificationModal from "../NotificationItem/NotificationItem";
import SearchFriends from "../SearchFriends/SearchFriends"; 
import {fetchUsers} from "../SearchFriends/data";
import { useWebSocket } from "@/context/WebSocketContext";


export default function Navbar() {
  const userName = "John Doe";
  const userProfilePhoto = "/images/pic.jpg";
  const notification = "/images/icons/notifications.png";
  const logoutIcon = "/images/icons/logout.png";
 const {invitations}= useWebSocket();
  const [showModal, setShowModal] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false); // State for the search modal
  const modalRef = useRef(null);
  const [users, setUsers] = useState([]);
 

  const notifications = [
    {
      name: "John Doe",
      image: "/images/pic.jpg",
      message: "New message received.",
    },
    {
      name: "John Doe",
      image: "/images/pic.jpg",
      message: "Friend request from Jane.",
    },
    // Add more notifications as needed
  ];

  const logout = () => {  
    // Remove the authentication token from localStorage
    localStorage.removeItem("accessToken");

    // Redirect the user to the login page
    window.location.href = "/login";
  }

  useEffect(() => {
    // Fetch user data when the component mounts
    const fetchData = async () => {
      const userData = await fetchUsers();
      console.log(userData);
      setUsers(userData);
    };

    fetchData();
  }, []);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        setShowModal(false);
        setShowSearchModal(false); // Close the search modal as well
      }
    };

    if (showModal) {
      document.addEventListener("mousedown", handleOutsideClick);
    } else {
      document.removeEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [showModal]);

  /* Callback function to handle received invitations
  const handleReceivedInvitation = (invitationData) => {
    // Update the invitations state with the new invitation
    setInvitations((prevInvitations) => [...prevInvitations, invitationData]);
  };*/

  return (
    <div className={styles.container}>
      <Link href="/" className={styles.logo}>
        CHATAPP
      </Link>
      <div className={styles.search}>
        <input
          type="text"
          placeholder="Search"
          onClick={() => setShowSearchModal(true)} // Show the search modal on click
        />
        {showSearchModal && (
          <div className={styles.searchModal} ref={modalRef}>
            {/* Pass the callback function to SearchFriends component */}
            <SearchFriends UsersList={users}  /> 
          </div>
        )}
      </div>
      <div className={styles.userProfile}>
        <div className={styles.userName}>{userName}</div>
        <div
          className={styles.notification}
          onClick={() => setShowModal(!showModal)}
        >
          <Image
            src={notification}
            width={40}
            height={40}
            alt="Notification Icon"
          />
          {showModal && (
            <NotificationModal
              notifications={notifications}
              invitations={invitations}
              onClose={() => setShowModal(false)}
            />
          )}
        </div>
        <div className={styles.profilePhoto}>
          <Image
            src={userProfilePhoto}
            alt="user profile photo"
            width={40}
            height={40}
          />
        </div>
        <div className={styles.notification} onClick={logout}>
          <Image src={logoutIcon} width={40} height={40} alt="Logout Icon" />
        </div>
      </div>
    </div>
  );
}
