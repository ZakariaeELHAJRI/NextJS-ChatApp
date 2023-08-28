"use client"
// NotificationModal.js
import React, { useState } from "react";
import styles from "./notificationItem.module.css";
import Image from "next/image";

const NotificationModal = ({ notifications, invitations, onClose }) => {
  const [activeTab, setActiveTab] = useState("invitations");

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className={styles["notification-modal"]} onClick={onClose}>
      <div className={styles["notification-list"]} onClick={(e) => e.stopPropagation()}>
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
                  src={notification.image}
                  alt="User"
                  width={40}
                  height={40}
                  className={styles.userImage}
                />
                <p>
                  <strong>{notification.name}</strong> {notification.message}
                </p>
              </div>
            ))}
          </div>
        ) : (
            <div>
            {invitations.map((invitation, index) => (
                <div key={index} className={styles["invitation"]}>
                <div className={styles["invitation-item"]}>
                    <Image
                    src={invitation.image}
                    alt="User"
                    width={40}
                    height={40}
                    className={styles.userImage}
                    />
                    <div className={styles.invitationContent}>

                    <p> <strong>{invitation.name}</strong> </p>
                  
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
                    <p className={styles.daysAgo}> {invitation.daysAgo} days ago </p>
                </div>
                <div className={styles["invitation-buttons"]}>
                    <button className={styles.acceptButton}>Accept</button>
                    <button className={styles.refuseButton}>Refuse</button>
                </div>
                </div>
            ))}
            </div>
        )}
      </div>
    </div>
  );
};

export default NotificationModal;
