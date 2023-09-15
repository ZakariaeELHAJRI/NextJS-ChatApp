"use client"
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import ChatSidebar from '@/components/ChatSidebar/ChatSidebar';
import ChatConversation from '@/components/ChatConversation/ChatConversation';
import jwtDecode from 'jwt-decode'; // Import jwt-decode library

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  // verify token usestate
   const [isTokenValid, setIsTokenValid] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if a token is stored (e.g., in localStorage)
    const token = localStorage.getItem('accessToken');

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
          <ChatSidebar />
        </div>
        <div className={styles.rightSide}>
          <ChatConversation />
        </div>
      </main>
      <Footer />
    </div>
  );
   }
}
