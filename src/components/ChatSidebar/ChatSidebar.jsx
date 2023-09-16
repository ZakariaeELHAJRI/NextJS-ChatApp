"use client"
import React, { useState, useEffect } from "react";
import styles from "./ChatSidebar.module.css";
import ChatListItem from "@/components/ChatListItem/ChatListItem";
import { fetchConversations } from './data';
import ChatConversation from "../ChatConversation/ChatConversation";

export default function ChatSidebar() {
  const [conversations, setConversations] = useState([]);
  const [selectedConversationId, setSelectedConversationId] = useState(null); 
  const [isConversationSelected, setIsConversationSelected] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const data = await fetchConversations();
    setConversations(data);
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
    // Set the selectedConversationId when a ChatListItem is clicked
    setSelectedConversationId(conversationId);
    setIsConversationSelected(true); // Set the isConversationSelected state to true
  };
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
                time={formatTime(conversation.time)}
                profilePhoto="/images/icons/user.png" // Static profile photo
                onClick={() => handleChatItemClick(conversation.id)} 
              />
            ))}
          </div>
        </div>
      </div>
      {selectedConversationId !== null && (
        <ChatConversation conversationId={selectedConversationId} ConversationSelected={isConversationSelected}/> 
      )}
    </div>
  );
}


    