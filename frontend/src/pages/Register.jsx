import React, { useState } from 'react';
import api, {setAuthToken} from '../api/api';
import { Link, useNavigate } from 'react-router-dom';
import styles from './styles/auth.module.css'; // Import the CSS module

function Register() {
  let navigate = useNavigate();
  const [formData, setFormData] = useState(
    { 
      name: '',
      email: '', 
      password: '', 
      password_confirm: '',
    });
  const [id, setId] = useState(1);
  const [confirm, setConfirm] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(true); 
  const [message, setMessage] = useState('');
  const [verify, setVerify] = useState(false);
  const [code, setCode] = useState(1);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleConfirm = (e) => {
    const value = e.target.value;
    setPasswordsMatch(value === formData.password);

  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/users/signup/', formData);
      if (response.data.error) {
        setMessage('Signup failed: ' + response.data.message.email);
      } else {
        setId(response.data.id);  // Set the user ID from the response
        console.log('User ID:', response.data.id);  // Log the ID directly from the response
        setVerify(true);  // Set verify state to true
      }
    } catch (error) {
      setMessage('SignUp failed: ' + error.response.data.message);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/users/verify/', {
        id: id,
        code: code,
      });
      const { refresh, access } = response.data;
      setAuthToken(access);
      localStorage.setItem('accessToken', access);
      localStorage.setItem('refreshToken', refresh);
      navigate("/")
    } catch (error) {
      setMessage(error.response.data.message);
    }
  }

  return (
    <div className={styles.authContainer}>
      {verify ? (
        <>
        <h2 className={styles.title}>Email verification</h2>
        <form onSubmit={handleVerify} className={styles.form}>
          <input
            type='text'
            onChange={(e) => setCode(e.target.value)}
            required 
          />
        </form>
        </>
      ):(
        <>
        <h2 className={styles.title}>Registeration</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name='name'
              placeholder='Enter your full name'
              onChange={handleInputChange}
              autoComplete='on'
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name='email'
              placeholder='Enter your email'
              onChange={handleInputChange}
              autoComplete='on'
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name='password'
              placeholder='Choose strong password'
              onChange={(e) => {
                handleInputChange(e);
                setConfirm(true);
              }}
              autoComplete='off'
              required
            />
          </div>
          {confirm ? (
            <div className={styles.inputGroup}>
              <label htmlFor="password2">Confirm Password</label>
              <input
                type="password"
                id="password2"
                name='password_confirm'
                onChange={(e) => {
                  handleInputChange(e);
                  handleConfirm(e);
                }}
                autoComplete='off'
                required
              />
              {!passwordsMatch && (
                <span style={{ color: 'red' }}>Passwords do not match</span>
              )}
              <span style={{ color: 'red' }}>{message}</span>
            </div>
          ):(<></>)}
          <button type="submit" className={styles.button}>Register</button>
        </form>
        <div className={styles.question + ' ' + styles.lower}>
          <div className={styles.line}></div>
          <div>Do you have IlmSari account?</div>
          <div className={styles.line}></div>
        </div>
        <Link to="/auth/login/" className={styles.switch}>
          Login
        </Link>
        </>
      )}
    </div>
  );
}

export default Register;
