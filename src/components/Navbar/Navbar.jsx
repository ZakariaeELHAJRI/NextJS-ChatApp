"use client"// Navbar.js
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./Navbar.module.css";
import NotificationModal from "../NotificationItem/NotificationItem";
import SearchFriends from "../SearchFriends/SearchFriends";
import { fetchUsers } from "../SearchFriends/data";
import { useWebSocket } from "@/context/WebSocketContext";
import axios from "axios";

export default function Navbar() {
  const [fullName, setFullName] = useState("");
  const userProfilePhoto = "/images/pic.jpg";
  const notification = "/images/icons/notifications.png";
  const logoutIcon = "/images/icons/logout.png";
  const { invitations, acceptances } = useWebSocket();
  const [showModal, setShowModal] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const modalRef = useRef(null);
  const [users, setUsers] = useState([]);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [isNotificationCountVisible, setIsNotificationCountVisible] = useState(
    false
  );
  const [allInvitations, setAllInvitations] = useState([]);
  const [invitationCounts, setInvitationCounts] = useState(0); // Initialize as 0
  const [acceptNotificationCounts, setAcceptNotificationCounts] = useState(0);
  const { id: currentUserId } = JSON.parse(
    localStorage.getItem("currentUser")
  );
  const token = localStorage.getItem("accessToken");
  const [acceptNotification , setAcceptNotification] = useState([])

  const handleNotificationClick = async () => {
    setShowModal(!showModal);
    setIsNotificationModalOpen(!isNotificationModalOpen);

    // Hide the notification count when the notification modal is opened
    if (isNotificationCountVisible) {
      setIsNotificationCountVisible(false);
      setInvitationCounts(0);
      setAcceptNotificationCounts(0);
      await readNotification();
    }
  };
  const logout = () => {
    // Remove the authentication token from localStorage
    localStorage.removeItem("accessToken");

    // Redirect the user to the login page
    window.location.href = "/login";
  };

  const readNotification = async () => {
    // updated is_read to true using axios token and current user id
    try {
      if (invitationCounts > 0) {

      const response = await axios.put(
        `http://localhost:8000/api/mark-invitation-as-read/${currentUserId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Invitations is read :", response.data);
      }
      if (acceptNotificationCounts > 0) {
        const response = await axios.put(
          `http://localhost:8000/api/mark-notification-as-read/${currentUserId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("Notifications is read :", response.data);
      }
    } catch (error) {
      console.error("Error is read invitations:", error);
    }
  };
  const fetchAndSetInvitations = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/friendships/${currentUserId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Invitations from database:", response.data);

      const databaseInvitations = response.data;

      if (databaseInvitations.length > 0) {
        setAllInvitations(databaseInvitations);
        console.log("All invitations:", databaseInvitations);

        // Calculate and set the invitation counts
        const unreadInvitationsCount = databaseInvitations.filter(
          (invitation) => !invitation.is_read
        ).length;
        setInvitationCounts(unreadInvitationsCount);
       if (unreadInvitationsCount > 0) {
          setIsNotificationCountVisible(true);
        }
      }
    } catch (error) {
      console.error("Error fetching invitations:", error);
    }
  };

  useEffect(() => {
    // Fetch user data when the component mounts
    const currentUser = localStorage.getItem("currentUser");
    setFullName(
      `${JSON.parse(currentUser).firstname} ${JSON.parse(currentUser).lastname}`
    );
    const fetchData = async () => {
      const userData = await fetchUsers();
      setUsers(userData);
    };
    fetchData();
    fetchAndSetInvitations();
    if (invitationCounts > 0 || acceptNotificationCounts.length > 0) {
      setIsNotificationCountVisible(true);
    }
  }, []);

  useEffect(() => {
    fetchAndSetInvitations(); // Call the async function inside useEffect
  }, [invitations]);

  useEffect(() => {
    if (invitations.length > 0 || acceptNotificationCounts.length > 0) {
      setIsNotificationCountVisible(true);
    }
    fetchNotifications();
  }, [invitations, acceptances]);

  const fetchNotifications = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/notifications-by-user/${currentUserId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
       if (response.status === 200) {
        const databaseNotifications = response.data ;
        setAcceptNotification(response.data);
        const unreadNotificationsCount = databaseNotifications.filter(
          (notification) => !notification.is_read
        ).length;
        setAcceptNotificationCounts(unreadNotificationsCount);
        if (unreadNotificationsCount > 0) {
          setIsNotificationCountVisible(true);
        }
      }
      console.log("Notifications from database:", response.data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  }
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(e.target) &&
        !e.target.classList.contains("notification") // Check if the click is not on the notification icon
      ) {
        setShowModal(false);
        setShowSearchModal(false);
        setIsNotificationModalOpen(false); // Close the notification modal
      }
    };
  
    const handleDocumentClick = (e) => {
      handleOutsideClick(e);
    };
    if (showModal || showSearchModal) {
      document.addEventListener("mousedown", handleDocumentClick);
    } else {
      document.removeEventListener("mousedown", handleDocumentClick);
    }
  
    return () => {
      document.removeEventListener("mousedown", handleDocumentClick);
    };
  }, [showModal, showSearchModal]);
  

  return (
    <div className={styles.container}>
      <Link href="/" className={styles.logo}>
        CHATAPP
      </Link>
      <div className={styles.search}>
        <input
          type="text"
          placeholder="Search"
          onClick={() => setShowSearchModal(true)}
        />
        {showSearchModal && (
          <div className={styles.searchModal} ref={modalRef}>
            <SearchFriends UsersList={users} />
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
            <div className="notificationModalContainer" ref={modalRef}>
              <NotificationModal
                notifications={acceptNotification}
                invitations={allInvitations}
                onClose={() => setShowModal(false)}
              />
            </div>
          )}
          {isNotificationCountVisible && (
            <div className={styles.notificationCount}>{invitationCounts + acceptNotificationCounts}</div>
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
