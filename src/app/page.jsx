import Image from 'next/image'
import styles from './page.module.css'
import Navbar from '@/components/Navbar/Navbar'
import Footer from '@/components/Footer/Footer'
import ChatSidebar from '@/components/ChatSidebar/ChatSidebar'
import ChatConversation from '@/components/ChatConversation/ChatConversation'

export default function Home() {
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
  )
}
