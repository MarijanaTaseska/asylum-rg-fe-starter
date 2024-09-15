import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

const ProfilePage = () => {
    const {user, isAuthenticated, isLoading} = useAuth0();
    if(isLoading){
        return <div>Loading...</div>;
    }
return (
isAuthenticated && (
    <div style={styles.profileContainer}>
        <div style={styles.card}>
        <img 
        src={user.picture} 
        alt={user.name} 
        style={styles.profileImage} />
        <h2 style={styles.welcomeText}>Welcome, {user.name}!</h2>
        <p style={styles.emailText}>Email: {user.email}</p>
        </div>
    </div>
)
);
};

const styles = {
    profileContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh', // Full viewport height
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', // Gradient background
      padding: '20px',
    },
    card: {
      backgroundColor: '#fff',
      borderRadius: '15px',
      boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)', // Soft shadow for depth
      padding: '40px',
      textAlign: 'center',
      maxWidth: '400px',
      width: '100%',
    },
    profileImage: {
      borderRadius: '50%',
      width: '150px',
      height: '150px',
      marginBottom: '20px', // Space between image and text
    },
    welcomeText: {
      fontSize: '24px',
      color: '#333',
      marginBottom: '10px',
    },
    emailText: {
      fontSize: '16px',
      color: '#777',
    },
  };
  

export default ProfilePage;