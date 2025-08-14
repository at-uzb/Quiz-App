import React, { useState, useEffect, useContext } from 'react';
import api from "./api/api";
import { useParams } from 'react-router-dom';
import AuthContext from './context/AuthContext';
import { useNavigate } from "react-router-dom"
import './quiz.css';


function Quiz() {
  const param = useParams();
  const [quizzes, setQuizzes] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});
  const [result, setResult] = useState(null);
  const { loading } = useContext(AuthContext)
  let navigate = useNavigate();

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
        navigate(`/quiz/${param.quizId}/`)
      })
      .catch((error) => {
        console.error('There was an error submitting the quiz!', error);
      });
  };

  return (
    <div>
      {quizzes ? ( 
        <>

          {quizzes.completed.done ? (
            <div className="quiz-results">
              <p className='completed'><b>You’ve completed this quiz.</b></p>
              <p><b>Your score:</b> {quizzes.completed.score}%</p>

              <h3>Results:</h3>
              <ul>
                {quizzes.completed.results.map((r, idx) => (
                  <li key={idx} className={`result-item ${r.is_correct ? "correct" : "incorrect"}`}>
                    <strong>{r.question}</strong><br />
                      <p className="result-answer">Your answer: {r.selected_answer || "No answer"}</p>
                      <p className="result-answer">Correct answer: {r.correct_answer}</p>
                    {r.is_correct ? "✅ Correct" : "❌ Incorrect"}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <>
              {quizzes.questions && quizzes.questions.map((question, order) => (
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
          )}


        </>
      ) : (
        <p>Loading quiz...</p>
      )}
    </div>
  );
}

export default Quiz;
