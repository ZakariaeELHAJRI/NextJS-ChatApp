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
  const [fullName, setFullName] = useState("");
  const userProfilePhoto = "/images/pic.jpg";
  const notification = "/images/icons/notifications.png";
  const logoutIcon = "/images/icons/logout.png";
 const {invitations}= useWebSocket();
  const [showModal, setShowModal] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false); // State for the search modal
  const modalRef = useRef(null);
  const [users, setUsers] = useState([]);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [isNotificationCountVisible, setIsNotificationCountVisible] = useState(false);

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
    {
      name: "John Doe",
      image: "/images/pic.jpg",
      message: "Friend request from Jane.",
    },
    {
      name: "John Doe",
      image: "/images/pic.jpg",
      message: "Friend request from Jane.",
    }
    
    // Add more notifications as needed
  ];
  const handleNotificationClick = () => {
    setShowModal(!showModal);
    setIsNotificationModalOpen(!isNotificationModalOpen);

    // Hide the notification count when the notification modal is opened
    if (isNotificationCountVisible) {
      setIsNotificationCountVisible(false);
    }
  };
  const logout = () => {  
    // Remove the authentication token from localStorage
    localStorage.removeItem("accessToken");

    // Redirect the user to the login page
    window.location.href = "/login";
  }

  useEffect(() => {
    // Fetch user data when the component mounts
    const currentUser = localStorage.getItem("currentUser");
    setFullName(JSON.parse(currentUser).firstname + " " + JSON.parse(currentUser).lastname);
    const fetchData = async () => {
      const userData = await fetchUsers();
      console.log(userData);
      setUsers(userData);
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (invitations.length > 0) {
      setIsNotificationCountVisible(true);
    }
  }, [invitations]);

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
        <div className={styles.userName}>{fullName}</div>
        <div
          className={styles.notification}
          onClick={() => handleNotificationClick()}
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
            {isNotificationCountVisible && (
            <div className={styles.notificationCount}>{invitations.length}</div>
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
