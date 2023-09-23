"use client"
import React, { createContext, useContext, useState, useEffect } from 'react';
import jwtDecode from 'jwt-decode';
import { initializeSocket } from '../app/Utils/websocket';
import { useRouter } from 'next/navigation';
import axios from 'axios'; // Import axios for making API requests

const WebSocketContext = createContext();

export const WebSocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isTokenValid, setIsTokenValid] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

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
        const userDataJSON = JSON.stringify(userData);
        localStorage.setItem('currentUser', userDataJSON);
        return userData; // Return the user data
      } else {
        throw new Error('Failed to fetch user data');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      throw error; // Rethrow the error to handle it later
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const username = localStorage.getItem('username');

    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const currentTime = Math.floor(Date.now() / 1000);
        if (decodedToken.exp > currentTime) {
          // Token is valid
          setIsLoading(true); // Set isLoading to true while fetching user data
          
          fetchUserByUsername(username)
            .then((userData) => {
              const userId = userData.id;
              const newSocket = initializeSocket(userId, token);
              setSocket(newSocket);
              setIsTokenValid(true);
              setIsLoading(false); // Set isLoading to false once user data and socket are set
            })
            .catch((error) => {
              console.error('Error fetching user data:', error);
              setIsLoading(false); // Set isLoading to false in case of an error
            });
        } else {
          // Token is expired
          if (socket) {
            socket.close();
            setSocket(null);
          }
          router.push('/login');
        }
      } catch (error) {
        // Token is invalid
        if (socket) {
          socket.close();
          setSocket(null);
        }
        router.push('/login');
      }
    }
  }, [socket, router]);

  return (
    <WebSocketContext.Provider value={{ socket, isTokenValid, isLoading }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};
