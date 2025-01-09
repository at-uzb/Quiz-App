import React from 'react';
import { Link } from 'react-router-dom';

function QuizCard({ context }) {
  const { id, title, description, owner_username, image_url } = context;
  const baseUrl = "http://127.0.0.1:8000";
  return (
    <Link to = {"quiz/" + id} className="quiz-card" style={styles.card}>
      <img 
        src={baseUrl + image_url || '/default_image.jpg'} 
        alt={title} 
        style={styles.image} 
      />
      <div style={styles.content}>
        <h2 style={styles.title}>{title}</h2>
        <p style={styles.description}>
            {description.length > 100 ? description.slice(0, 100) + '...' : description}
        </p>
        <div style={styles.owner}>
          Created by: <Link to = {"/" + owner_username} >{owner_username}</Link>
        </div>
      </div>
    </Link>
  );
}
  

const styles = {
  card: {
    border: '1px solid #ddd',
    borderRadius: '8px',
    overflow: 'hidden',
    width: '300px',
    height: '360px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    margin: '1rem',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column'
  },
  image: {
    width: '100%',
    height: '180px',
    objectFit: 'cover',
  },
  content: {
    padding: '1rem',
    display: 'flex',
    flexDirection: 'column', 
    height: '100%', 
  },
  title: {
    fontSize: '1.5rem',
    margin: '0 0 0.5rem',
  },
  description: {
    fontSize: '1rem',
    margin: '0 0 1rem',
    color: '#555',
  },
  owner: {
    fontSize: '0.9rem',
    color: '#888',
    marginTop: 'auto',
  },
};

export default QuizCard;
