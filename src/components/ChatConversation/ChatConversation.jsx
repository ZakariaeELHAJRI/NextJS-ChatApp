"use client"
import React, { useState, useEffect } from 'react';
import styles from './ChatConversation.module.css';
import axios from 'axios';
import StartChat from '@/components/StartChat/StartChat';
import Conversation from '@/components/Conversation/Conversation';

export default function ChatConversation({ conversationId, ConversationSelected }) {
  const [conversationData, setConversationData] = useState(null);
  const [isConversationSelected, setIsConversationSelected] = useState(ConversationSelected);

  useEffect(() => {
    if (conversationId) {
      fetchData();
    }
  }, [conversationId]);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.get(`http://localhost:8000/api/customconversations/${conversationId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        const conversation = response.data;
        setConversationData(conversation);
      setIsConversationSelected(false);
      } else {
        console.error('Error fetching conversation: ', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching conversation: ', error);
    }
  };

  return (
    <div className={styles.container}>
      {isConversationSelected && conversationData !== null ? (
        <Conversation conversationData={conversationData} />
      ) : (
        <StartChat />
      )}
    </div>
  );
}



