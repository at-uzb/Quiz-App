import React from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

const CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID';

const WithGoogle = () => {
  const handleSuccess = (response) => {
    console.log('Login Success:', response);
    // Handle the user information and authentication process here
  };

  const handleError = () => {
    console.log('Login Failed');
    // Handle login failure here
  };

  return (
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={handleError}
      />
    </GoogleOAuthProvider>
  );
};

export default WithGoogle;
