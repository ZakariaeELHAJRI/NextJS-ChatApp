"use client"
import React, { useEffect, useState } from "react";
import styles from "./notificationItem.module.css";
import Image from "next/image";
import axios from "axios";
import { sendAcceptance } from "@/app/Utils/websocket";
import { handleSendMsg } from "./data";

const NotificationItem = ({ invitation , onAccept , onSend }) => {
  console.log("invitation passed ",invitation)
  const handleAccept = () => {
    console.log("Accept invitation:", invitation);
    onAccept(invitation.id);
  };

  const handleSendMessage = () => {
    console.log("Send message to:", invitation);
    onSend(invitation.user_id , invitation.friend_id);
  }

  return (
    <div className={styles["invitation"]}>
      <div className={styles["invitation-item"]}>
        <Image
          src="/images/pic.jpg"
          alt="User"
          width={40}
          height={40}
          className={styles.userImage}
        />
        <div className={styles.invitationContent}>
          <p><strong>{invitation.friend_first_name} {invitation.friend_last_name}</strong></p>
          <div className={styles.commonFriends}>
            <Image
              src="/images/pic.jpg"
              alt="Common Friends"
              width={20}
              height={20}
              className={styles.commonImage}
            />
            <span>{invitation.commonFriends} friends in common</span>
          </div>
        </div>
        <p className={styles.daysAgo}>{invitation.daysAgo} days ago</p>
      </div>
      <div className={styles["invitation-buttons"]}>
      {invitation.status === "pending" && (
          <>
            <button className={styles.acceptButton} onClick={handleAccept}>
              Accept
            </button>
            <button className={styles.refuseButton}>Refuse</button>
          </>
        )}
        {invitation.status === "accepted" && (
          <button className={styles.sendMessageButton} onClick={handleSendMessage}>
            Send Message</button>
        )}
      </div>
    </div>
  );
};

const NotificationModal = ({ notifications, invitations, onClose }) => {
  const [activeTab, setActiveTab] = useState("notifications");

  const [allInvitations, setAllInvitations] = useState([]);

useEffect(() => {
  setAllInvitations(invitations);
}, [invitations]);
  // Function to handle accepting an invitation
  const handleAcceptInvitation = async (invitationId) => {
    try {
      const token = localStorage.getItem("accessToken");
      // Make an HTTP POST request to your server's API endpoint to update the invitation status
      const response = await axios.put(
        `http://localhost:8000/api/friendships/${invitationId}`,
        {
          status: "accepted", // Update the status to "accepted"
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Check the response to ensure the update was successful
      if (response.status === 200) {
        console.log("Invitation accepted successfully");
        console.log("data acceptance "+response.data)
        sendAcceptance(response.data)
        // Update the local state to reflect the accepted invitation
        const updatedInvitations = invitations.map((invitation) => {
          if (invitation.id === invitationId) {
            return { ...invitation, status: "accepted" };
          }
          return invitation;
        });
        console.log("updatedInvitations "+JSON.stringify(updatedInvitations)  )
        setAllInvitations(updatedInvitations);
      } else {
        console.error("Error updating invitation status:", response.data);
      }
    } catch (error) {
      console.error("Error updating invitation status:", error);
    }
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className={styles["notification-modal"]} onClick={onClose}>
      <div className={`${styles["notification-list"]}  ${styles["customScroll"]}`} onClick={(e) => e.stopPropagation()}>
        <div className={styles["notification-header"]}>
          <h2>Notifications</h2>
          <div className={styles["tab-buttons"]}>
            <button
              className={activeTab === "notifications" ? styles.activeTab : ""}
              onClick={() => handleTabClick("notifications")}
            >
              Notifications
            </button>
            <button
              className={activeTab === "invitations" ? styles.activeTab : ""}
              onClick={() => handleTabClick("invitations")}
            >
              Invitations
            </button>
          </div>
        </div>
        {activeTab === "notifications" ? (
          <div>
            {notifications.map((notification, index) => (
              <div key={index} className={styles["notification-item"]}>
                <Image
                  src='/images/pic.jpg'
                  alt="User"
                  width={40}
                  height={40}
                  className={styles.userImage}
                />
                <p>
                  <strong>{notification.first_name_sender} {notification.last_name_sender}</strong> {notification.message}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div>
            {allInvitations.map((invitation, index) => (
              <NotificationItem key={index} invitation={invitation}  onAccept={handleAcceptInvitation} onSend={handleSendMsg} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationModal;
