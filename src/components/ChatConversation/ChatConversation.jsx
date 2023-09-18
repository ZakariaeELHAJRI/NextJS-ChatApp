"use client"
import React, { useState, useEffect } from 'react';
import styles from './ChatConversation.module.css';
import axios from 'axios';

import Conversation from '@/components/Conversation/Conversation';
import StartChat from '@/components/StartChat/StartChat';

export default function ChatConversation({ conversationId }) { 
  const [conversationData, setConversationData] = useState(null);
  const [isEmpty, setIsEmpty] = useState(true);

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
        console.log(conversation);
        setIsEmpty(false);
      } else {
        console.error('Error fetching conversation: ', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching conversation: ', error);
    }
  };

  return (
    <div className={styles.container}>
      {isEmpty ? (
        <StartChat />
      ) : (
        <Conversation conversationData={conversationData}  /> 
      )}
    </div>
  );
}










