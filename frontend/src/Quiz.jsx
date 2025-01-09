import React, { useState, useEffect, useContext } from 'react';
import api from "./api/api";
import { useParams } from 'react-router-dom';
import AuthContext from './context/AuthContext';

function Quiz() {
  const param = useParams();
  const [quizzes, setQuizzes] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});
  const [result, setResult] = useState(null);
  const { loading } = useContext(AuthContext)

  useEffect(() => {
    if(!loading) {
      api.get(`http://127.0.0.1:8000/quiz/${param.quizId}`)
      .then(response => {
        setQuizzes(response.data);
        console.log(response.data);

        const initialAnswers = {};
        response.data.questions.forEach(question => {
          initialAnswers[question.id] = 0; 
        });
        setUserAnswers(initialAnswers);
      })
      .catch(error => {
        console.error('There was an error fetching the quizzes!', error);
      });
    }

  }, [param.quizId, loading]);

  const handleAnswerSelect = (questionId, answerId) => {
    setUserAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: answerId,
    }));
  };

  const handleSubmit = () => {
    console.log(userAnswers);
    api
      .post(`http://127.0.0.1:8000/quiz/${param.quizId}/submit/`, { answers: userAnswers })
      .then((response) => {
        const { score, total_questions } = response.data;
        setResult(`You scored ${score} out of ${total_questions}`);
      })
      .catch((error) => {
        console.error('There was an error submitting the quiz!', error);
      });
  };

  return (
    <div>
      {quizzes ? ( 
        <>
          <h1>{quizzes.title}</h1>

          {quizzes.questions && quizzes.questions.map((question, order) => ( // Check if questions array exists
            <div key={question.id}>
              <strong>{order + 1}. {question.question_text}</strong>
              <ul>
                {question.answers.map((answer) => (
                  <li key={answer.id}>
                    <label>
                      <input
                        type="radio"
                        name={`question-${question.id}`}
                        value={answer.id}
                        checked={userAnswers[question.id] === answer.id}
                        onChange={() => handleAnswerSelect(question.id, answer.id)}
                      />
                      {answer.answer_text}
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <button onClick={handleSubmit}>Submit</button>
          {result && <p>{result}</p>}
        </>
      ) : (
        <p>Loading quiz...</p>
      )}
    </div>
  );
}

export default Quiz;
