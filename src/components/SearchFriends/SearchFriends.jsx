import React, { useEffect, useState } from 'react';
import styles from "./SearchFriends.module.css";
import Image from "next/image";

export default function SearchFriends({ UsersList }) {
  const [friends, setFriends] = useState([]);

  const userProfilePhoto = "/images/pic.jpg";

  useEffect(() => { 
        setFriends(UsersList);
        const currentUser =localStorage.getItem('currentUser');
        console.log(UsersList);
        console.log(JSON.stringify(currentUser) );
    }, []);
  const handelAddFriend = (index) => {
    // Add the friend to your list
 
  };

  const handleRefuse = (index) => {
    // Remove the friend from your list
   
  };

  return (
    <div className={styles["notification-modal"]}>
      <div className={`${styles["notification-list"]}  ${styles["customScroll"]}`} onClick={(e) => e.stopPropagation()}>
     
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
                <strong>{user.firstname} {user.lastname}</strong>
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
              onClick={() => handelAddFriend(index)}
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
};
