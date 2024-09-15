import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

const AuthButton = () => {
    const {loginWithRedirect, logout, isAuthenticated} = useAuth0();
    const buttonStyle = {
      backgroundColor: '#007BFF', 
      color: '#fff',              
      border: 'none',             
      borderRadius: '8px',        
      padding: '10px 20px',       
      cursor: 'pointer',          
      fontSize: '16px',           
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', 
      transition: 'all 0.3s ease', 
      textAlign: 'center',        
    };
  return isAuthenticated ? (
<button 
style={buttonStyle}
onClick={() => logout({ returnTo: window.location.origin})}>
    Logout
</button>
  ) : (
<button 
style={buttonStyle}
onClick={() => loginWithRedirect()}>
    Login
</button>
  );
};

export default AuthButton;