import React from 'react'
import Image from "next/image";
import styles from "./Footer.module.css";
import { socailLinks } from './data';
export default function Footer() {
  return (
  <div className={styles.container}>
    <div>©2023 ChatApp. All rights reserved.</div>
    <div className={styles.social}>
        {
         socailLinks.map(media => 
        <Image 
        key={media.id}
        src={`/images/icons/${media.name}.png`}
        alt={`${media.name}`}
        width={20} 
        height={20}
        className={styles.icon} 
        />
        )
        }
    </div>
  </div>
  )
}
