import React from 'react'
import styles from "./ChatSidebar.module.css";
export default function ChatSidebar() {
  return (
    <div className={styles.container}>
      <div className={styles["chat-conversation"]}>
        <p>chat conversations</p>
    </div>
    </div>
  )
}
