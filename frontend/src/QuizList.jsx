import React, { useState, useEffect } from 'react';
import axios from 'axios';
import QuizCard from './components/QuizCard';

const QuizList = () => {
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/quiz/quizzes/')
      .then(response => {
        setQuizzes(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the quizzes!', error);
      });
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.quizGrid}>
        {quizzes.map(quiz => (
          <QuizCard 
            key={quiz.id} 
            context={{
              id: quiz.id,
              title: quiz.title,
              description: quiz.description,
              owner_username: quiz.owner_username,
              image_url: quiz.image_url,
            }} 
          />
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '2rem',
    textAlign: 'center',
  },
  heading: {
    fontSize: '2rem',
    marginBottom: '1rem',
  },
  quizGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: '1rem',
  },
};

export default QuizList;
