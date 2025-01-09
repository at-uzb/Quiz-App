import React from 'react';
import styles from './styles/footer.module.css'; // Import the CSS module

function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.content}>
        <p>&copy; 2024 IlmSari. All rights reserved.</p>
        <nav className={styles.nav}>
          <a href="#" className={styles.link}>Privacy Policy</a>
          <a href="#" className={styles.link}>Terms of Service</a>
          <a href="#" className={styles.link}>Contact Us</a>
        </nav>
      </div>
    </footer>
  );
}

export default Footer;
