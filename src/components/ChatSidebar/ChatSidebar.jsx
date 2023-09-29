"use client"
import React, { useState, useEffect } from "react";
import styles from "./ChatSidebar.module.css";
import ChatListItem from "@/components/ChatListItem/ChatListItem";
import { fetchConversations } from './data';
import axios from 'axios'; // Import Axios
import { useWebSocket } from '@/context/WebSocketContext';

export default function ChatSidebar({ onItemClick }) {
  const [conversations, setConversations] = useState([]);
  const { acceptances, messages } = useWebSocket();
  const [messageCounts, setMessageCounts] = useState({});
  const [isConversationSelected, setIsConversationSelected] = useState(false);

  useEffect(() => {
    fetchData();
  }, [acceptances, messages]);

  const fetchData = async () => {
    try {
      const data = await fetchConversations();
      // Update message counts based on unread messages
      const updatedMessageCounts = {};
      data.forEach((conversation) => {
        const unreadMessages = conversation.messages.filter((message) => !message.is_read);
        updatedMessageCounts[conversation.id] = unreadMessages.length;
      });
      setMessageCounts(updatedMessageCounts);
      setConversations(data);

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
  const markMessagesAsRead = async (conversationId) => {
    try {
      await axios.put(`http://localhost:8000/api/mark-messages-as-read/${conversationId}`);
      console.log('Messages marked as read');
    } catch (error) {
      console.error('Error marking messages as read:', error);
      // Handle errors, if needed
    }
  };
  const handleChatItemClick = async (conversationId) => {
    // Call the callback function with the clicked conversationId
    onItemClick(conversationId);

    // Mark all messages in the conversation as read
     await markMessagesAsRead(conversationId);
    // Reset the message count to zero for the clicked conversation
    setMessageCounts((prevCounts) => ({
      ...prevCounts,
      [conversationId]: 0,
    }));

    setIsConversationSelected(true);
  };
  return (
    <div className={styles.container}>
      <div className={styles["chat-conversation"]}>
        <div className={styles["chat-conversation-body"]}>
          <div className={`${styles["conversation-list"]} ${styles["customScroll"]}`}>
            {conversations.map((conversation) => (
              <ChatListItem
                key={conversation.id}
                name={conversation.name}
                friend_id={conversation.friend_id}
                message={conversation.message}
                time={formatTime(conversation.time)}
                profilePhoto="/images/icons/user.png" // Static profile photo
                onClick={() => handleChatItemClick(conversation.id)}
                messageCount={messageCounts[conversation.id] || 0}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

