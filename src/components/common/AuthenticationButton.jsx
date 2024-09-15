import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

const AuthButton = () => {
    const {loginWithRedirect, logout, isAuthenticated} = useAuth0();
    const buttonStyle = {
        background:'none',
        border: '2px solid #E2F0F7',
        
        borderRadius: '5px', 
        color: '#e2f0f7',
        paddingLeft:"15px",
        paddingRight:"15px",
        height:"40px",
        lineHeight: '40px',  
        cursor: 'pointer',
        fontSize: '18px',
        textDecoration: 'none',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)', 
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