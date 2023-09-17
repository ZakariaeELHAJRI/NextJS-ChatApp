"use client"
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from '@/components/ChatConversation/ChatConversation.module.css';
import StartChat from '@/components/StartChat/StartChat';
import axios from 'axios';

export default function Conversation({ conversationData, socket }) {
  const [messageInput, setMessageInput] = useState('');
  const [messages, setMessages] = useState([]);
  console.log("socket "+socket);
  useEffect(() => {
    setMessages(conversationData.messages);
    console.log("ooooooo"+conversationData.messages);
    if (!conversationData || !socket) return;
    console.log("code broke here");
    // Initialize messages with conversationData messages
    const handleNewMessage = (data) => {
      if (data.conversationId === conversationData.id) {
        setMessages((prevMessages) => [...prevMessages, data]);
      }
    };

    // Listen for incoming messages via WebSocket when the component mounts
    socket.on('message', handleNewMessage);

    // Clean up the socket listener when the component unmounts
    return () => {
      socket.off('message', handleNewMessage);
    };
  }, [conversationData, socket]);

  const sendMessage = async () => {
    if (!messageInput.trim() || !socket) return;
  
    // Send the message via WebSocket
    socket.emit('send_message', {
      conversationId: conversationData.id,
      content: messageInput,
    });
  
    // Update the local messages state
    const newMessage = {
      content: messageInput,
      sender_id: conversationData.current_user_id,
      time: new Date().toLocaleTimeString(),
    };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
  
    // Clear the message input field
    setMessageInput('');
  
    try {
      // Send the message to the server using axios
      const token = localStorage.getItem('accessToken');
    const data =  await axios.post('http://localhost:8000/api/messages/', {
        conversation_id: conversationData.id,
        content: messageInput,
        sender_id: conversationData.current_user_id,
        receiver_id: conversationData.friend_id, 
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("data"+data);
    } catch (error) {
      console.error('Error sending message to the server:', error);
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
