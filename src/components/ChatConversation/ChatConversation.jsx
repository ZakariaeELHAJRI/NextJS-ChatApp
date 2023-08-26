import React from 'react';
import Image from "next/image";
import styles from "./ChatConversation.module.css";

export default function ChatConversation() {
  return (
    <div className={styles.container}>
      <div className={styles["chat-conversation"]}>
        <div className={styles["chat-conversation-header"]}>
          <div className={styles["chat-conversation-header-user"]}> 
          <div className={styles["chat-conversation-body-message-item-user-photo"]}>
                  <Image src="/images/pic.jpg" alt="user profile photo" width={40} height={40} />
                </div>
            <div className={styles["chat-conversation-header-user-name"]}>John Doe</div>
            <div className={styles["chat-conversation-header-user-status"]}>Online</div>
          </div>
          <div className={styles["chat-conversation-header-options"]}>
            <div className={styles["chat-conversation-header-options-item"]}>
              <i className={`fas fa-video ${styles.icon}`}></i>
              <i className={`fas fa-phone ${styles.icon}`}></i>
              <i className={`fas fa-ellipsis-v ${styles.icon}`}></i>
            </div>
          </div>
        </div>
        <div className={styles["chat-conversation-body"]}>
          <div className={styles["chat-conversation-body-message"]}>
            <div className={styles["chat-conversation-body-message-item"]}>
              <div className={styles["chat-conversation-body-message-item-user"]}>
               
                <div className={styles["chat-conversation-body-message-item-user-text"]}>
                  Hello there!
                </div>
              </div>
              <div className={styles["chat-conversation-body-message-item-timestamp"]}>
                10:30 AM
              </div>
            </div>
            {/* Add more message items here */}
          </div>
        </div>
        <div className={styles["chat-conversation-input"]}>
          <input
            type="text"
            placeholder="Type your message..."
            className={styles["chat-conversation-input-field"]}
          />
          <button className={styles["chat-conversation-send-btn"]}>Send</button>
        </div>
      </div>
    </div>
  );
}

