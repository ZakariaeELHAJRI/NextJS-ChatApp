import Link from "next/link";
import styles from "./Navbar.module.css";
import Image from "next/image";

export default function Navbar() {
   const userName = "John Doe";
  const userProfilePhoto = "/images/pic.jpg";
  return (
    <div className={styles.container}>
      <Link href="/" className={styles.logo}>
        CHATAPP
      </Link>
      <div className={styles.search}>
        <input type="text" placeholder="Search" />
      </div>
      <div className={styles.userProfile}>
        <div className={styles.userName}>{userName}</div>
        <div className={styles.profilePhoto}>
          <Image
            src={userProfilePhoto}
            alt="user profile photo"
            width={40}
            height={40}
           
          />
        </div>
      </div>
    </div>
  );
}


