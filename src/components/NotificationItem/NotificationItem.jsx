// NotificationModal.js
import React from "react";
import styles from "./notificationItem.module.css";
import Image from "next/image";

const NotificationModal = ({ notifications }) => {
  return (
    <div className={styles["notification-modal"]}>
        
      <div className={styles["notification-list"]}>
    <div className={styles["notification-header"]}>
        <h2>Notifications</h2>
      </div>
        {notifications.map((notification, index) => (
          <div key={index} className={styles["notification-item"]}>
            <Image
              src={notification.image}
              alt="User"
              width={40}
              height={40}
              className={styles.userImage}
            />
            <p><strong>{notification.name}</strong> {notification.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationModal;


