"use client"
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from '@/components/ChatConversation/ChatConversation.module.css';
import StartChat from '@/components/StartChat/StartChat';
import {sendWebSocketMessage ,receiveWebSocketMessage } from '@/app/Utils/websocket';
import { useWebSocket } from '@/context/WebSocketContext';

export default function Conversation({ conversationData }) {
  const [messageInput, setMessageInput] = useState('');
  const [messages, setMessages] = useState([]);
  const {socket} = useWebSocket();

  useEffect(() => {
    setMessages(conversationData.messages);
    const token = localStorage.getItem('accessToken');
    if (token) {
     receiveWebSocketMessage(socket,setMessages);
       
     
    }
  }, [conversationData]);

  // Send a message to the server
  const sendMessage = () => {
    if (!messageInput.trim()) return;

    const newMessage = {
      event: 'message',
      content: messageInput,
      sender_id: conversationData.current_user_id,
      receiver_id: conversationData.friend_id,
      time: new Date().toLocaleTimeString(),
      conversation_id: conversationData.id,
    };

    // Emit the 'send_message' event with the message data
    sendWebSocketMessage(socket, newMessage);
    console.log('WebSocket message sent:', newMessage);
    setMessages((prevMessages) => [...prevMessages, newMessage]);
  //  receiveWebSocketMessage(socket,setMessages);
    // Clear the message input field
    setMessageInput('');
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
          {messages.map((message, messageIndex) => (
            <div
              key={messageIndex}
              className={`${styles['chat-conversation-body-message-item']} ${
                message.sender_id === conversationData.current_user_id
                  ? styles['right-message']
                  : styles['left-message']
              }`}
            >
              <div className={styles['chat-conversation-body-message-item-user']}>
                <div className={styles['chat-conversation-body-message-item-user-text']}>
                  {message.content}
                </div>
              </div>
              <div className={styles['chat-conversation-body-message-item-timestamp']}>
                {message.time}
              </div>
            </div>
          ))}
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
