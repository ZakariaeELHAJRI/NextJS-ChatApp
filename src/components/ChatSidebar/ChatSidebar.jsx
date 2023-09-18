"use client"
import React, { useState, useEffect } from "react";
import styles from "./ChatSidebar.module.css";
import ChatListItem from "@/components/ChatListItem/ChatListItem";
import { fetchConversations } from './data';
import ChatConversation from "../ChatConversation/ChatConversation";

export default function ChatSidebar({ onItemClick }) {
  const [conversations, setConversations] = useState([]);
  const [isConversationSelected, setIsConversationSelected] = useState(false);

  useEffect(() => {
    fetchData();
  
  }, []);

  const fetchData = async () => {
    try {
      const data = await fetchConversations();
      setConversations(data);
    //  console.log("conversations"+ JSON.stringify(data[0].current_user_id));
      localStorage.setItem('id_current_user', data[0].current_user_id);
    } catch (error) {
      console.error('Error fetching conversations: ', error);
    }
  };
  const formatTime = (time) => {
    const currentTime = new Date();
    const messageTime = new Date(time);
    
    // Check if the message time is today
    if (
      messageTime.getDate() === currentTime.getDate() &&
      messageTime.getMonth() === currentTime.getMonth() &&
      messageTime.getFullYear() === currentTime.getFullYear()
    ) {
      // Display time in HH:mm format
      return `${messageTime.getHours()}:${messageTime.getMinutes().toString().padStart(2, '0')}`;
    } else {
      // Display date in DD/MM/YY format
      return `${messageTime.getDate()}/${messageTime.getMonth() + 1}/${String(messageTime.getFullYear()).slice(-2)}`;
    }
  };
  const handleChatItemClick = (conversationId) => {
    // Call the callback function with the clicked conversationId
    onItemClick(conversationId);
    setIsConversationSelected(true);
  };
 
  return (
    <div className={styles.container}>
      <div className={styles["chat-conversation"]}>
        <div className={styles["chat-conversation-body"]}>
          <div className={`${styles["conversation-list"]} ${styles["customScroll"]}`}>
            {conversations.map((conversation, index) => (
              <ChatListItem
              key={conversation.id}
              name={conversation.name}
              message={conversation.message}
              time={formatTime(conversation.time)}
              profilePhoto="/images/icons/user.png" // Static profile photo
              onClick={() => handleChatItemClick(conversation.id)} 
            />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}


    