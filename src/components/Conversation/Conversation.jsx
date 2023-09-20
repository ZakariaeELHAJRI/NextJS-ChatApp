"use client"
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from '@/components/ChatConversation/ChatConversation.module.css';
import StartChat from '@/components/StartChat/StartChat';
import axios from 'axios';
import io from 'socket.io-client'; // Import socket.io-client
import socketIO from 'socket.io-client';

export default function Conversation({ conversationData }) {
  const [messageInput, setMessageInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    setMessages(conversationData.messages);
    // Retrieve the authentication token from localStorage
    const token = localStorage.getItem('accessToken');

    // Check if the token is available
    if (token) {
      const wsUrl = `ws://localhost:8000/ws/${conversationData.current_user_id}?token=${token}`;
      const newSocket = new WebSocket(wsUrl);

      // WebSocket event listeners
      newSocket.addEventListener('open', (event) => {
        console.log("WebSocket connection opened:", event);
      });

      newSocket.addEventListener('message', (event) => {
        console.log("WebSocket message received:", event.data);
      
        try {
          // Try to parse the received message as JSON
          const newMessage = JSON.parse(event.data);
      
          // Update the messages state with the new message
          setMessages((prevMessages) => [...prevMessages, newMessage]);
        } catch (error) {
          // Handle non-JSON messages here
          console.error("Received non-JSON message:", event.data);
        }
      });
      

      newSocket.addEventListener('close', (event) => {
        console.log("WebSocket connection closed:", event);
      });

      newSocket.addEventListener('error', (error) => {
        console.error("WebSocket error:", error);
      });

      setSocket(newSocket);

      return () => {
        // Close the WebSocket connection when the component unmounts
        newSocket.close();
      };
    }
  }, [conversationData]);

  // Send a message to the server
  const sendMessage = () => {
    if (!messageInput.trim()) return;

    const newMessage = {
      event: "message",
      content: messageInput,
      sender_id: conversationData.current_user_id,
      receiver_id: conversationData.friend_id,
      time: new Date().toLocaleTimeString(),
      conversation_id: conversationData.id,
    };

    // Emit the 'send_message' event with the message data
    socket.send(JSON.stringify(newMessage));
    console.log("WebSocket message sent:", newMessage);

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
