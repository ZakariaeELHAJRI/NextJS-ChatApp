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


export const sendWebSocketMessage = (messageData) => {
  if (socket && socket.readyState === WebSocket.OPEN) {
    const message = {
      event: 'message',
      data: messageData,
    };
    socket.send(JSON.stringify(messageData));
    console.log('WebSocket message sent:', messageData);
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

export const recieveWebSocketAcceptance = (socket, setAcceptanceState) => {
    socket.addEventListener('message', (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('WebSocket acceptance received:', data);
        if(data.event==="acceptance"){
          setAcceptanceState((prevAcceptances) => [...prevAcceptances, data]);
        }
      } catch (error) {
        console.error('Received non-JSON message:', event.data);
      }
    });
  }

 // Function to handle received messages
  export const receiveWebSocketMessage = (socket, setMessageState) => {
    socket.addEventListener('message', (event) => {
      console.log("WebSocket message received:", event.data);
  
      try {
        // Try to parse the received message as JSON
        const newMessage = JSON.parse(event.data);
  
        // Update the message state with the new message
        setMessageState((prevMessages) => [...prevMessages, newMessage]);
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
        console.log('WebSocket invitation received:', data);
        if(data.event==="invitation"){
               setInvitationState((prevInvitations) => [...prevInvitations, data]);
        }
   
      } catch (error) {
        console.error('Received non-JSON message:', event.data);
      }
    });
  };

  