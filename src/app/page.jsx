"use client"
import React, { useState } from 'react';
import styles from './page.module.css';
import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import ChatSidebar from '@/components/ChatSidebar/ChatSidebar';
import ChatConversation from '@/components/ChatConversation/ChatConversation';

import { useWebSocket } from '../context/WebSocketContext'; // Use the custom hook

export default function Home() {
  const { isLoading, isTokenValid } = useWebSocket(); // Use the custom hook

  const [selectedConversationId, setSelectedConversationId] = useState(null);

  // Callback function to update the selectedConversationId
  const handleConversationSelect = (conversationId) => {
    setSelectedConversationId(conversationId);
  };

  if (isLoading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (isTokenValid) {
    return (
      <div className={styles.container}>
        <Navbar />
        <main className={styles.main}>
          <div className={styles.leftSide}>
            <ChatSidebar onItemClick={handleConversationSelect} />
          </div>
          <div className={styles.rightSide}>
            <ChatConversation conversationId={selectedConversationId} />
          </div>
        </main>
        <Footer />
      </div>
    );
  }
}


