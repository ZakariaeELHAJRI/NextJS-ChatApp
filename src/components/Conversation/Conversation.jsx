"use client"
import React, { useState, useEffect , useRef } from 'react';
import Image from 'next/image';
import styles from '@/components/ChatConversation/ChatConversation.module.css';
import StartChat from '@/components/StartChat/StartChat';
import {sendWebSocketMessage , recieveWebSocketNewConversation } from '@/app/Utils/websocket';
import { useWebSocket } from '@/context/WebSocketContext';
import { format, isToday , parse } from 'date-fns';
import { all } from 'axios';


export default function Conversation({ conversationData ,messagesData}) {
  const [messageInput, setMessageInput] = useState('');
  const [allMessages, setMessages] = useState([]);
  const {socket , messages  } = useWebSocket();
  const lastMessageRef = useRef();
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
    // Scroll to the last message when messages update
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: 'auto' });
    }

  }, [ messages , allMessages]);

  // Send a message to the server
  const sendMessage = () => {
    if (!messageInput.trim()) return;
  
    
    const newMessage = {
      event: 'message',
      content: messageInput,
      sender_id: conversationData.current_user_id,
      receiver_id: conversationData.friend_id,
      time: new Date(),
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
  function formatMessageTime(time) {
    const today = new Date();
    const messageTime = new Date(time);
    console.log('time', time);
    console.log('messageTime', messageTime);
    console.log('today', today);
  
    if (!isNaN(messageTime.getTime())) { // Check if parsing was successful
     
  
      if (messageTime.toDateString() === today.toDateString()) {
        // Display only the time in the format 'HH:mm'
        const formattedTime = messageTime.toLocaleTimeString('en-GB', {
          hour: '2-digit',
          minute: '2-digit',
        });
        return formattedTime;
      }
      else
      {
        // Display date and time in the format 'dd-MM-yyyy | HH:mm:ss'
        const formattedTime = messageTime.toLocaleString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });
        return formattedTime;
      } 
    }
  
    // Return a default message if the time couldn't be parsed or is in the past
    return 'Invalid time';
  }
  
  
  
  
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
            ref={messageIndex === allMessages.length - 1 ? lastMessageRef : null} // Set the ref to the last message
            className={`${styles['chat-conversation-body-message-item']} ${
              message.sender_id === conversationData.current_user_id
                ? styles['right-message']
                : styles['left-message']
            }`}
          >
        {message.sender_id === conversationData.current_user_id && (
          <div className={styles['chat-conversation-body-message-item-timestamp']}>
            {formatMessageTime(message.time)}
          </div>
        )}
        <div className={styles['chat-conversation-body-message-item-user']}>
          <div className={styles['chat-conversation-body-message-item-user-text']}>
            {message.content}
          </div>
        </div>
        {message.sender_id !== conversationData.current_user_id && (
          <div className={styles['chat-conversation-body-message-item-timestamp']}>
            {formatMessageTime(message.time)}
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
