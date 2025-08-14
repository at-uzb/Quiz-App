import React, { useContext, useState } from 'react';
import styles from './styles/create.module.css';
import { useNavigate } from "react-router-dom"
import api from '../api/api';
import AuthContext from '../context/AuthContext';

function CreateQuiz() {
  const { loading } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  let navigate = useNavigate();
  const [quizData, setQuizData] = useState({
    title: '',
    description: '',
    questions: [
      {
        question_text: '',
        answers: [
          { answer_text: '', is_correct: false },
          { answer_text: '', is_correct: false },
        ],
      },
    ],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setQuizData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleQuestionChange = (questionIndex, field, value) => {
    setQuizData((prev) => {
      const updatedQuestions = [...prev.questions];
      updatedQuestions[questionIndex] = {
        ...updatedQuestions[questionIndex],
        [field]: value,
      };
      return { ...prev, questions: updatedQuestions };
    });
  };

  const handleAnswerChange = (questionIndex, answerIndex, field, value) => {
    setQuizData((prev) => {
      const updatedQuestions = [...prev.questions];
      const updatedAnswers = [...updatedQuestions[questionIndex].answers];
      updatedAnswers[answerIndex] = {
        ...updatedAnswers[answerIndex],
        [field]: value,
      };
      updatedQuestions[questionIndex].answers = updatedAnswers;
      return { ...prev, questions: updatedQuestions };
    });
  };

  const handleCorrectAnswerChange = (questionIndex, answerIndex) => {
    setQuizData((prev) => {
      const updatedQuestions = [...prev.questions];
      const updatedAnswers = updatedQuestions[questionIndex].answers.map((answer, index) => ({
        ...answer,
        is_correct: index === answerIndex, 
      }));
      updatedQuestions[questionIndex].answers = updatedAnswers;
      return { ...prev, questions: updatedQuestions };
    });
  };
  
  const addQuestion = () => {
    setQuizData((prev) => ({
      ...prev,
      questions: [
        ...prev.questions,
        { question_text: '', answers: [
          { answer_text: '', is_correct: false },
          { answer_text: '', is_correct: false }
        ] },
      ],
    }));
  };

  const addAnswer = (questionIndex) => {
    setQuizData((prev) => {
      const updatedQuestions = [...prev.questions];

      if (updatedQuestions[questionIndex].answers.length >= 8) {
        alert("You can only add up to 8 answers.");
        return prev;
      }
      
      updatedQuestions[questionIndex] = {
        ...updatedQuestions[questionIndex],
        answers: [
          ...updatedQuestions[questionIndex].answers,
          { answer_text: '', is_correct: false },
        ],
      };
      return { ...prev, questions: updatedQuestions };
    });
  };

  const remAnswer = (questionIndex) => {
    setQuizData((prev) => {
      const updatedQuestions = [...prev.questions];

      if(updatedQuestions[questionIndex].answers.length <= 2) {
        alert("For question there should be at least 2 options");
        return prev;
      }

      updatedQuestions[questionIndex] = {
        ...updatedQuestions[questionIndex],
        answers: updatedQuestions[questionIndex].answers.slice(0, -1),
      }
      return { ...prev, questions: updatedQuestions };
    })
  }

  const remQuestion = (questionIndex) => {
    setQuizData((prev) => {
      if (prev.questions.length <= 1) {
        alert("You must have at least one question.");
        return prev;
      }
  
      const updatedQuestions = [...prev.questions];
      updatedQuestions.splice(questionIndex, 1);
  
      return { ...prev, questions: updatedQuestions };
    });
  };
  
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(quizData)
    if (loading || isLoading) return;

    setIsLoading(true);
    try {
      const response = await api.post('quiz/create-quizz/', 
        { 
          title: quizData.title,
          description: quizData.description,
          questions: quizData.questions
         });
      console.log(JSON.stringify(quizData, null, 2));
      console.log('Quiz submitted successfully:', response.data);
      navigate(`/quiz/${response.data.id}`)
    } catch (error) {
      console.error('Error submitting quiz:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Create a New Quiz</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.mainGroup}>
          <div className={styles.formGroup}>
            <label htmlFor="title" className={styles.label}>
              Title ({quizData?.title?.length}/100)
            </label>
            <input
              id="title"
              type="text"
              name="title"
              value={quizData.title}
              onChange={handleChange}
              placeholder="Enter quiz title"
              className={styles.input}
              maxLength={100}
              required
            />
          </div>

          {/* Description Input */}
          <div className={styles.desCon}>
            <div className={styles.formGroup + ' ' + styles.desc}>
              <label htmlFor="description" className={styles.label}>
                Description ({quizData.description.length}/3000)
              </label>
              <textarea
                id="description"
                name="description"
                value={quizData.description}
                onChange={handleChange}
                placeholder="Enter quiz description"
                className={styles.textarea}
                maxLength={3000}
                required
              />
            </div>

            <div className={styles.camera}>
              <img alt='icon' src='/images/camera.png'/>
            </div>
          </div>
        </div>
        <div className={"line "+styles.line}></div>
        {/* Questions */}
        <div className={styles.questions}>
          <h3>Questions</h3>
          {quizData.questions.map((q, qIndex) => (
            <div key={qIndex} className={styles.questionBlock}>
              <label className={styles.label}>Question {qIndex + 1}</label>
              <input
                type="text"
                value={q.question_text}
                onChange={(e) =>
                  handleQuestionChange(qIndex, 'question_text', e.target.value)
                }
                placeholder="Enter question"
                className={styles.input}
                required
              />

              {/* Answers */}
              {q.answers.map((a, aIndex) => (
                <div key={aIndex} className={styles.answerBlock}>
                  <span className={styles.letters}>
                    {String.fromCharCode(65 + aIndex)}
                  </span>
                  <input
                    type="text"
                    value={a.answer_text}
                    onChange={(e) =>
                      handleAnswerChange(qIndex, aIndex, 'answer_text', e.target.value)
                    }
                    placeholder="Enter answer text"
                    className={styles.input}
                    required
                  />
                  <label className={styles.radioLabel}>
                    <input
                      type="radio"
                      name={`correct-answer-${qIndex}`}
                      checked={a.is_correct}
                      onChange={() =>
                        handleCorrectAnswerChange(qIndex, aIndex)
                      }
                    />
                  </label>
                </div>
              ))}
              <div className={styles.addSub}>
                <div
                  onClick={() => addAnswer(qIndex)}
                  className={styles.addButton}
                  >
                    Add Answer +
                  </div>

                  <div
                  onClick={() => remAnswer(qIndex)}
                  className={styles.addButton}
                  >
                    Remove Answer -
                  </div>
              </div>

            </div>
          ))}
          <div className={styles.subAdd}>
            <div onClick={addQuestion} className={styles.addButton}>
              Add Question +
            </div>
            <div onClick={remQuestion} className={styles.addButton}>
              Remove Question -
            </div>
          </div>

        </div>

        {/* Submit Button */}
        <button type="submit" className={styles.submitButton} disabled={isLoading}>
          {isLoading ? 'Submitting...' : 'Submit Quiz'}
        </button>
      </form>
    </div>
  );
}

export default CreateQuiz;
