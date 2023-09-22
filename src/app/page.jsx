"use client"
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import ChatSidebar from '@/components/ChatSidebar/ChatSidebar';
import ChatConversation from '@/components/ChatConversation/ChatConversation';
import jwtDecode from 'jwt-decode'; 
import axios from 'axios'; 



export default function Home() {
  const [selectedConversationId, setSelectedConversationId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  // verify token usestate
  const [isTokenValid, setIsTokenValid] = useState(false);
  const router = useRouter();


  // Callback function to update the selectedConversationId
  const handleConversationSelect = (conversationId) => {
    setSelectedConversationId(conversationId);
  };

// Function to fetch user data by username
const fetchUserByUsername = async (username) => {
  try {
    const token = localStorage.getItem('accessToken');
    const response = await axios.get(`http://localhost:8000/api/currentuser/${username}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 200) { 
      const userData = response.data; 
      setUserData(userData);
      console.log(userData);
      localStorage.setItem('currentUser', userData);
    
    } else {
      console.error('Failed to fetch user data');
    }
  } catch (error) {
    console.error('Error fetching user data:', error);
  }
};

  useEffect(() => {
    // Check if a token is stored (e.g., in localStorage)
    const token = localStorage.getItem('accessToken');
    console.log(token);
    const username = localStorage.getItem('username');
    fetchUserByUsername(username);
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const currentTime = Math.floor(Date.now() / 1000);
        if (decodedToken.exp > currentTime) {
          setIsLoading(false);
          setIsTokenValid(true);

        } else {
          setIsLoading(false);
          router.push('/login');
        }
      } catch (error) {
        setIsLoading(false);
        router.push('/login');
      }
    } else {
      setIsLoading(false);
      router.push('/login');
    }

   
  }, []);



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
            <ChatConversation conversationId={selectedConversationId}/> 
          </div>
        </main>
        <Footer />
      </div>
    );
  }
}

