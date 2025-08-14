import React, { useState } from 'react';
import api, {setAuthToken} from '../api/api';
import { Link, useNavigate } from 'react-router-dom';
import styles from './styles/auth.module.css'; 
import { useContext } from "react";
import AuthContext from "../context/AuthContext";



function Register() {
  let navigate = useNavigate();
  const { setUser } = useContext(AuthContext);
  const [formData, setFormData] = useState(
    { 
      first_name: '',
      email: '', 
      password: '', 
      password_confirm: '',
    });
  const [id, setId] = useState(null);
  const [confirm, setConfirm] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(true); 
  const [message, setMessage] = useState('');
  const [verify, setVerify] = useState(false);
  const [code, setCode] = useState('');
  const [rload, setRLoat] = useState(false)
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleConfirm = (e) => {
    const value = e.target.value;
    setPasswordsMatch(value === formData.password);

  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setRLoat(true)
    try {
      const response = await api.post('/users/signup/', formData);
      if (response.data.error) {
        setMessage('Signup failed: ' + response.data.message.email);
        setRLoat(false)
      } else {
        setId(response.data.id); 
        console.log('User ID:', response.data.id);  
        setVerify(true);
        setRLoat(false)
      }
    } catch (error) {
      setMessage('SignUp failed: ' + error.response.data.message);
      setRLoat(false)
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!id) {
      setMessage("No user ID found. Please register again.");
      return;
    }
    try {
      const response = await api.post('/users/verify-email/', {
        id: id,
        code: code,
      });
      console.log("Verify response:", response);


      if (!response || !response.data) {
        throw new Error("No response data from verify API");
      }

      const { refresh, access } = response.data;
      setAuthToken(access);
      localStorage.setItem('access', access);
      localStorage.setItem('refresh', refresh);

      await api.get("users/dashboard/").then((res) => {
        if (res.status === 200) {
          setUser(res.data);
        }
      });
      setMessage("✅ Email verified! Redirecting...");
      setTimeout(() => navigate("/"), 1000);

    } catch (error) {
      console.log("Verify error:", error);
      console.log("Error response:", error.response);
      setMessage(error.response?.data?.message || "Verification failed");
    }
  }

  const handleResendCode = async () => {
    if (!id) {
      setMessage("❌ No user ID found. Please register again.");
      return;
    }

    try {
      const response = await api.post('/users/resend-vcode/', { id });
      setMessage(`✅ ${response.data.message}`);
    } catch (error) {
      setMessage(`❌ ${error.response?.data?.message || "Failed to resend code"}`);
    }
  };

  return (
    <div className={styles.authContainer}>
      {verify ? (
        <>
        <h2 className={styles.title}>Email verification</h2>
        <form onSubmit={handleVerify} className={styles.form}>
            <label htmlFor="code">Code</label>
            <input
              type='text'
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder='Enter verification code'
              style={{
                width: '100%',
                padding: '10px',
                fontSize: '16px',
                border: '1px solid #ccc',
                borderRadius: '6px',
                marginBottom: '12px',
                boxSizing: 'border-box',
                outline: 'none',
                transition: 'border-color 0.2s ease',
              }}
              onFocus={(e) => e.target.style.borderColor = '#007BFF'}
              onBlur={(e) => e.target.style.borderColor = '#ccc'}
              required
            />
            <button type="submit" className={styles.button}>Verify</button>
            {message && <div style={{ color: message.includes('✅') ? 'green' : 'red' }}>{message}</div>}

            <p style={{ marginTop: '10px' }}>
              Didn’t get the code?{" "}
              <button
                type="button"
                style={{
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  color: 'blue',
                  textDecoration: 'underline',
                  cursor: 'pointer'
                }}
                onClick={handleResendCode}
              >
                Resend
              </button>
            </p>
        </form>
        </>
      ):(
        <>
        <h2 className={styles.title}>Registeration</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="first_name">Full Name</label>
            <input
              type="text"
              id="first_name"
              name='first_name'
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
          <button type="submit" className={styles.button}>
          {rload?'Loading':'Register'}</button>
        </form>
        <div className={styles.question + ' ' + styles.lower}>
          <div className={styles.line}></div>
          <div>Do you have Quiz-App account?</div>
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
