import axios from 'axios';
import { newConversation } from "@/app/Utils/websocket";

export  const handleSendMsg = async (user_id , friend_id) => {
    try {
      const token = localStorage.getItem("accessToken");
      // Make an HTTP POST request to your server's API endpoint to update the invitation status
      const response = await axios.post(
        `http://localhost:8000/api/conversations`,
        {
          user1_id: user_id,
          user2_id: friend_id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    
      // Check the response to ensure the update was successful
      if (response.status === 200) {
       console.log("Conversation created successfully");
       const data = {
        event : "new_conversation" ,
        user1_id: user_id,
        user2_id: friend_id,
      };
      newConversation(data);
      console.log("new conversation sent");
      }
    } catch (error) {
      console.error("Error sending new conversation:", error);
    }
  };