import React from 'react';
import styles from "./ChatSidebar.module.css";
import ChatListItem from '@/components/ChatListItem/ChatListItem';
import { conversations } from './data';

export default function ChatSidebar() {
  return (
    <div className={styles.container}>
      <div className={styles["chat-conversation"]}>
        <div className={styles["chat-conversation-body"]}>
        <div className={`${styles["conversation-list"]} ${styles["customScroll"]}`}>
            {conversations.map((conversation, index) => (
              <ChatListItem
                key={index}
                name={conversation.name}
                message={conversation.message}
                time={conversation.time}
                profilePhoto={conversation.profilePhoto}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

    