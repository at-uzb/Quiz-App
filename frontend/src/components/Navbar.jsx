import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import SearchBar from './SearchBar';
import styles from './styles/navbar.module.css'; 
import AuthContext from '../context/AuthContext';

function Navbar() {

  let {user} = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.brand}>
        <Link to="/">
          <label>IlmSari</label>
        </Link>
      </div>
      <div className={`${styles.links} ${menuOpen ? styles['mobile_links'] : ''}`}>
        <Link to="/create-new-quizz" 
              className={styles.link} 
              onClick={closeMenu}>
          Create Quizz
        </Link>
        <a href="#" className={styles.link} onClick={closeMenu}>Ikkinchi tab</a>
        <SearchBar />
      </div>
      {user ? (
        <Link to={"/" + user.username} className={styles.auth}>
          <img src={"http://127.0.0.1:8000"+user.profile_image} alt="User avatar" className={styles.avatar} />
          <span className={styles.username}>{user.username}</span>
        </Link>
      ):(
        <div className={styles.auth}>
          <Link to="/auth/login/" className={styles.auth_link} onClick={closeMenu}>Kirish</Link>
        </div>
      )}
      <div className={styles['menu_icon']} onClick={toggleMenu}>
        ☰ 
      </div>
    </nav>
  );
}

function NavbarAuth() {
  return (
    <div className={styles.center}>
      <div className={styles.brand}>
        <Link to="/">
          <label>IlmSari</label>
        </Link>
      </div>
    </div>
  )
}

export { Navbar, NavbarAuth };
