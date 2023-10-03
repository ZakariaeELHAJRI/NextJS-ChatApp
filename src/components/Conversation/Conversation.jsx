"use client"
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from '@/components/ChatConversation/ChatConversation.module.css';
import StartChat from '@/components/StartChat/StartChat';
import {sendWebSocketMessage , recieveWebSocketNewConversation } from '@/app/Utils/websocket';
import { useWebSocket } from '@/context/WebSocketContext';

export default function Conversation({ conversationData ,messagesData}) {
  const [messageInput, setMessageInput] = useState('');
  const [allMessages, setMessages] = useState([]);
  const {socket , messages  } = useWebSocket();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
     setMessages(messagesData);
     
    }
  }, [conversationData]);

  useEffect(() => {
    console.log("messages socket", messages);
    console.log('socket conversationId', messages.conversation_id);
    console.log('conversationId', conversationData.id);
    if (!messages) return;
    messages.forEach((message) => {
      if (message.conversation_id === conversationData.id) {
        // Add the new message to the local state
        setMessages((prevMessages) => [...prevMessages, message]);
        message.conversation_id = null;
      }
    });
         
  }, [ messages]);

  // Send a message to the server
  const sendMessage = () => {
    if (!messageInput.trim()) return;
  
  
    const newMessage = {
      event: 'message',
      content: messageInput,
      sender_id: conversationData.current_user_id,
      receiver_id: conversationData.friend_id,
      time: new Date().toLocaleString(),
      conversation_id: conversationData.id,
      is_read: false,
    };
    messages.forEach((message) => {
      if (message.conversation_id === conversationData.id) {
        message.conversation_id = null;

      }
    });
    sendWebSocketMessage(socket, newMessage);
    console.log('WebSocket message sent:', newMessage);
  
    setMessageInput('');
  };
  const customFormatTimestamp = (time) => {
    const timestampRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/;
    const timestampDate = new Date(time);
    const today = new Date();
  
    const options = {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true, // Use a 12-hour clock
    };
    if (timestampRegex.test(time)) {
      if (timestampDate.toDateString() === today.toDateString()) {
        // If the timestamp date is the same as today, display only the hour and minute
        return timestampDate.toLocaleTimeString(undefined, options);
      } else {
        // If the timestamp date is different from today, display custom format
        const day = timestampDate.getDate().toString().padStart(2, '0');
        const month = (timestampDate.getMonth() + 1).toString().padStart(2, '0');
        const year = timestampDate.getFullYear().toString().substring(2);
  
        const formattedTime = timestampDate.toLocaleTimeString(undefined, options);
  
        return `${day}-${month}-${year} | ${formattedTime}`;
      }
    } else {
      return timestampDate.toLocaleTimeString(undefined, options);
    }
  };
  
  
  if (!conversationData) {
    return <StartChat />;
  }

  return (
    <div className={styles['chat-conversation']}>
      <div className={styles['chat-conversation-header']}>
        <div className={styles['chat-conversation-header-user']}>
          <div className={styles['chat-conversation-body-message-item-user-photo']}>
            <Image src="/images/pic.jpg" alt="user profile photo" width={40} height={40} />
          </div>
          <div className={styles['chat-conversation-header-user-name']}>{conversationData.name}</div>
          <div className={styles['chat-conversation-header-user-status']}>Online</div>
        </div>
        <div className={styles['chat-conversation-header-options']}>
          <div className={styles['chat-conversation-header-options-item']}>
            <i className={`fas fa-video ${styles.icon}`}></i>
            <i className={`fas fa-phone ${styles.icon}`}></i>
            <i className={`fas fa-ellipsis-v ${styles.icon}`}></i>
          </div>
        </div>
      </div>
      <div className={styles['chat-conversation-body']}>
      <div className={styles['chat-conversation-body-message']}>
     {allMessages.map((message, messageIndex) => (
      <div
        key={messageIndex}
        className={`${styles['chat-conversation-body-message-item']} ${
          message.sender_id === conversationData.current_user_id
            ? styles['right-message']
            : styles['left-message']
        }`}
      >
        {message.sender_id === conversationData.current_user_id && (
          <div className={styles['chat-conversation-body-message-item-timestamp']}>
            {customFormatTimestamp(message.time)}
          </div>
        )}
        <div className={styles['chat-conversation-body-message-item-user']}>
          <div className={styles['chat-conversation-body-message-item-user-text']}>
            {message.content}
          </div>
        </div>
        {message.sender_id !== conversationData.current_user_id && (
          <div className={styles['chat-conversation-body-message-item-timestamp']}>
            {customFormatTimestamp(message.time)}
          </div>
        )}
      </div>
    ))
  }
</div>

</div>

      <div className={styles['chat-conversation-input']}>
        <input
          type="text"
          placeholder="Type your message..."
          className={styles['chat-conversation-input-field']}
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
        />
        <button className={styles['chat-conversation-send-btn']} onClick={sendMessage}>
          Send
        </button>
      </div>
    </div>
  );
}
