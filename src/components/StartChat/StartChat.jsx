import React from 'react'
import styles from "@/components/ChatConversation/ChatConversation.module.css";
export default function StartChat() {
  return ( 
    <div className={styles["chat-conversation"]}>
      <div className={styles["center-start-chat"]}>
          <h1>Start chatting</h1>
          <p>Select a conversation to start chatting</p>
      </div>

    </div>
  )
}
