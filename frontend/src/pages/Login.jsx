import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import styles from './styles/auth.module.css'; 
import WithGoogle from '../components/WithGoogle';
import AuthContext from '../context/AuthContext';


function Login() { 
  let { loginUser } = useContext(AuthContext)

  return (
    <div className={styles.authContainer}>
      <h2 className={styles.title}>Login to IlmSari</h2>
      <form onSubmit={loginUser} className={styles.form}>
        <div className={styles.inputGroup}>
          <label htmlFor="username">Email</label>
          <input 
            type="username" 
            name="username" 
            placeholder="Email or username" 
            autoComplete='on'
            required 
          />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="password">Password</label>
          <input 
            type="password" 
            name="password" 
            placeholder="Password" 
            autoComplete='on' 
            required 
          />
        </div>
        <button type="submit" className={styles.button}>Login</button>
      </form>
      <div className={styles.question}>
        <div className={styles.line}></div>
        <div>or</div>
        <div className={styles.line}></div>
      </div>
      {/* <WithGoogle/> */}
      <div className={styles.question + ' ' + styles.lower}>
        <div className={styles.line}></div>
        <div>Don't have IlmSari account?</div>
        <div className={styles.line}></div>
      </div>
      <Link to="/auth/register/" className={styles.switch}>
        SignUp
      </Link>
    </div>
  );
}

export default Login;
