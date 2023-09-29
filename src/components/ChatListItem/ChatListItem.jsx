import React from 'react';
import Image from "next/image";
import styles from "./chatListItem.module.css";

const ChatListItem = ({ name, message, time, profilePhoto, onClick, messageCount,friend_id  }) => {
  const currentUserString = localStorage.getItem('currentUser');
  const currentUser = JSON.parse(currentUserString);
  console.log("friend_id",friend_id + "current_user",currentUser.id)
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
        <div className="chat-right">
          <div className={styles["time"]}>{time}</div>
          {messageCount > 0 && currentUser.id === friend_id && (
            <div className={styles.messageCount}>{messageCount}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatListItem;

