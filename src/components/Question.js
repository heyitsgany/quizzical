import React from "react";

import { decode } from "html-entities";
import { nanoid } from "nanoid";

export default function Question(props) {
  const answerElements = props.answers.map(function (answer, answerIndex) {
    return (
      <div
        className={`answer ${props.gameFinished ? "answer--checked" : ""}`}
        key={nanoid()}
      >
        <input
          type="radio"
          name={props.questionIndex}
          id={`${props.questionIndex}-${answerIndex}`}
          value={answer}
          checked={props.formData === answer}
          onChange={props.handleChange}
          className={`answer__radio`}
          disabled={props.gameFinished}
        />
        <label
          htmlFor={`${props.questionIndex}-${answerIndex}`}
          className={`answer__label ${
            props.gameFinished && answer === props.question.correct_answer
              ? "answer__label--correct"
              : ""
          }`}
        >
          {decode(answer)}
        </label>
      </div>
    );
  });

  return (
    <div className="question" key={nanoid()}>
      <h2 className="question__question">{decode(props.question.question)}</h2>
      <form className="question__answers">{answerElements}</form>
    </div>
  );
}
