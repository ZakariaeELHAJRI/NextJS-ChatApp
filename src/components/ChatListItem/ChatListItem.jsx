import React from 'react';
import Image from "next/image";
import styles from "./chatListItem.module.css";

const ChatListItem = ({ name, message, time, profilePhoto , onClick }) => {
  return (
    <div className={styles.container} onClick={onClick}>
    <div className={styles["chat-list-item"]}>
      <div className={styles["user-avatar"]}>
        <Image src={profilePhoto} alt={`${name}'s avatar`} width={40} height={40} />
      </div>
      <div className={styles["chat-details"]}>
        <div className={styles["user-name"]}>{name}</div>
        <div className={styles["last-message"]}>{message}</div>
      </div>
      <div className={styles["time"]}>{time}</div>
    </div>
    </div>
  );
}

export default ChatListItem;
