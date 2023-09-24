import React, { useEffect, useState } from 'react';
import styles from './SearchFriends.module.css';
import Image from 'next/image';
import {
  initializeSocket,
  sendInvitation,
  receiveWebSocketInvitation,
} from '@/app/Utils/websocket';
import { useWebSocket } from '@/context/WebSocketContext';
export default function SearchFriends({ UsersList }) {
  const [friends, setFriends] = useState([]);
  const {socket} = useWebSocket();
  const [current_user, setCurrentUser] = useState(null);
  const userProfilePhoto = '/images/pic.jpg';
    // Declare the addFriendDisabled state variable
    const [addFriendDisabled, setAddFriendDisabled] = useState([]);

  useEffect(() => {
    const currentUserString = localStorage.getItem('currentUser');
    const currentUser = JSON.parse(currentUserString);
    setFriends(UsersList);
    setCurrentUser(currentUser);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');

    if (token && current_user) {
      const current_user_id = current_user.id;


      // Use the receiveWebSocketInvitation function to handle invitations

    }
  }, [current_user]);

  const handleAddFriend = (index) => {
    const friendToAdd = friends[index];
    // Disable the "Add Friend" button
    setAddFriendDisabled((prevDisabled) => {
        const newDisabled = [...prevDisabled];
        newDisabled[index] = true;
        return newDisabled;
      });
    
    const data = {
      event: 'invitation',
      user_id: current_user.id,
      friend_id: friendToAdd.id,
      user_name: `${current_user.firstname} ${current_user.lastname}`,

    };

    sendInvitation(data);

    socket.onmessage = (event) => {
      const acknowledgment = JSON.parse(event.data);
      if (acknowledgment.event === 'invitation_acknowledgment') {
        // Handle the acknowledgment as needed
        if (acknowledgment.status === 'received') {
          console.log('Invitation received by the user');
          // Perform further actions, e.g., updating UI
        } else {
          console.log('Invitation was not received by the user');
          // Handle the case where the user did not receive the invitation
        }
      }
    };
  };

  const handleRefuse = (index) => {
    // Implement this functionality as needed
  };

  return (
    <div className={styles['notification-modal']}>
      <div
        className={`${styles['notification-list']} ${styles['customScroll']}`}
        onClick={(e) => e.stopPropagation()}
      >
        {friends.map((user, index) => (
          <div key={index} className={styles['invitation']}>
            <div className={styles['invitation-item']}>
              <Image
                src={userProfilePhoto}
                alt="User"
                width={40}
                height={40}
                className={styles.userImage}
              />
              <div className={styles.invitationContent}>
                <p>
                  <strong>
                    {user.firstname} {user.lastname}
                  </strong>
                </p>
                <div className={styles.commonFriends}>
                  <Image
                    src="/images/pic.jpg"
                    alt="Common Friends"
                    width={20}
                    height={20}
                    className={styles.commonImage}
                  />
                  <span>{user.common_friends_count} friends in common</span>
                </div>
              </div>
            </div>
            <div className={styles['invitation-buttons']}>
              <button
                className={styles.acceptButton}
                onClick={() => handleAddFriend(index)}
                disabled={addFriendDisabled[index]}
              >
                Add Friend
              </button>
              <button
                className={styles.refuseButton}
                onClick={() => handleRefuse(index)}
              >
                DELETE
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
