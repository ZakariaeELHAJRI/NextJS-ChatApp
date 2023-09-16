import React from 'react'
import Image from "next/image";
import styles from "@/components/ChatConversation/ChatConversation.module.css";
export default function Conversation({conversationData}) {
  return (
           
            <div className={styles["chat-conversation"]}>
              <div className={styles["chat-conversation-header"]}>
                <div className={styles["chat-conversation-header-user"]}>
                  <div className={styles["chat-conversation-body-message-item-user-photo"]}>
                    <Image src="/images/pic.jpg" alt="user profile photo" width={40} height={40} />
                  </div>
                  <div className={styles["chat-conversation-header-user-name"]}>{conversationData.name}</div>
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
                  {conversationData.messages.map((message, messageIndex) => (
                    <div
                      key={messageIndex}
                      className={`${styles["chat-conversation-body-message-item"]} ${
                        message.sender_id === conversationData.current_user_id
                          ? styles["right-message"]
                          : styles["left-message"]
                      }`}
                    >
                      <div className={styles["chat-conversation-body-message-item-user"]}>
                        <div className={styles["chat-conversation-body-message-item-user-text"]}>
                          {message.content}
                        </div>
                      </div>
                      <div className={styles["chat-conversation-body-message-item-timestamp"]}>
                        {message.time}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className={styles["chat-conversation-input"]}>
                <input
                  type="text"
                  placeholder="Type your message..."
                  className={styles["chat-conversation-input-field"]}
                />
                <button
                  className={styles["chat-conversation-send-btn"]}
                  onClick={() => {
                    console.log("Send message");
                  }}
                >
                  Send
                </button>
              </div>
            </div>
            )
}

