// websocket.js

let socket = null;


export const initializeSocket = (userId, token) => {
  if (!socket) {
    const wsUrl = `ws://localhost:8000/ws/${userId}?token=${token}`;
    socket = new WebSocket(wsUrl);

    socket.addEventListener('open', (event) => {
      console.log('WebSocket connection opened:', event);
    });

    socket.addEventListener('close', (event) => {
      console.log('WebSocket connection closed:', event);
    });

    socket.addEventListener('error', (error) => {
      console.error('WebSocket error:', error);
    });
  }

  return socket; 
};


export const sendWebSocketMessage = (socket ,messageData) => {
  if (socket && socket.readyState === WebSocket.OPEN) {
    const message = {
      event: 'message',
      data: messageData, // You can define the structure of the messageData as needed
    };

    socket.send(JSON.stringify(message));
    console.log('WebSocket message sent:', message);
  } else {
    console.error('WebSocket is not open');
  }
 
};

export const sendInvitation = (invitationData) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      const invitationMessage = {
        event: 'invitation',
        data: invitationData, // You can define the structure of the invitationData as needed
      };
  
      socket.send(JSON.stringify(invitationMessage));
      console.log('WebSocket invitation sent:', invitationMessage);
    } else {
      console.error('WebSocket is not open');
    }
  };

export const sendAcceptance = (acceptanceData) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      const acceptanceInvitation = {
        event: 'acceptance',
        data: acceptanceData, // You can define the structure of the acceptanceData as needed
      };
  
      socket.send(JSON.stringify(acceptanceInvitation));
      console.log('WebSocket acceptance sent:', acceptanceInvitation);
    } else {
      console.error('WebSocket is not open');
    }
  }

  export const newConversation = (conversationData) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      const newConversationMessage = {
        event: 'newConversation',
        data: conversationData, // You can define the structure of the conversationData as needed
      };

      socket.send(JSON.stringify(newConversationMessage));
      console.log('WebSocket newConversation sent:', newConversationMessage);
    } else {
      console.error('WebSocket is not open');
    }
  };

  export const recieveWebSocketNewConversation = (socket, setConversations) => {
    socket.addEventListener('message', (event) => {
      try {
        const data = JSON.parse(event.data);
        if(data.event==="newConversation"){
          console.log('WebSocket newConversation received:', data);
          setConversations((prevConversations) => [...prevConversations, data]);
        }
      } catch (error) {
        console.error('Received non-JSON message:', event.data);
      }
    });
  };

  

export const recieveWebSocketAcceptance = (socket, setAcceptanceState) => {
    socket.addEventListener('message', (event) => {
      try {
        const data = JSON.parse(event.data);
        if(data.event==="acceptance"){
          console.log('WebSocket acceptance received:', data);
          setAcceptanceState((prevAcceptances) => [...prevAcceptances, data]);
        }
      } catch (error) {
        console.error('Received non-JSON message:', event.data);
      }
    });
  }

 // Function to handle received messages
  export const receiveWebSocketMessage = (socket, setMessageState ) => {
    socket.addEventListener('message', (event) => {
      
      try {
        // Try to parse the received message as JSON
        const newMessage = JSON.parse(event.data);
        if (newMessage.event === "message") {
          console.log("WebSocket message received:", event.data);
          // Update the message state with the new message
          setMessageState((prevMessages) => [...prevMessages, newMessage]);
        }
      } catch (error) {
        // Handle non-JSON messages here
        console.error("Received non-JSON message:", event.data);
      }
    });
  };
  
  export const receiveWebSocketMessageConversation = (socket, setMessageState , conversationId ) => {
    socket.addEventListener('message', (event) => {
      
      try {
        // Try to parse the received message as JSON
        const newMessage = JSON.parse(event.data);
        console.log("newMessage receiveWebSocketMessageConversation : ",newMessage);
        console.log("conversationId receiveWebSocketMessageConversation : ",conversationId);
        if (newMessage.event === "message" && newMessage.conversation_id === conversationId) {
          console.log("WebSocket message received:", event.data);
          // Update the message state with the new message
          setMessageState((prevMessages) => [...prevMessages, newMessage]);
        }
      } catch (error) {
        // Handle non-JSON messages here
        console.error("Received non-JSON message:", event.data);
      }
    });
  };
  export const receiveWebSocketUpdateMessage = (socket, setConversations ) => {
    socket.addEventListener('message', (event) => {
      console.log("WebSocket message received:", event.data);
      try {
        const newMessage = JSON.parse(event.data);
        if (newMessage.event === "message") {
          // Update the conversation with the new message if setConversations is provided
          if (setConversations) {
            setConversations((prevConversations) => {
              const updatedConversations = [...prevConversations];
              const conversationToUpdate = updatedConversations.find(
                (conversation) => conversation.id === newMessage.conversationId
              );
              if (conversationToUpdate) {
                conversationToUpdate.message = newMessage.content;
                conversationToUpdate.time = newMessage.time;
              }
              return updatedConversations;
            });
          }
        }
      } catch (error) {
        // Handle non-JSON messages here
        console.error("Received non-JSON message:", event.data);
      }
    });
  };

  export const receiveWebSocketInvitations = (socket, setInvitationState) => {
    socket.addEventListener('message', (event) => {
      try {
        const data = JSON.parse(event.data);
        if(data.event==="invitation"){
          console.log('WebSocket invitation received:', data);
               setInvitationState((prevInvitations) => [...prevInvitations, data]);
        }
   
      } catch (error) {
        console.error('Received non-JSON message:', event.data);
      }
    });
  };

  