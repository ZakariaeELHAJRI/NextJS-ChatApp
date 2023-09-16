"use client"// Navbar.js

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./Navbar.module.css";
import NotificationModal from "../NotificationItem/NotificationItem";

export default function Navbar() {
  const userName = "John Doe";
  const userProfilePhoto = "/images/pic.jpg";
  const notification = "/images/icons/notifications.png";
  const lougout = "/images/icons/logout.png";

  // logout function 
  const logout = () => {
    localStorage.removeItem("accessToken");
    window.location.href = "/login";
  };
  const [showModal, setShowModal] = useState(false);
  const invitations = [
    {
      image: "/images/pic.jpg",
      name: "John Doe",
      commonFriends : 5,
      daysAgo : 2
    },
    {
      image: "/images/pic.jpg",
      name: "Jane Smith",
      commonFriends : 9 ,
      daysAgo : 3
    },
    // Add more invitations as needed
  ];
  const notifications = [
    {
      name: "John Doe",
      image: "/images/pic.jpg",
      message: "New message received.",
    },
    {
      name : "John Doe",
      image: "/images/pic.jpg",
      message: "Friend request from Jane.",
    },
    {
      name : "John Doe",
      image: "/images/pic.jpg",
      message: "New message received.",
    },
    {
      name : "John Doe",
      image: "/images/pic.jpg",
      message: "New message received.",
    },
    {
      name  : "John Doe",
      image: "/images/pic.jpg",
      message: "New message received.",
    },
    {
      name : "John Doe",
      image: "/images/pic.jpg",
      message: "New message received.",
    }
  ];
  return (
    <div className={styles.container}>
      <Link href="/" className={styles.logo}>
        CHATAPP
      </Link>
      <div className={styles.search}>
        <input type="text" placeholder="Search" />
      </div>
      <div className={styles.userProfile}>
        <div className={styles.userName}>{userName}</div>
        <div
          className={styles.notification}
          onClick={() => setShowModal(!showModal)}
        >
          <Image src={notification} width={40} height={40} alt="Notification Icon" />
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
        <div className={styles.notification}
         onClick={logout}
        >
          <Image src={lougout} width={40} height={40} alt="Notification Icon" />
        </div>
      </div>
    </div>
  );
}
