import React from "react";
import { nanoid } from "nanoid";

import Question from "./Question";
import spinner from "../images/spinner.svg";

export default function Quiz() {
  // STATE TO HOLD ALL QUESTION OBJECTS RECEIVED FROM OPENTDB.COM
  const [allQuestions, setAllQuestions] = React.useState([]);

  // STATE TO HOLD RANDOMIZED ANSWERS FOR EACH QUESTION
  const [allAnswers, setAllAnswers] = React.useState([]);

  // STATE TO HOLD FORM DATA FOR EACH QUESTION, ALLOWS CONTROLLED INPUTS FOR EACH ANSWER
  const [formData, setFormData] = React.useState([]);

  // STATE FOR FINAL QUIZ SCORE
  const [score, setScore] = React.useState(0);

  // BOOL TO TOGGLE RENDERING RESULTS AND SCORE
  const [gameFinished, setGameFinished] = React.useState(false);

  // BOOL AS TOGGLE FOR SETTING NEW GAME
  const [newGame, setNewGame] = React.useState(false);

  // GET AND STORE RANDOM QUESTIONS FROM OPEN TRIVIA DATABASE API
  React.useEffect(
    function () {
      async function getQuestions() {
        try {
          const resp = await fetch(
            "https://opentdb.com/api.php?amount=5&difficulty=easy&category=9"
          );
          const data = await resp.json();
          setAllQuestions(data.results);
        } catch (error) {
          console.error(error);
        }
      }
      getQuestions();
    },
    [newGame]
  );

  // INITIALIZE FORMDATA STATE / RANDOMIZE AND SET ALLANSWERS STATE
  React.useEffect(
    function () {
      allQuestions.forEach(function (question) {
        const answersArr = [];
        const randomAnswers = [];

        if (question.type === "boolean") {
          randomAnswers.push("True", "False");
        } else {
          answersArr.push(
            question.correct_answer,
            ...question.incorrect_answers
          );

          // RANDOMIZE ANSWERS
          answersArr.forEach(function (answer) {
            if (Math.floor(Math.random() * 2 + 1) === 1) {
              randomAnswers.push(answer);
            } else {
              randomAnswers.unshift(answer);
            }
          });
        }

        setAllAnswers(function (prevAnswers) {
          return [...prevAnswers, randomAnswers];
        });

        setFormData(function (prevFormData) {
          return [...prevFormData, ""];
        });
      });
    },
    [allQuestions]
  );

  // FUNCTION TO MANAGE CONTROLLED RADIO INPUTS AND SET STATE
  function handleChange(event, index) {
    const { value } = event.target;
    setFormData(function (prevFormData) {
      const tempArr = [...prevFormData];
      tempArr.splice(index, 1, value);
      return tempArr;
    });
  }

  // FUNCTION TO HANDLE CHECK ANSWER AND PLAY AGAIN BUTTON
  function handleButtonClick() {
    // CALCULATE SCORE AND SET GAMEFINISHED TO TRUE
    if (!gameFinished) {
      setGameFinished(true);
      allQuestions.forEach(function (question, index) {
        if (formData[index] === question.correct_answer) {
          setScore(function (prevScore) {
            return prevScore + 1;
          });
        }
      });
    }
    // RESET SCORE, GET AND RENDER NEW QUESTIONS
    else {
      setGameFinished(false);
      setScore(0);
      setAllQuestions([]);
      setAllAnswers([]);
      setFormData([]);
      setNewGame(function (prevNewGame) {
        return !prevNewGame;
      });
    }
  }

  // CREATE QUESTION ELEMENTS WITH REUSABLE COMPONENT
  const questionElements = allQuestions.map(function (_, index) {
    // GUARD CLAUSE
    if (!allAnswers) {
      return;
    }

    return (
      <Question
        question={allQuestions[index]}
        questionIndex={index}
        answers={allAnswers[index]}
        gameFinished={gameFinished}
        formData={formData[index]}
        handleChange={(event) => handleChange(event, index)}
        key={nanoid()}
      />
    );
  });

  // RENDER QUESTIONS WHEN AVAILABLE
  if (allAnswers.length > 0) {
    return (
      <div className="quiz">
        {questionElements}
        <div className="results">
          {gameFinished && (
            <p className="results__text">
              You scored {score} / {allQuestions.length} correct answers
            </p>
          )}
          <button className="button" onClick={handleButtonClick}>
            {!gameFinished ? "Check answers" : "Play again"}
          </button>
        </div>
      </div>
    );
  }
  // RENDER SPINNER IF QUESTIONS AND ANSWERS ARE NOT YET AVAILABLE
  else {
    return <img src={spinner} alt="Loading spinner" className="spinner" />;
  }
}
